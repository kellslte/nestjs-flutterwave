import { TransactionService } from '../../src/services/transaction.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('TransactionService', () => {
    let service: TransactionService;
    const mockOptions: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        publicKey: 'test_public_key',
        version: 'v3',
    };

    beforeEach(() => {
        service = new TransactionService(mockOptions);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getTransactions', () => {
        it('should get transactions without parameters', async () => {
            const mockResponse = {
                status: 'success',
                message: 'Transactions retrieved',
                data: [
                    {
                        id: 1,
                        tx_ref: 'TX_001',
                        amount: 1000,
                        currency: 'NGN',
                        status: 'successful',
                    },
                    {
                        id: 2,
                        tx_ref: 'TX_002',
                        amount: 2000,
                        currency: 'NGN',
                        status: 'successful',
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

            const result = await service.getTransactions();

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions', undefined);
        });

        it('should get transactions with parameters', async () => {
            const params = {
                page: 1,
                per_page: 10,
                from: '2024-01-01',
                to: '2024-12-31',
                status: 'successful',
                customer_email: 'test@example.com',
                tx_ref: 'TX_123',
            };

            const mockResponse = {
                status: 'success',
                message: 'Transactions retrieved',
                data: [
                    {
                        id: 1,
                        tx_ref: 'TX_123',
                        amount: 1000,
                        currency: 'NGN',
                        status: 'successful',
                        customer: { email: 'test@example.com' },
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

            const result = await service.getTransactions(params);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions', params);
        });
    });

    describe('getTransaction', () => {
        it('should get a specific transaction by ID', async () => {
            const transactionId = 123;
            const mockResponse = {
                status: 'success',
                message: 'Transaction retrieved',
                data: {
                    id: 123,
                    tx_ref: 'TX_123',
                    flw_ref: 'FLW_REF_123',
                    amount: 1000,
                    currency: 'NGN',
                    status: 'successful',
                    customer: {
                        email: 'test@example.com',
                        name: 'Test User',
                    },
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransaction(transactionId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/123');
        });
    });

    describe('getTransactionFees', () => {
        it('should get transaction fees with default currency', async () => {
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

            const result = await service.getTransactionFees(amount);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/fee', { amount: 1000, currency: 'NGN' });
        });

        it('should get transaction fees with custom currency', async () => {
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

            const result = await service.getTransactionFees(amount, currency);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/fee', { amount: 1000, currency: 'USD' });
        });
    });

    describe('getTransactionTimeline', () => {
        it('should get transaction timeline', async () => {
            const transactionId = 123;
            const mockResponse = {
                status: 'success',
                message: 'Timeline retrieved',
                data: [
                    {
                        id: 1,
                        action: 'Payment initiated',
                        timestamp: '2024-01-01T10:00:00Z',
                    },
                    {
                        id: 2,
                        action: 'Payment completed',
                        timestamp: '2024-01-01T10:05:00Z',
                    },
                ],
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransactionTimeline(transactionId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/123/timeline');
        });
    });

    describe('getTransactionEvents', () => {
        it('should get transaction events', async () => {
            const transactionId = 123;
            const mockResponse = {
                status: 'success',
                message: 'Events retrieved',
                data: [
                    {
                        id: 1,
                        event: 'payment.initiated',
                        timestamp: '2024-01-01T10:00:00Z',
                        metadata: { amount: 1000 },
                    },
                    {
                        id: 2,
                        event: 'payment.completed',
                        timestamp: '2024-01-01T10:05:00Z',
                        metadata: { status: 'successful' },
                    },
                ],
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getTransactionEvents(transactionId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/123/events');
        });
    });
});
