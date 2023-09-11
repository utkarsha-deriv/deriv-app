import { useTraderStore } from 'Stores/useTraderStores';

export type TProposalTypeInfo = {
    has_error?: boolean;
    id: string;
    has_increased?: boolean;
    message?: string;
    cancellation?: {
        ask_price: number;
        date_expiry: number;
    };
    growth_rate?: number;
    returns?: string;
    stake: string;
};

export type TError = {
    error?: {
        code?: string;
        details?: {
            field?: string;
        };
        message?: string;
    };
};

export type TTradeStore = ReturnType<typeof useTraderStore>;
