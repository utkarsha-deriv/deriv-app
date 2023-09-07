import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiTokenClipboard from '../api-token-clipboard';

const modal_root_el = document.createElement('div');
modal_root_el.setAttribute('id', 'modal_root');
document.body.appendChild(modal_root_el);

describe('ApiTokenClipboard', () => {
    const mock_props = {
        scopes: ['read', 'trade', 'Admin'],
        text_copy: 'Text Copy',
        info_message: 'Info Message',
        success_message: 'Success Message',
    };

    it('should render ApiTokenClipboard with the copy icon', () => {
        render(<ApiTokenClipboard {...mock_props} />);
        expect(screen.getByTestId('dt_copy_token_icon')).toBeInTheDocument();
    });

    it('should display "Copy this token" message when mouse enters', () => {
        render(<ApiTokenClipboard {...mock_props} />);
        const copy_icon = screen.getByTestId('dt_copy_token_icon');
        userEvent.hover(copy_icon);
        expect(screen.getByText('Info Message')).toBeInTheDocument();
    });

    it('should remove "Copy this token" message when mouse leaves', () => {
        render(<ApiTokenClipboard {...mock_props} />);
        const copy_icon = screen.getByTestId('dt_copy_token_icon');
        userEvent.hover(copy_icon);
        expect(screen.getByText('Info Message')).toBeInTheDocument();
        userEvent.unhover(copy_icon);
        expect(screen.queryByText('Info Message')).not.toBeInTheDocument();
    });

    it('should display Popup Modal when user clicks on copy_icon', () => {
        render(<ApiTokenClipboard {...mock_props} />);
        const copy_icon = screen.getByTestId('dt_copy_token_icon');
        userEvent.click(copy_icon);
        expect(
            screen.getByText(
                'Be careful who you share this token with. Anyone with this token can perform the following actions on your account behalf'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Add accounts')).toBeInTheDocument();
        expect(screen.getByText('Create or delete API tokens for trading and withdrawals')).toBeInTheDocument();
        expect(screen.getByText('Modify account settings')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should display Info Message when user clicks on OK', async () => {
        render(<ApiTokenClipboard {...mock_props} />);
        const copy_icon = screen.getByTestId('dt_copy_token_icon');
        userEvent.click(copy_icon);
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
        const ok_button = screen.getByRole('button', { name: 'OK' });
        userEvent.click(ok_button);
        await waitFor(() => {
            expect(screen.queryByText('Add accounts')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Info Message')).toBeInTheDocument();
    });

    it('should not display Popup Modal when user clicks on copy_icon with no Admin scope', () => {
        mock_props.scopes = ['read', 'trade'];
        render(<ApiTokenClipboard {...mock_props} />);
        const copy_icon = screen.getByTestId('dt_copy_token_icon');
        userEvent.click(copy_icon);
        expect(
            screen.queryByText(
                'Be careful who you share this token with. Anyone with this token can perform the following actions on your account behalf'
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Add accounts')).not.toBeInTheDocument();
        expect(screen.queryByText('Create or delete API tokens for trading and withdrawals')).not.toBeInTheDocument();
        expect(screen.queryByText('Modify account settings')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
});
