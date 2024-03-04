import { Button, Modal, Text, PasswordInput, FormSubmitButton, PasswordMeter, Loading } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS, WS, validLength, validPassword, getErrorMessages } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';
import { Formik, FormikErrors, FormikHelpers, FormikProps } from 'formik';
import { TCFDPasswordFormValues } from 'Containers/cfd-password-modal';

const MT5MigrationBackSideContent = observer(() => {
    const { ui, common, client } = useStore();
    const { toggleMT5MigrationModal, setMT5MigrationModalEnabled, is_mobile } = ui;
    const { email } = client;
    const { setAppstorePlatform } = common;
    const { setJurisdictionSelectedShortcode, setSentEmailModalStatus, submitMt5Password } = useCfdStore();
    const { getEligibleAccountToMigrate } = useMT5SVGEligibleToMigrate();
    const { setShowModalFrontSide, setMigrationError } = useMT5MigrationModalContext();
    const formik_ref = React.useRef<FormikProps<TCFDPasswordFormValues>>(null);

    const initial_values: TCFDPasswordFormValues = {
        password: '',
    };

    const header_size = is_mobile ? 'xs' : 's';
    const content_size = is_mobile ? 'xxs' : 'xs';

    const closeModal = () => {
        setShowModalFrontSide(true);
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getEligibleAccountToMigrate());
        setMT5MigrationModalEnabled(true);
        toggleMT5MigrationModal();
    };

    const onConfirmMigration = (values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) => {
        submitMt5Password(values, actions).then(() => {
            if (formik_ref.current?.status?.error_message) {
                setMigrationError(formik_ref.current?.status?.error_message);
            }
            closeModal();
        });
    };

    const onForgotPassword = () => {
        closeModal();
        WS.verifyEmail(email, 'trading_platform_mt5_password_reset', {
            url_parameters: {
                redirect_to: 10,
            },
        });
        setSentEmailModalStatus(true);
    };

    const validatePassword = (values: TCFDPasswordFormValues) => {
        const errors: FormikErrors<TCFDPasswordFormValues> = {};
        if (
            !validLength(values.password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    return (
        <Formik
            initialValues={initial_values}
            enableReinitialize
            validate={validatePassword}
            innerRef={formik_ref}
            validateOnMount
            onSubmit={onConfirmMigration}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form onSubmit={handleSubmit}>
                    <div className='mt5-migration-modal__container'>
                        {isSubmitting ? (
                            <Loading className='mt5-migration-modal__loading' />
                        ) : (
                            <React.Fragment>
                                <div className='mt5-migration-modal__password-header-container'>
                                    <Text as='p' weight='bold' size={header_size} align='center'>
                                        <Localize i18n_default_text='Enter your Deriv MT5 password' />
                                    </Text>
                                    <Text as='p' size={content_size} align='center'>
                                        <Localize i18n_default_text='Enter your Deriv MT5 password to upgrade your account(s).' />
                                    </Text>
                                </div>
                                <div className='mt5-migration-modal__password-input-container'>
                                    <PasswordMeter
                                        input={values.password}
                                        has_error={touched.password && errors.password}
                                        custom_feedback_messages={getErrorMessages().password_warnings}
                                    >
                                        <PasswordInput
                                            autoComplete='off'
                                            label={localize('Deriv MT5 password')}
                                            error={touched.password && errors.password}
                                            name='password'
                                            value={values.password}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </PasswordMeter>
                                </div>
                                <div className='mt5-migration-modal__password-forgot-container'>
                                    <Button type='button' large secondary onClick={onForgotPassword}>
                                        <Localize i18n_default_text='Forgot password?' />
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <Modal.Footer has_separator>
                        <FormSubmitButton
                            is_disabled={!!errors.password || isSubmitting}
                            is_absolute={is_mobile}
                            label={localize('Upgrade')}
                        />
                    </Modal.Footer>
                </form>
            )}
        </Formik>
    );
});

export default MT5MigrationBackSideContent;
