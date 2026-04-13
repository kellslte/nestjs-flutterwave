import { TransferService } from '../../src/services/transfer.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('TransferService', () => {
    let service: TransferService;
    const mockOptions: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        publicKey: 'test_public_key',
        version: 'v3',
    };

    beforeEach(() => {
        service = new TransferService(mockOptions);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('initiateTransfer', () => {
        it('should initiate transfer successfully', async () => {
            const mockTransferData = {
                account_bank: '044',
                account_number: '1234567890',
                amount: 1000,
                narration: 'Transfer to John',
                currency: 'NGN',
                reference: 'REF_123',
                callback_url: 'https://example.com/callback',
                debit_currency: 'NGN',
            };

            const mockResponse = {
                status: 'success',
                message: 'Transfer initiated',
                data: {
                    id: 123,
                    account_number: '1234567890',
                    bank_code: '044',
                    fullname: 'John Doe',
                    created_at: '2024-01-01T10:00:00Z',
                    currency: 'NGN',
                    debit_currency: 'NGN',
                    amount: 1000,
                    fee: 50,
                    status: 'pending',
                    reference: 'REF_123',
                    meta: {},
                    narration: 'Transfer to John',
                    approver: null,
                    complete_message: 'Transfer initiated successfully',
                    requires_approval: 0,
                    is_approved: 1,
                    bank_name: 'Access Bank',
                },
            };

            jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

            const result = await service.initiateTransfer(mockTransferData);

            expect(result).toEqual(mockResponse);
            expect(service['post']).toHaveBeenCalledWith('/transfers', mockTransferData);
        });

        it('should handle transfer initiation errors', async () => {
            const mockTransferData = {
                account_bank: '044',
                account_number: '1234567890',
                amount: 1000,
                narration: 'Transfer to John',
                currency: 'NGN',
                reference: 'REF_123',
            };

            const mockError = new Error('Transfer initiation failed');
            jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

            await expect(service.initiateTransfer(mockTransferData)).rejects.toThrow('Transfer initiation failed');
        });

        it('should initiate direct transfer on v4 orchestrator endpoint', async () => {
            const v4Service = new TransferService({ ...mockOptions, version: 'v4' });
            const payload = { action: 'instant', reference: 'ref_123' };
            jest.spyOn(v4Service as any, 'isV4').mockReturnValue(true);
            jest.spyOn(v4Service as any, 'post').mockResolvedValue({ status: 'success', message: 'ok', data: {} });

            await v4Service.initiateDirectTransfer(payload as any);
            expect(v4Service['post']).toHaveBeenCalledWith('/direct-transfers', payload);
        });
    });

    describe('getTransfers', () => {
        it('should get transfers without parameters', async () => {
            const mockResponse = {
                status: 'success',
                message: 'Transfers retrieved',
                data: [
                    {
                        id: 1,
                        account_number: '1234567890',
                        bank_code: '044',
                        fullname: 'John Doe',
                        amount: 1000,
                        currency: 'NGN',
                        status: 'completed',
                        reference: 'REF_001',
                    },
                    {
                        id: 2,
                        account_number: '0987654321',
                        bank_code: '050',
                        fullname: 'Jane Smith',
                        amount: 2000,
                        currency: 'NGN',
                        status: 'pending',
                        reference: 'REF_002',
                    },
                ],
                meta: {
                    page_info: {
                        total: 2,
                        current_page: 1,
                        total_pages: 1,
                    },
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransfers();

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transfers', undefined);
        });

        it('should get transfers with parameters', async () => {
            const params = {
                page: 1,
                per_page: 10,
                from: '2024-01-01',
                to: '2024-12-31',
                status: 'completed',
            };

            const mockResponse = {
                status: 'success',
                message: 'Transfers retrieved',
                data: [
                    {
                        id: 1,
                        account_number: '1234567890',
                        bank_code: '044',
                        fullname: 'John Doe',
                        amount: 1000,
                        currency: 'NGN',
                        status: 'completed',
                        reference: 'REF_001',
                    },
                ],
                meta: {
                    page_info: {
                        total: 1,
                        current_page: 1,
                        total_pages: 1,
                    },
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransfers(params);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transfers', params);
        });
    });

    describe('getTransfer', () => {
        it('should get a specific transfer by ID', async () => {
            const transferId = 123;
            const mockResponse = {
                status: 'success',
                message: 'Transfer retrieved',
                data: {
                    id: 123,
                    account_number: '1234567890',
                    bank_code: '044',
                    fullname: 'John Doe',
                    created_at: '2024-01-01T10:00:00Z',
                    currency: 'NGN',
                    debit_currency: 'NGN',
                    amount: 1000,
                    fee: 50,
                    status: 'completed',
                    reference: 'REF_123',
                    meta: {},
                    narration: 'Transfer to John',
                    approver: null,
                    complete_message: 'Transfer completed successfully',
                    requires_approval: 0,
                    is_approved: 1,
                    bank_name: 'Access Bank',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransfer(transferId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transfers/123');
        });
    });

    describe('getTransferFees', () => {
        it('should get transfer fees with default currency', async () => {
            const amount = 1000;
            const mockResponse = {
                status: 'success',
                message: 'Fees retrieved',
                data: {
                    fee: 50,
                    currency: 'NGN',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransferFees(amount);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transfers/fee', { amount: 1000, currency: 'NGN' });
        });

        it('should get transfer fees with custom currency', async () => {
            const amount = 1000;
            const currency = 'USD';
            const mockResponse = {
                status: 'success',
                message: 'Fees retrieved',
                data: {
                    fee: 5,
                    currency: 'USD',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransferFees(amount, currency);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transfers/fee', { amount: 1000, currency: 'USD' });
        });
    });
});
