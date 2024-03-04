import React from 'react';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Icon, StaticUrl, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { DEEP_LINK, WEBTRADER_URL, getMobileAppInstallerURL } from '../Helpers/constants';
import './mt5-mobile-redirect-option.scss';
import { isSafariBrowser, mt5_help_centre_url } from '@deriv/shared';

type TMT5MobileRedirectOptionProps = {
    mt5_trade_account: DetailsOfEachMT5Loginid;
};
const MT5MobileRedirectOption = ({ mt5_trade_account }: TMT5MobileRedirectOptionProps) => {
    let mobile_url;

    const mobileURLSet = () => {
        mobile_url = window.location.replace(DEEP_LINK({ mt5_trade_account }));

        const timeout = setTimeout(() => {
            mobile_url = window.location.replace(getMobileAppInstallerURL({ mt5_trade_account }) as string);
        }, 1500);

        if (!isSafariBrowser()) {
            window.onblur = () => {
                clearTimeout(timeout);
            };
        }
    };

    return (
        <div className='mt5-download-container'>
            <a
                className='mt5-download-container--option'
                href={WEBTRADER_URL({ mt5_trade_account })}
                target='_blank'
                rel='noopener noreferrer'
            >
                <div className='full-row'>
                    <Icon icon='IcDesktopOutline' size={16} />
                    <Text align='left' size='xxs' weight='bold' className='title'>
                        <Localize i18n_default_text={'MetaTrader5 web terminal'} />
                    </Text>
                    <Icon icon='IcChevronRight' size={16} />
                </div>
            </a>
            <a className='mt5-download-container--option blue' onClick={mobileURLSet} href={mobile_url}>
                <div className='full-row'>
                    <Icon icon='IcMobileOutline' size={16} />
                    <Text align='left' size='xxs' weight='bold' className='title'>
                        <Localize i18n_default_text={'Trade with MT5 mobile app'} />
                    </Text>
                    <Icon icon='IcChevronRightLight' size={16} />
                </div>
            </a>

            <Text as='p' size='xxxs'>
                <Localize
                    i18n_default_text="Note: Don't have the MT5 app? Tap the <0>Trade with MT5 mobile app</0> button to download. Once you have
                installed the app, return to this screen and hit the same button to log in."
                    components={[<strong key={0} />]}
                />
            </Text>

            <Text as='p' align='center' size='xxs'>
                <Localize
                    i18n_default_text='For MT5 login issues, visit our <0>Help Centre</0>.'
                    components={[<StaticUrl key={0} className='help-center-link' href={mt5_help_centre_url} />]}
                />
            </Text>
        </div>
    );
};

export default MT5MobileRedirectOption;
