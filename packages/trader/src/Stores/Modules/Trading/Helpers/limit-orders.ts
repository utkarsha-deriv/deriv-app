import { isMultiplierContract, BARRIER_COLORS, BARRIER_LINE_STYLES } from '@deriv/shared';
import { ChartBarrierStore } from '../../SmartChart/chart-barrier-store';
import { removeBarrier } from '../../SmartChart/Helpers/barriers';
import { useStore } from '@deriv/stores';

const isLimitOrderBarrierSupported = (
    contract_type: string,
    contract_info: ReturnType<typeof useStore>['portfolio']['all_positions'][0]['contract_info']
) => isMultiplierContract(contract_type) && contract_info.limit_order;

export const LIMIT_ORDER_TYPES = {
    STOP_OUT: 'stop_out',
    TAKE_PROFIT: 'take_profit',
    STOP_LOSS: 'stop_loss',
} as const;

type TBarrier = ChartBarrierStore & { key?: string };

type TSetLimitOrderBarriers = {
    barriers: TBarrier[];
    contract_type: string;
    contract_info: Parameters<typeof isLimitOrderBarrierSupported>[1];
    is_over: boolean;
};
export const setLimitOrderBarriers = ({
    barriers,
    contract_type,
    contract_info = {},
    is_over,
}: TSetLimitOrderBarriers) => {
    if (is_over && isLimitOrderBarrierSupported(contract_type, contract_info)) {
        const limit_orders = Object.values(LIMIT_ORDER_TYPES);
        const has_stop_loss =
            contract_info.limit_order !== undefined &&
            Object.keys(contract_info.limit_order).some(
                k => k === LIMIT_ORDER_TYPES.STOP_LOSS && contract_info?.limit_order?.[k]?.value
            );

        limit_orders.forEach(key => {
            const obj_limit_order = contract_info.limit_order?.[key];

            if (!obj_limit_order || !obj_limit_order.value) {
                removeBarrier(barriers, key);
                return;
            }

            let barrier = barriers.find(b => b.key === key);

            if (barrier) {
                if (barrier.high === +obj_limit_order.value) {
                    return;
                }

                barrier.onChange({
                    high: obj_limit_order.value,
                    low: undefined, //TODO: wait until ChartBarrierStore is ts migrated and 'low' can be an optional parameter
                });
            } else {
                const obj_barrier = {
                    key,
                    title: `${obj_limit_order.display_name}`,
                    color: key === LIMIT_ORDER_TYPES.TAKE_PROFIT ? BARRIER_COLORS.GREEN : BARRIER_COLORS.ORANGE,
                    draggable: false,
                    lineStyle:
                        key === LIMIT_ORDER_TYPES.STOP_OUT ? BARRIER_LINE_STYLES.DOTTED : BARRIER_LINE_STYLES.SOLID,
                    hidePriceLines: has_stop_loss && key === LIMIT_ORDER_TYPES.STOP_OUT,
                    hideOffscreenLine: true,
                    showOffscreenArrows: true,
                    isSingleBarrier: true,
                    opacityOnOverlap: key === LIMIT_ORDER_TYPES.STOP_OUT && 0.15,
                };
                barrier = new ChartBarrierStore(obj_limit_order.value);

                Object.assign(barrier, obj_barrier);
                barriers.push(barrier);
            }
        });
    } else {
        const limit_orders = Object.values(LIMIT_ORDER_TYPES);
        limit_orders.forEach(l => removeBarrier(barriers, l));
    }
};

/**
 * Get limit_order for contract_update API
 * @param {object} contract_update - contract_update input & checkbox values
 */
export const getLimitOrder = (
    contract_update: Pick<
        ReturnType<typeof useStore>['contract_trade'],
        | 'has_contract_update_stop_loss'
        | 'has_contract_update_take_profit'
        | 'contract_update_stop_loss'
        | 'contract_update_take_profit'
        | 'contract_info'
    >
) => {
    const {
        has_contract_update_stop_loss,
        has_contract_update_take_profit,
        contract_update_stop_loss,
        contract_update_take_profit,
        contract_info,
    } = contract_update;

    const limit_order: { take_profit?: number | null; stop_loss?: number | null } = {};

    const new_take_profit = has_contract_update_take_profit ? +contract_update_take_profit : null;
    const has_take_profit_changed =
        Math.abs(contract_info.limit_order?.take_profit?.order_amount ?? 0) !== Math.abs(new_take_profit ?? 0);

    if (has_take_profit_changed) {
        // send positive take_profit to update or null cancel
        limit_order.take_profit = new_take_profit;
    }

    const new_stop_loss = has_contract_update_stop_loss ? +contract_update_stop_loss : null;
    const has_stop_loss_changed =
        Math.abs(contract_info?.limit_order?.stop_loss?.order_amount ?? 0) !== Math.abs(new_stop_loss ?? 0);

    if (has_stop_loss_changed) {
        // send positive stop_loss to update or null to cancel
        limit_order.stop_loss = new_stop_loss;
    }

    return limit_order;
};
