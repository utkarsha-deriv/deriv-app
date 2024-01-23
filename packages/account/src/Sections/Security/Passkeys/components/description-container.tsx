import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const getPasskeysDescriptions = () =>
    [
        {
            id: 1,
            question: <Localize i18n_default_text='What are Passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are a security measure that lets you log in the same way you unlock your device: with a fingerprint, a face scan, or a screen lock PIN.' />
            ),
        },
        {
            id: 2,
            question: <Localize i18n_default_text='Why passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are an added layer of security that protects your account against unauthorised access and phishing attacks.' />
            ),
        },
        {
            id: 3,
            question: <Localize i18n_default_text='How to create a passkey?' />,
            description: (
                <Localize i18n_default_text="Go to 'Account Settings' on Deriv GO to set up your passkey. Each device can only save one passkey; however, iOS users may still see the 'Create passkey' button due to iOS’s ability to save passkeys on other devices." />
            ),
        },
        {
            id: 4,
            question: <Localize i18n_default_text='Where are Passkeys saved?' />,
            description: (
                <Localize i18n_default_text='Passkeys are saved in your password manager to help you sign in on other devices.' />
            ),
        },
        {
            id: 5,
            question: <Localize i18n_default_text='What if I change my Deriv account email?' />,
            description: (
                <Localize i18n_default_text='Even if you change your email address, you can still continue to log in to Deriv.com with the same passkey.' />
            ),
        },
    ] as const;

export const DescriptionContainer = () => {
    const passkeys_descriptions = getPasskeysDescriptions();
    return (
        <React.Fragment>
            <div className='passkeys-status__description-container'>
                {passkeys_descriptions.map(({ id, question, description }) => (
                    <div key={`description-${id}`} className='passkeys-status__description-card'>
                        <Text weight='bold' size='xs'>
                            {question}
                        </Text>
                        <Text size='xs'>{description}</Text>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};