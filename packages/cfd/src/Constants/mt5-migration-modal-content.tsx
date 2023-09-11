import React from 'react';
import { Localize } from '@deriv/translations';

const getMigrationModalDetails = (to_account: string) => {
    return [
        {
            key: 'have_open_positions',
            title: <Localize i18n_default_text='If you have open positions' />,
            description: [
                <Localize key={0} i18n_default_text='Your funds will remain in your existing MT5 account(s).' />,
                <Localize
                    key={1}
                    i18n_default_text='You can continue trading on your existing MT5 account(s) until you close all open positions.'
                />,
                <Localize
                    key={2}
                    i18n_default_text='New MT5 account(s) under the {{to_account}} jurisdiction will be created for future trades.'
                    values={{ to_account }}
                />,
            ],
        },
        {
            key: 'no_open_positions',
            title: <Localize i18n_default_text='If you don’t have open positions' />,
            description: [
                <Localize key={0} i18n_default_text='Your funds will remain in your existing MT5 account(s).' />,
                <Localize
                    key={2}
                    i18n_default_text='New MT5 account(s) under the {{to_account}} jurisdiction will be created for future trades.'
                    values={{ to_account }}
                />,
            ],
        },
    ];
};

export default getMigrationModalDetails;
