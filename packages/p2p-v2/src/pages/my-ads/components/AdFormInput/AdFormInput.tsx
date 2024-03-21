import React, { ComponentProps, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getValidationRules } from '@/utils';
import { Input } from '@deriv-com/ui';

type TAdFormInputProps = ComponentProps<typeof Input> & {
    currency?: string;
    label: string;
    name: string;
    rightPlaceholder: ReactNode;
};

const AdFormInput = ({ label, name, rightPlaceholder, ...props }: TAdFormInputProps) => {
    const { control, getValues } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <div className='px-[2.4rem] mb-[3.5rem] w-full'>
                    <Input
                        error={!!error?.message}
                        label={label}
                        message={error ? error?.message : ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        rightPlaceholder={rightPlaceholder}
                        value={value}
                        wrapperClassName='w-full'
                        {...props}
                    />
                </div>
            )}
            rules={{
                validate: getValidationRules(name, getValues),
            }}
        />
    );
};

export default AdFormInput;
