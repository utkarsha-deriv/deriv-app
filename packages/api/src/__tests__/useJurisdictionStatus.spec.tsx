import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useAuthentication from '../hooks/useAuthentication';
import usePOI from '../hooks/usePOI';
import useJurisdictionStatus from '../hooks/useJurisdictionStatus';
import APIProvider from '../APIProvider';

jest.mock('@deriv/shared');
jest.mock('../hooks/useAuthentication');
jest.mock('../hooks/usePOI');

const mockUseAuthentication = useAuthentication as jest.MockedFunction<typeof useAuthentication>;
const mockUsePOI = usePOI as jest.MockedFunction<typeof usePOI>;

describe('useJurisdictionStatus', () => {
    test('for BVI/Labuan, should have a failed verification status if MT5 account status has failed and IDV status is rejected', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        mockUsePOI.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                services: {
                    idv: {
                        status: 'rejected',
                    },
                },
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus('bvi', 'proof_failed'), { wrapper });

        expect(result.current.data.is_failed).toBe(true);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(false);

        const { result: labuanResult } = renderHook(() => useJurisdictionStatus('labuan', 'proof_failed'), { wrapper });

        expect(labuanResult.current.data.is_failed).toBe(true);
        expect(labuanResult.current.data.is_not_applicable).toBe(false);
        expect(labuanResult.current.data.is_pending).toBe(false);
    });
    test('for BVI/Labuan, should have a pending verification status if MT5 account status is currently pending verification and IDV status is pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        mockUsePOI.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties onl
            data: {
                services: {
                    idv: {
                        status: 'pending',
                    },
                },
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus('bvi', 'verification_pending'), { wrapper });

        expect(result.current.data.is_failed).toBe(false);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(true);

        const { result: labuanResult } = renderHook(() => useJurisdictionStatus('labuan', 'verification_pending'), {
            wrapper,
        });

        expect(labuanResult.current.data.is_failed).toBe(false);
        expect(labuanResult.current.data.is_not_applicable).toBe(false);
        expect(labuanResult.current.data.is_pending).toBe(true);
    });
    test('for BVI/Labuan, should have a pending verification status if IDV attempts failed and the next compatible service Onfido is pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        mockUsePOI.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                services: {
                    idv: {
                        status: 'rejected',
                    },
                    onfido: {
                        status: 'pending',
                    },
                },
                current: {
                    service: 'onfido',
                },
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus('bvi', 'verification_pending'), { wrapper });

        expect(result.current.data.is_failed).toBe(false);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(true);

        const { result: labuanResult } = renderHook(() => useJurisdictionStatus('labuan', 'verification_pending'), {
            wrapper,
        });

        expect(labuanResult.current.data.is_failed).toBe(false);
        expect(labuanResult.current.data.is_not_applicable).toBe(false);
        expect(labuanResult.current.data.is_pending).toBe(true);
    });
    test('for BVI/Labuan, should have a failed verification status if IDV is revoked', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        mockUsePOI.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                services: {
                    idv: {
                        status: 'none',
                    },
                },
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: true,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus('bvi', 'verification_pending'), { wrapper });

        expect(result.current.data.is_failed).toBe(true);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(false);

        const { result: labuanResult } = renderHook(() => useJurisdictionStatus('labuan', 'verification_pending'), {
            wrapper,
        });

        expect(labuanResult.current.data.is_failed).toBe(true);
        expect(labuanResult.current.data.is_not_applicable).toBe(false);
        expect(labuanResult.current.data.is_pending).toBe(false);
    });
    test('for Labuan, should have a failed verification status if is_authenticated_with_idv_photoid is present in account status', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        mockUsePOI.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                services: {
                    idv: {
                        status: 'verified',
                    },
                },
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_authenticated_with_idv_photoid: true,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus('labuan', 'verification_pending'), { wrapper });

        expect(result.current.data.is_failed).toBe(true);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(false);
    });
    test('for SVG, status should not be applicable', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        mockUsePOI.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                services: {
                    idv: {
                        status: 'none',
                    },
                },
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: true,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus('svg', 'verification_pending'), { wrapper });

        expect(result.current.data.is_failed).toBe(false);
        expect(result.current.data.is_not_applicable).toBe(true);
        expect(result.current.data.is_pending).toBe(false);
    });
    test('for Vanuatu, status should be failed if MT5 account status is proof_failed', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useJurisdictionStatus('vanuatu', 'proof_failed'), { wrapper });

        expect(result.current.data.is_failed).toBe(true);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(false);
    });
    test('for Vanuatu, status should be pending if MT5 account status is verification_pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useJurisdictionStatus('vanuatu', 'verification_pending'), { wrapper });

        expect(result.current.data.is_failed).toBe(false);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(true);
    });
    test('for Vanuatu, status should not be failed/pending if MT5 account status is not equal to proof_failed or verification_pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useJurisdictionStatus('vanuatu', ''), { wrapper });

        expect(result.current.data.is_failed).toBe(false);
        expect(result.current.data.is_not_applicable).toBe(false);
        expect(result.current.data.is_pending).toBe(false);
    });
});