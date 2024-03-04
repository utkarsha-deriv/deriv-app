import React from 'react';
import { Field, Formik } from 'formik';
import className from 'classnames';
import {
    Div100vhContainer,
    Modal,
    ThemedScrollbars,
    FormSubmitButton,
    AutoHeightWrapper,
    StaticUrl,
} from '@deriv/components';
import { isDesktop, isMobile, PlatformContext, TBrokerCodes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import CheckboxField from './checkbox-field';
import { SharedMessage, BrokerSpecificMessage, Hr } from './terms-of-use-messages';
import './terms-of-use.scss';
import FatcaDeclaration from './fatca-declaration';

type TTermsOfUseFormProps = {
    agreed_tos: boolean;
    agreed_tnc: boolean;
    fatca_declaration: '0' | '1';
};

type TTermsOfUseProps = {
    getCurrentStep: () => number;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSave: (current_step: number, values: TTermsOfUseFormProps) => void;
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    onSubmit: (
        current_step: number | null,
        values: TTermsOfUseFormProps,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    value: TTermsOfUseFormProps;
    real_account_signup_target: TBrokerCodes;
    form_error?: string;
    is_multi_account: boolean;
};

/**
 * Terms of use component for account signup
 * @name TermsOfUse
 * @param getCurrentStep - function to get current step
 * @param onCancel - function to cancel account signup
 * @param onSave - To handle click on save button
 * @param goToPreviousStep - function to go to previous step
 * @param goToNextStep - function to go to next step
 * @param onSubmit - function to submit form
 * @param value - form values
 * @param real_account_signup_target - broker code
 * @param form_error - form error
 * @param props - other props
 * @returns React node
 */
const TermsOfUse = ({
    getCurrentStep,
    onCancel,
    onSave,
    goToPreviousStep,
    goToNextStep,
    onSubmit,
    value,
    real_account_signup_target,
    ...props
}: TTermsOfUseProps) => {
    const { is_appstore } = React.useContext(PlatformContext);

    const handleCancel = () => {
        const current_step = getCurrentStep() - 1;
        onCancel(current_step, goToPreviousStep);
    };

    const getSubmitButtonLabel = () => {
        if (is_appstore) {
            return localize('Finish');
        }
        return localize('Add account');
    };

    const onValuesChange = (values: TTermsOfUseFormProps) => {
        const current_step = (getCurrentStep?.() || 1) - 1;
        onSave(current_step, values);
    };

    return (
        <Formik
            initialValues={value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
            validate={onValuesChange}
        >
            {({ handleSubmit, values, isSubmitting }) => (
                <AutoHeightWrapper default_height={380} height_offset={isDesktop() ? 81 : null}>
                    {({ setRef }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <Div100vhContainer
                                className='details-form'
                                height_offset={is_appstore ? '242px' : '110px'}
                                is_disabled={isDesktop()}
                            >
                                <ThemedScrollbars>
                                    <div className={className('details-form__elements', 'terms-of-use')}>
                                        <BrokerSpecificMessage target={real_account_signup_target} />
                                        <Hr />
                                        <Field
                                            component={FatcaDeclaration}
                                            name='fatca_declaration'
                                            is_disabled={props.is_multi_account}
                                        />
                                        <Hr />
                                        <SharedMessage />
                                        <Hr />
                                        <Field
                                            component={CheckboxField}
                                            className='terms-of-use__checkbox'
                                            name='agreed_tos'
                                            id='agreed_tos'
                                            label={localize(
                                                'I am not a PEP, and I have not been a PEP in the last 12 months.'
                                            )}
                                            label_font_size={isDesktop() ? 'xs' : 'xxs'}
                                        />
                                        <Hr />
                                        <Field
                                            component={CheckboxField}
                                            label_font_size={isDesktop() ? 'xs' : 'xxs'}
                                            className='terms-of-use__checkbox'
                                            name='agreed_tnc'
                                            id='agreed_tnc'
                                            label={
                                                <Localize
                                                    i18n_default_text='I agree to the <0>terms and conditions</0>.'
                                                    components={[
                                                        <StaticUrl
                                                            key={0}
                                                            className='link'
                                                            href='/terms-and-conditions'
                                                        />,
                                                    ]}
                                                />
                                            }
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={
                                        isSubmitting ||
                                        !values.agreed_tos ||
                                        !values.agreed_tnc ||
                                        !values.fatca_declaration
                                    }
                                    label={getSubmitButtonLabel()}
                                    has_cancel
                                    is_absolute={isMobile()}
                                    onCancel={() => handleCancel()}
                                    cancel_label={localize('Previous')}
                                    form_error={props.form_error}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default TermsOfUse;
