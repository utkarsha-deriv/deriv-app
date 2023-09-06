import React from 'react';
import useRequest from '../useRequest';

type TAPITokenPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useRequest<'api_token'>>['mutate']>>[0]>['payload']
>;

/**
 * Makes an API call to GET, UPDATE or DELETE API token.
 * @name useApiToken
 * @returns an object containing the API token data, send function and status of the request/response.
 */
const useApiToken = () => {
    const { data, mutate, ...rest } = useRequest('api_token');

    /**
     * Same API call is used for GET and POST based on payload. For GET, payload is not required.
     */
    const send = React.useCallback((payload?: TAPITokenPayload) => mutate({ payload }), [mutate]);

    return {
        api_token_data: data,
        send,
        ...rest,
    };
};

export default useApiToken;
