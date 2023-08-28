import React from 'react';
import classNames from 'classnames';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import SideNote from '../../../components/side-note';
import DepositTab from './deposit-tab';
import WithdrawalTab from './withdrawal-tab';
import MissingPaymentMethodNote from '../missing-payment-method-note';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';
import { useCashierStore } from '../../../stores/useCashierStores';
import './payment-agent-list.scss';

type TProps = {
    setSideNotes?: (notes: React.ReactNode[]) => void;
};

const PaymentAgentList = observer(({ setSideNotes }: TProps) => {
    const { payment_agent, general_store } = useCashierStore();

    const {
        common: { current_language },
    } = useStore();

    React.useEffect(() => {
        if (!general_store.is_loading && !payment_agent.is_try_withdraw_successful) {
            setSideNotes?.([
                <SideNote has_title={false} key={0}>
                    <PaymentAgentDisclaimer />
                </SideNote>,
                <SideNote has_title={false} key={1}>
                    <MissingPaymentMethodNote />
                </SideNote>,
            ]);
        } else {
            setSideNotes?.([]);
        }

        return () => {
            setSideNotes?.([]);
        };
    }, [setSideNotes, general_store.is_loading, payment_agent.is_try_withdraw_successful, current_language]);

    return (
        <div className='payment-agent-list cashier__wrapper--align-left'>
            <div
                className={classNames('payment-agent-list__instructions', {
                    'payment-agent-list__instructions-hide-tabs': payment_agent.is_try_withdraw_successful,
                })}
                key={current_language}
            >
                <Tabs
                    active_index={payment_agent.active_tab_index}
                    className='tabs--desktop'
                    onTabItemClick={payment_agent.setActiveTab}
                    top
                    header_fit_content={isDesktop()}
                    center={false}
                    bottom={false}
                    active_icon_color={''}
                    background_color={''}
                    fit_content={false}
                    icon_color={''}
                    icon_size={0}
                    is_100vw={false}
                    is_full_width={false}
                    is_overflow_hidden={false}
                    is_scrollable={false}
                    should_update_hash={false}
                    single_tab_has_no_label={false}
                >
                    <div label={localize('Deposit')}>
                        <DepositTab />
                    </div>
                    <div label={localize('Withdrawal')}>
                        <WithdrawalTab />
                    </div>
                </Tabs>
            </div>
        </div>
    );
});

export default PaymentAgentList;
