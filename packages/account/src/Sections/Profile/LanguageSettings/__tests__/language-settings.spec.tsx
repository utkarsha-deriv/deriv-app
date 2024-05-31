import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStoreWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import LanguageSettings from '../language-settings';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

const mockedUseStoreWalletAccountsList = useStoreWalletAccountsList as jest.MockedFunction<
    typeof useStoreWalletAccountsList
>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/translations', () => ({
    ...jest.requireActual('@deriv/translations'),
    getAllowedLanguages: jest.fn(() => ({ lang_1: 'Test Lang 1', lang_2: 'Test Lang 2' })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>Flag Icon</div>),
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn(() => ({ i18n: { changeLanguage: jest.fn() } })),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: jest.fn(() => <div>Redirect</div>),
}));

describe('LanguageSettings', () => {
    let mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mockRootStore = mockStore({
            common: {
                current_language: 'lang_1',
            },
        });
    });

    const renderLanguageSettings = () => {
        render(<LanguageSettings />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
    };

    it('should render LanguageSettings', () => {
        renderLanguageSettings();

        expect(screen.getByText('Select language')).toBeInTheDocument();

        const flags_icons = screen.getAllByText('Flag Icon');
        const lang_1 = screen.getByText('Test Lang 1');
        const lang_2 = screen.getByText('Test Lang 2');

        expect(flags_icons).toHaveLength(2);
        expect(lang_1).toBeInTheDocument();
        expect(/(active)/i.test(lang_1.className)).toBeTruthy();
        expect(lang_2).toBeInTheDocument();
        expect(/(active)/i.test(lang_2.className)).toBeFalsy();
    });

    it('should trigger language change', () => {
        renderLanguageSettings();

        const lang_2 = screen.getByText('Test Lang 2');
        userEvent.click(lang_2);

        expect(mockRootStore.common.changeSelectedLanguage).toHaveBeenCalled();
    });

    it('should redirect in responsive view when the user tries to reach `/account/languages` route', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        renderLanguageSettings();

        expect(screen.queryByText('Select language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });

    it('should redirect when the user tries to reach `/account/languages` route having wallet accounts', () => {
        mockRootStore.client.has_wallet = true;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        renderLanguageSettings();

        expect(screen.queryByText('Select Language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });
});
