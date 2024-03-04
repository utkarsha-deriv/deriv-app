import { useQuery } from '@deriv/api';

/** A custom hook to get paymentagent details */
export const usePaymentAgentDetails = () => {
    const { data, ...rest } = useQuery('paymentagent_details');

    return {
        /** Paymentagent details response */
        data: data?.paymentagent_details,
        ...rest,
    };
};
