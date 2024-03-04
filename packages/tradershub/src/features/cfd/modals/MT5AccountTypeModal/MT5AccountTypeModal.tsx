import React, { ComponentProps, useState } from 'react';
import { Modal } from '@/components';
import { useCFDContext, useModal } from '@/providers';
import { JurisdictionModal } from '@cfd/modals';
import { MT5AccountType } from '@cfd/screens';
import { Button } from '@deriv-com/ui';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = useCFDContext();
    const { show } = useModal();

    return (
        <Modal>
            <Modal.Header title='Select Deriv MT5’s account type' />
            <Modal.Content>
                <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
            </Modal.Content>
            <Modal.Footer>
                <Button
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setCfdState({ marketType: selectedMarketType });
                        show(<JurisdictionModal />);
                    }}
                    size='md'
                >
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MT5AccountTypeModal;
