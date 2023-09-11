import React from 'react';
import { Field, useFormikContext } from 'formik';
import classNames from 'classnames';
import {
    Autocomplete,
    Checkbox,
    Dropdown,
    DesktopWrapper,
    MobileWrapper,
    Popover,
    RadioGroup,
    SelectNative,
    Text,
} from '@deriv/components';
import { getLegalEntityName, isDesktop, isMobile, routes, validPhone } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import InlineNoteWithIcon from 'Components/inline-note-with-icon';
import FormBodySection from 'Components/form-body-section';
import { DateOfBirthField, FormInputField } from 'Components/forms/form-fields';
import { Link } from 'react-router-dom';
import { getEmploymentStatusList } from 'Sections/Assessment/FinancialAssessment/financial-information-list';
import { isFieldImmutable } from 'Helpers/utils';

const PersonalDetailsForm = props => {
    const {
        is_virtual,
        is_mf,
        is_svg,
        is_qualified_for_idv,
        should_hide_helper_image,
        is_appstore,
        editable_fields = [],
        has_real_account,
        residence_list,
        is_fully_authenticated,
        account_opening_reason_list,
        closeRealAccountSignup,
        salutation_list,
        is_rendered_for_onfido,
        should_close_tooltip,
        setShouldCloseTooltip,
        class_name,
    } = props;
    const autocomplete_value = 'none';
    const PoiNameDobExampleIcon = PoiNameDobExample;

    const [is_tax_residence_popover_open, setIsTaxResidencePopoverOpen] = React.useState(false);
    const [is_tin_popover_open, setIsTinPopoverOpen] = React.useState(false);

    const { errors, touched, values, setFieldValue, handleChange, handleBlur, setFieldTouched } = useFormikContext();

    React.useEffect(() => {
        if (should_close_tooltip) {
            handleToolTipStatus();
            setShouldCloseTooltip(false);
        }
    }, [should_close_tooltip, handleToolTipStatus, setShouldCloseTooltip]);

    const getNameAndDobLabels = () => {
        const is_asterisk_needed = is_svg || is_mf || is_rendered_for_onfido || is_qualified_for_idv;
        const first_name_label = is_appstore || is_asterisk_needed ? localize('First name*') : localize('First name');
        const last_name_text = is_asterisk_needed ? localize('Last name*') : localize('Last name');
        const last_name_label = is_appstore ? localize('Family name*') : last_name_text;
        const dob_label = is_appstore || is_asterisk_needed ? localize('Date of birth*') : localize('Date of birth');

        return {
            first_name_label,
            last_name_label,
            dob_label,
        };
    };

    const getFieldHint = field_name =>
        is_qualified_for_idv || is_rendered_for_onfido ? (
            <Localize
                i18n_default_text={'Your {{ field_name }} as in your identity document'}
                values={{ field_name }}
            />
        ) : (
            <Localize
                i18n_default_text={'Please enter your {{ field_name }} as in your official identity documents.'}
                values={{ field_name }}
            />
        );

    const handleToolTipStatus = React.useCallback(() => {
        if (is_tax_residence_popover_open) {
            setIsTaxResidencePopoverOpen(false);
        }
        if (is_tin_popover_open) {
            setIsTinPopoverOpen(false);
        }
    }, [is_tax_residence_popover_open, is_tin_popover_open]);

    const name_dob_clarification_message = (
        <Localize
            i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
            components={[<strong key={0} />]}
        />
    );

    // need to put this check related to DIEL clients
    const is_svg_only = is_svg && !is_mf;

    return (
        <React.Fragment>
            <div
                className={classNames(class_name, {
                    'account-form__poi-confirm-example': is_qualified_for_idv,
                })}
            >
                {(is_qualified_for_idv || is_rendered_for_onfido) && !should_hide_helper_image && (
                    <InlineNoteWithIcon
                        message={name_dob_clarification_message}
                        font_size={isMobile() ? 'xxxs' : 'xs'}
                    />
                )}
                <FormBodySection
                    has_side_note={(is_qualified_for_idv || is_rendered_for_onfido) && !should_hide_helper_image}
                    side_note={<PoiNameDobExampleIcon />}
                >
                    <fieldset className='account-form__fieldset'>
                        {'salutation' in values && (
                            <div>
                                <Text size={isMobile() ? 'xs' : 'xxs'} align={isMobile() && 'center'}>
                                    {is_virtual ? (
                                        localize(
                                            'Please remember that it is your responsibility to keep your answers accurate and up to date. You can update your personal details at any time in your account settings.'
                                        )
                                    ) : (
                                        <Localize
                                            i18n_default_text='Please remember that it is your responsibility to keep your answers accurate and up to date. You can update your personal details at any time in your <0>account settings</0>.'
                                            components={[
                                                <Link
                                                    to={routes.personal_details}
                                                    key={0}
                                                    className='link'
                                                    onClick={closeRealAccountSignup}
                                                />,
                                            ]}
                                        />
                                    )}
                                </Text>
                            </div>
                        )}
                        {!is_qualified_for_idv && !is_appstore && !is_rendered_for_onfido && (
                            <FormSubHeader
                                title={'salutation' in values ? localize('Title and name') : localize('Name')}
                            />
                        )}
                        {'salutation' in values && (
                            <RadioGroup
                                className='dc-radio__input'
                                name='salutation'
                                selected={values.salutation}
                                onToggle={e => {
                                    e.persist();
                                    setFieldValue('salutation', e.target.value);
                                }}
                                required
                            >
                                {salutation_list.map(item => (
                                    <RadioGroup.Item
                                        key={item.value}
                                        label={item.label}
                                        value={item.value}
                                        disabled={
                                            !!values.salutation && isFieldImmutable('salutation', editable_fields)
                                        }
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {'first_name' in values && (
                            <FormInputField
                                name='first_name'
                                required={is_svg || is_appstore}
                                label={getNameAndDobLabels().first_name_label}
                                hint={getFieldHint(localize('first name'))}
                                disabled={
                                    isFieldImmutable('first_name', editable_fields) ||
                                    (values?.first_name && has_real_account)
                                }
                                placeholder={localize('John')}
                                data-testid='first_name'
                            />
                        )}
                        {'last_name' in values && (
                            <FormInputField
                                name='last_name'
                                required={is_svg || is_appstore}
                                label={getNameAndDobLabels().last_name_label}
                                hint={getFieldHint(localize('last name'))}
                                disabled={
                                    isFieldImmutable('last_name', editable_fields) ||
                                    (values?.last_name && has_real_account)
                                }
                                placeholder={localize('Doe')}
                                data-testid='last_name'
                            />
                        )}
                        {!is_appstore && !is_qualified_for_idv && !is_rendered_for_onfido && (
                            <FormSubHeader title={localize('Other details')} />
                        )}
                        {'date_of_birth' in values && (
                            <DateOfBirthField
                                name='date_of_birth'
                                required={is_svg || is_appstore}
                                label={getNameAndDobLabels().dob_label}
                                hint={getFieldHint(localize('date of birth'))}
                                disabled={
                                    isFieldImmutable('date_of_birth', editable_fields) ||
                                    (values?.date_of_birth && has_real_account)
                                }
                                placeholder={localize('01-07-1999')}
                                portal_id={is_appstore ? '' : 'modal_root'}
                                data_testid='date_of_birth'
                            />
                        )}
                        {!is_svg_only && 'place_of_birth' in values && (
                            <PlaceOfBirthField
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                                disabled={isFieldImmutable('place_of_birth', editable_fields)}
                                residence_list={residence_list}
                                required
                            />
                        )}
                        {'citizen' in values && (
                            <Field name='citizen'>
                                {({ field }) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                data-lpignore='true'
                                                autoComplete={autocomplete_value} // prevent chrome autocomplete
                                                type='text'
                                                label={is_mf ? localize('Citizenship*') : localize('Citizenship')}
                                                error={touched.citizen && errors.citizen}
                                                disabled={
                                                    (values?.citizen && is_fully_authenticated) ||
                                                    isFieldImmutable('citizen', editable_fields) ||
                                                    (values?.citizen && has_real_account)
                                                }
                                                list_items={residence_list}
                                                onItemSelection={({ value, text }) =>
                                                    setFieldValue('citizen', value ? text : '', true)
                                                }
                                                list_portal_id='modal_root'
                                                required
                                                data-testid='citizenship'
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                placeholder={localize('Citizenship')}
                                                name={field.name}
                                                disabled={
                                                    (values?.citizen && is_fully_authenticated) ||
                                                    isFieldImmutable('citizen', editable_fields) ||
                                                    (values?.citizen && has_real_account)
                                                }
                                                label={is_mf ? localize('Citizenship*') : localize('Citizenship')}
                                                list_items={residence_list}
                                                value={values.citizen}
                                                use_text={true}
                                                error={touched.citizen && errors.citizen}
                                                onChange={e => {
                                                    handleChange(e);
                                                    setFieldValue('citizen', e.target.value, true);
                                                }}
                                                {...field}
                                                required
                                                should_hide_disabled_options={false}
                                                data_testid='citizenship_mobile'
                                            />
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        )}
                        {!is_svg_only && 'phone' in values && (
                            <PhoneField
                                value={values.phone}
                                editable_fields={editable_fields}
                                has_real_account={has_real_account}
                                required
                            />
                        )}
                        {!is_svg_only && ('tax_residence' in values || 'tax_identification_number' in values) && (
                            <React.Fragment>
                                <FormSubHeader title={localize('Tax information')} />
                                {'tax_residence' in values && (
                                    <TaxResidenceField
                                        setFieldValue={setFieldValue}
                                        disabled={
                                            isFieldImmutable('tax_residence', editable_fields) ||
                                            (values?.tax_residence && has_real_account)
                                        }
                                        residence_list={residence_list}
                                        required
                                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                                        is_tax_residence_popover_open={is_tax_residence_popover_open}
                                    />
                                )}
                                {'tax_identification_number' in values && (
                                    <TaxIdentificationNumberField
                                        is_tin_popover_open={is_tin_popover_open}
                                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                        disabled={
                                            isFieldImmutable('tax_identification_number', editable_fields) ||
                                            (values?.tax_identification_number && has_real_account)
                                        }
                                        required
                                    />
                                )}
                                {'employment_status' in values && (
                                    <fieldset className={classNames('account-form__fieldset', 'emp-status')}>
                                        <DesktopWrapper>
                                            <Dropdown
                                                placeholder={
                                                    is_mf
                                                        ? localize('Employment status*')
                                                        : localize('Employment status')
                                                }
                                                is_align_text_left
                                                name='employment_status'
                                                list={getEmploymentStatusList()}
                                                value={values.employment_status}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                error={touched.employment_status && errors.employment_status}
                                                disabled={isFieldImmutable('employment_status', editable_fields)}
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                placeholder={localize('Please select')}
                                                name='employment_status'
                                                label={
                                                    is_mf
                                                        ? localize('Employment status*')
                                                        : localize('Employment status')
                                                }
                                                list_items={getEmploymentStatusList()}
                                                value={values.employment_status}
                                                error={touched.employment_status && errors.employment_status}
                                                onChange={e => {
                                                    setFieldTouched('employment_status', true);
                                                    handleChange(e);
                                                }}
                                                disabled={isFieldImmutable('employment_status', editable_fields)}
                                            />
                                        </MobileWrapper>
                                    </fieldset>
                                )}
                                {'tax_identification_confirm' in values && (
                                    <Checkbox
                                        name='tax_identification_confirm'
                                        className='details-form__tin-confirm'
                                        data-lpignore
                                        onChange={() =>
                                            setFieldValue(
                                                'tax_identification_confirm',
                                                !values.tax_identification_confirm,
                                                true
                                            )
                                        }
                                        value={values.tax_identification_confirm}
                                        label={localize(
                                            'I hereby confirm that the tax information I provided is true and complete. I will also inform {{legal_entity_name}} about any changes to this information.',
                                            {
                                                legal_entity_name: getLegalEntityName('maltainvest'),
                                            }
                                        )}
                                        renderlabel={title => (
                                            <Text size='xs' line_height='s'>
                                                {title}
                                            </Text>
                                        )}
                                        withTabIndex={0}
                                        data-testid='tax_identification_confirm'
                                    />
                                )}
                            </React.Fragment>
                        )}
                        {!is_svg_only && 'account_opening_reason' in values && (
                            <AccountOpeningReasonField
                                required
                                account_opening_reason_list={account_opening_reason_list}
                                setFieldValue={setFieldValue}
                                disabled={
                                    isFieldImmutable('account_opening_reason', editable_fields) ||
                                    (values?.account_opening_reason && has_real_account)
                                }
                            />
                        )}
                    </fieldset>
                </FormBodySection>
            </div>

            {is_svg_only && (
                <div className='account-form__poi-additional-information'>
                    <FormSubHeader title={localize('Additional information')} />
                    {'phone' in values && (
                        <PhoneField
                            value={values.phone}
                            editable_fields={editable_fields}
                            has_real_account={has_real_account}
                            required
                        />
                    )}
                    <React.Fragment>
                        {'place_of_birth' in values && (
                            <PlaceOfBirthField
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                                disabled={isFieldImmutable('place_of_birth', editable_fields)}
                                residence_list={residence_list}
                                required
                            />
                        )}
                        {'tax_residence' in values && (
                            <TaxResidenceField
                                setFieldValue={setFieldValue}
                                disabled={
                                    isFieldImmutable('tax_residence', editable_fields) ||
                                    (values?.tax_residence && has_real_account)
                                }
                                residence_list={residence_list}
                                required
                                setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                setIsTinPopoverOpen={setIsTinPopoverOpen}
                                is_tax_residence_popover_open={is_tax_residence_popover_open}
                            />
                        )}
                        {'tax_identification_number' in values && (
                            <TaxIdentificationNumberField
                                is_tin_popover_open={is_tin_popover_open}
                                setIsTinPopoverOpen={setIsTinPopoverOpen}
                                setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                disabled={
                                    isFieldImmutable('tax_identification_number', editable_fields) ||
                                    (values?.tax_identification_number && has_real_account)
                                }
                                required
                            />
                        )}
                        {'account_opening_reason' in values && (
                            <AccountOpeningReasonField
                                no_header
                                account_opening_reason_list={account_opening_reason_list}
                                setFieldValue={setFieldValue}
                                disabled={
                                    isFieldImmutable('account_opening_reason', editable_fields) ||
                                    (values?.account_opening_reason && has_real_account)
                                }
                                required
                            />
                        )}
                    </React.Fragment>
                </div>
            )}
        </React.Fragment>
    );
};

export default PersonalDetailsForm;

const PhoneField = ({ value, editable_fields, has_real_account, required }) => (
    <FormInputField
        name='phone'
        label={required ? localize('Phone number*') : localize('Phone number')}
        placeholder={required ? localize('Phone number*') : localize('Phone number')}
        disabled={
            isFieldImmutable('phone', editable_fields) ||
            (value && has_real_account && validPhone(value) && value?.length >= 9 && value?.length <= 35)
        }
        maxLength={50}
        data-testid='phone'
    />
);

const PlaceOfBirthField = ({ handleChange, setFieldValue, disabled, residence_list, required }) => (
    <Field name='place_of_birth'>
        {({ field, meta }) => (
            <React.Fragment>
                <DesktopWrapper>
                    <Autocomplete
                        {...field}
                        disabled={disabled}
                        data-lpignore='true'
                        autoComplete='none' // prevent chrome autocomplete
                        type='text'
                        label={required ? localize('Place of birth*') : localize('Place of birth')}
                        error={meta.touched && meta.error}
                        list_items={residence_list}
                        onItemSelection={({ value, text }) => setFieldValue('place_of_birth', value ? text : '', true)}
                        required
                        data-testid='place_of_birth'
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={required ? localize('Place of birth') : localize('Place of birth')}
                        name={field.name}
                        disabled={disabled}
                        label={required ? localize('Place of birth*') : localize('Place of birth')}
                        list_items={residence_list}
                        value={field.value}
                        use_text={true}
                        error={meta.touched && meta.error}
                        onChange={e => {
                            handleChange(e);
                            setFieldValue('place_of_birth', e.target.value, true);
                        }}
                        {...field}
                        list_portal_id='modal_root'
                        required
                        should_hide_disabled_options={false}
                        data_testid='place_of_birth_mobile'
                    />
                </MobileWrapper>
            </React.Fragment>
        )}
    </Field>
);

const TaxResidenceField = ({
    setFieldValue,
    residence_list,
    required,
    setIsTaxResidencePopoverOpen,
    setIsTinPopoverOpen,
    is_tax_residence_popover_open,
    disabled,
}) => (
    <Field name='tax_residence'>
        {({ field, meta }) => (
            <div className='details-form__tax'>
                <DesktopWrapper>
                    <Autocomplete
                        {...field}
                        data-lpignore='true'
                        autoComplete='none' // prevent chrome autocomplete
                        type='text'
                        label={required ? localize('Tax residence*') : localize('Tax residence')}
                        error={meta.touched && meta.error}
                        list_items={residence_list}
                        onItemSelection={({ value, text }) => setFieldValue('tax_residence', value ? text : '', true)}
                        list_portal_id='modal_root'
                        data-testid='tax_residence'
                        disabled={disabled}
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={required ? localize('Tax residence*') : localize('Tax residence')}
                        name={field.name}
                        label={required ? localize('Tax residence*') : localize('Tax residence')}
                        list_items={residence_list}
                        value={field.value}
                        use_text={true}
                        error={meta.touched && meta.error}
                        onChange={e => {
                            field.onChange(e);
                            setFieldValue('tax_residence', e.target.value, true);
                        }}
                        {...field}
                        required
                        data_testid='tax_residence_mobile'
                        disabled={disabled}
                    />
                </MobileWrapper>
                <div
                    data-testid='tax_residence_pop_over'
                    onClick={e => {
                        setIsTaxResidencePopoverOpen(true);
                        setIsTinPopoverOpen(false);
                        e.stopPropagation();
                    }}
                >
                    <Popover
                        alignment={isDesktop() ? 'right' : 'left'}
                        icon='info'
                        message={localize(
                            'The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.'
                        )}
                        zIndex={9998}
                        disable_message_icon
                        is_open={is_tax_residence_popover_open}
                    />
                </div>
            </div>
        )}
    </Field>
);

const TaxIdentificationNumberField = ({
    is_tin_popover_open,
    setIsTinPopoverOpen,
    setIsTaxResidencePopoverOpen,
    disabled,
    required,
}) => (
    <div className='details-form__tax'>
        <FormInputField
            name='tax_identification_number'
            label={required ? localize('Tax Identification Number*') : localize('Tax Identification Number')}
            placeholder={localize('Tax Identification Number')}
            data-testid='tax_identification_number'
            disabled={disabled}
        />
        <div
            data-testid='tax_identification_number_pop_over'
            onClick={e => {
                setIsTaxResidencePopoverOpen(false);
                setIsTinPopoverOpen(true);
                if (e.target.tagName !== 'A') e.stopPropagation();
            }}
        >
            <Popover
                alignment={isDesktop() ? 'right' : 'left'}
                icon='info'
                is_open={is_tin_popover_open}
                message={
                    <Localize
                        i18n_default_text={
                            "Don't know your tax identification number? Click <0>here</0> to learn more."
                        }
                        components={[
                            <a
                                key={0}
                                className='link link--red'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/'
                            />,
                        ]}
                    />
                }
                zIndex={9998}
                disable_message_icon
            />
        </div>
    </div>
);

const AccountOpeningReasonField = ({ no_header, required, account_opening_reason_list, setFieldValue, disabled }) => (
    <React.Fragment>
        {!no_header && <FormSubHeader title={localize('Account opening reason')} />}
        <Field name='account_opening_reason'>
            {({ field, meta }) => (
                <React.Fragment>
                    <DesktopWrapper>
                        <Dropdown
                            placeholder={
                                required ? localize('Account opening reason*') : localize('Account opening reason')
                            }
                            name={field.name}
                            disabled={disabled}
                            is_align_text_left
                            list={account_opening_reason_list}
                            {...field}
                            error={meta.touched && meta.error}
                            list_portal_id='modal_root'
                            required
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <SelectNative
                            placeholder={localize('Please select')}
                            name={field.name}
                            label={required ? localize('Account opening reason*') : localize('Account opening reason')}
                            list_items={account_opening_reason_list}
                            error={meta.touched && meta.error}
                            onChange={e => {
                                field.onChange(e);
                                setFieldValue('account_opening_reason', e.target.value, true);
                            }}
                            {...field}
                            required
                            data_testid='account_opening_reason_mobile'
                            disabled={disabled}
                        />
                    </MobileWrapper>
                </React.Fragment>
            )}
        </Field>
    </React.Fragment>
);
