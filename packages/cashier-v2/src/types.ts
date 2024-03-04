import { FormatUtils } from '@deriv-com/utils';
import { cashierPathRoutes } from './routes/Router';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TRouteTypes {
    export type TRoutes = typeof cashierPathRoutes[keyof typeof cashierPathRoutes] | '/reports/statement';
    export interface IRouteConfig {
        component: React.ComponentType<Omit<IRouteConfig, 'component'>>;
        icon?: React.ReactNode;
        path: string;
        routes?: IRouteConfig[];
        title: string;
    }
    export type TRouteComponent = React.ComponentProps<IRouteConfig['component']>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TErrorTypes {
    export type TServerError = {
        code: string;
        details?: { [key: string]: string };
        fields?: string[];
        message: string;
    };
}

declare module 'react-router-dom' {
    export function useHistory(): {
        location: {
            hash: string;
            pathname: TRouteTypes.TRoutes;
            search: string;
            state: Record<string, unknown>;
        };
        push: (path: TRouteTypes.TRoutes) => void;
    };

    export function useRouteMatch(path: TRouteTypes.TRoutes): boolean;
}

export type TCurrency = NonNullable<NonNullable<Parameters<typeof FormatUtils['formatMoney']>['1']>['currency']>;
