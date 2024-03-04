import React from 'react';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import useGrowthbookFeatureFlag from './useGrowthbookFeatureFlag';

const useIsPasskeySupported = () => {
    const [is_passkey_supported, setIsPasskeySupported] = React.useState(false);
    const [is_passkey_support_checking, setIsPasskeySupportChecking] = React.useState(true);
    const is_passkeys_enabled = useGrowthbookFeatureFlag({
        featureFlag: 'web_passkeys',
        defaultValue: 'unintialised',
    });

    React.useEffect(() => {
        const checkPasskeySupport = async () => {
            try {
                const result = await platformAuthenticatorIsAvailable();
                setIsPasskeySupported(result && !!is_passkeys_enabled);
            } catch (error) {
                /* eslint-disable no-console */
                console.error('Error checking passkey support:', error);
            } finally {
                setIsPasskeySupportChecking(false);
            }
        };
        if (is_passkeys_enabled !== 'unintialised') checkPasskeySupport();
    }, [is_passkeys_enabled]);

    return { is_passkey_supported, is_passkey_support_checking };
};

export default useIsPasskeySupported;
