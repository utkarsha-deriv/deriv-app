import { POICountrySelector } from '../containers/POICountrySelector';
import { POAFormContainer } from '../modules/POAForm/POAFormContainer';
import { DummyRoute } from '../router/components/DummyRoute';
import { ACCOUNT_V2_ROUTES } from './routes';

export const routes = [
    {
        routeComponent: DummyRoute,
        routeName: 'Personal details',
        routePath: ACCOUNT_V2_ROUTES.PersonalDetails,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Languages',
        routePath: ACCOUNT_V2_ROUTES.Languages,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Trading assessment',
        routePath: ACCOUNT_V2_ROUTES.TradingAssessment,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Financial assessment',
        routePath: ACCOUNT_V2_ROUTES.FinancialAssessment,
    },
    {
        routeComponent: POICountrySelector,
        routeName: 'Proof of identity',
        routePath: ACCOUNT_V2_ROUTES.ProofOfIdentity,
    },
    {
        routeComponent: POAFormContainer,
        routeName: 'Proof of address',
        routePath: ACCOUNT_V2_ROUTES.ProofOfAddress,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of ownership',
        routePath: ACCOUNT_V2_ROUTES.ProofOfOwnership,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of income',
        routePath: ACCOUNT_V2_ROUTES.ProofOfIncome,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Email and passwords',
        routePath: ACCOUNT_V2_ROUTES.EmailAndPassword,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Self exclusion',
        routePath: ACCOUNT_V2_ROUTES.SelfExclusion,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Account limits',
        routePath: ACCOUNT_V2_ROUTES.AccountLimits,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Login history',
        routePath: ACCOUNT_V2_ROUTES.LoginHistory,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'API token',
        routePath: ACCOUNT_V2_ROUTES.ApiToken,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Connected apps',
        routePath: ACCOUNT_V2_ROUTES.ConnectedApps,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Two-factor authentication',
        routePath: ACCOUNT_V2_ROUTES.TwoFactorAuthentication,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Close your account',
        routePath: ACCOUNT_V2_ROUTES.CloseAccount,
    },
];

export const defaultRoute = routes[0].routePath;
