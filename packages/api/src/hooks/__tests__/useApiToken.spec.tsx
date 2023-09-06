import { renderHook } from '@testing-library/react-hooks';
import useApiToken from '../useApiToken';
import APIProvider from '../../APIProvider';
import React from 'react';

const mock_token = 'ABCDefgh1234567890';

jest.mock('@deriv/shared', () => ({
    WS: {
        send: jest.fn().mockResolvedValueOnce({
            msg_type: 'api_token',
            echo_req: {},
            api_token: {
                tokens: [
                    {
                        display_name: 'Created by script',
                        last_used: '',
                        scopes: ['read', 'trade', 'payments', 'admin'],
                        token: mock_token,
                        valid_for_ip: '',
                    },
                    {
                        display_name: 'test12',
                        last_used: '',
                        scopes: ['read', 'payments'],
                        token: mock_token,
                        valid_for_ip: '',
                    },
                ],
            },
        }),
    },
}));

describe('useApiToken', () => {
    it('should return the token data when a get call is made', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useApiToken(), { wrapper });

        result.current.send();

        await waitForNextUpdate();

        expect(result.current.api_token_data?.api_token?.tokens).toHaveLength(2);
    });
});
