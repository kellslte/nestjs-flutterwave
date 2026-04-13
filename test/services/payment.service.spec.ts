import { PaymentService } from '../../src/services/payment.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('PaymentService', () => {
    let service: PaymentService;
    const mockOptions: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        publicKey: 'test_public_key',
        version: 'v3',
    };

    beforeEach(() => {
        service = new PaymentService(mockOptions);
        // Clear all mocks
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('initializePayment', () => {
        it('should initialize payment successfully', async () => {
            const mockPaymentData = {
                tx_ref: 'TX_123',
                amount: 1000,
                currency: 'NGN',
                redirect_url: 'https://example.com/callback',
                customer: {
                    email: 'test@example.com',
                    name: 'Test User',
                },
            };

            const mockResponse = {
                status: 'success',
                message: 'Payment initialized',
                data: {
                    link: 'https://checkout.flutterwave.com/v3/hosted/pay/123',
                    status: 'pending',
                    message: 'Payment initialized',
                    reference: 'FLW_REF_123',
                },
            };

            // Mock the post method
            jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

            const result = await service.initializePayment(mockPaymentData);

            expect(result).toEqual(mockResponse);
            expect(service['post']).toHaveBeenCalledWith('/payments', mockPaymentData);
        });

        it('should initialize payment on /charges for v4', async () => {
            const v4Service = new PaymentService({ ...mockOptions, version: 'v4' });
            const payload = {
                tx_ref: 'TX_123',
                amount: 1000,
                currency: 'NGN',
                redirect_url: 'https://example.com/callback',
                customer: { email: 'test@example.com' },
            };
            jest.spyOn(v4Service as any, 'isV4').mockReturnValue(true);
            jest.spyOn(v4Service as any, 'post').mockResolvedValue({ status: 'success', message: 'ok', data: {} });

            await v4Service.initializePayment(payload as any);
            expect(v4Service['post']).toHaveBeenCalledWith('/charges', payload);
        });

        it('should handle payment initialization errors', async () => {
            const mockPaymentData = {
                tx_ref: 'TX_123',
                amount: 1000,
                currency: 'NGN',
                redirect_url: 'https://example.com/callback',
                customer: {
                    email: 'test@example.com',
                    name: 'Test User',
                },
            };

            const mockError = new Error('Payment initialization failed');
            jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

            await expect(service.initializePayment(mockPaymentData)).rejects.toThrow('Payment initialization failed');
        });
    });

    describe('verifyPayment', () => {
        it('should verify payment by tx_ref', async () => {
            const mockVerificationData = {
                tx_ref: 'TX_123',
            };

            const mockResponse = {
                status: 'success',
                message: 'Payment verified',
                data: {
                    id: 123,
                    tx_ref: 'TX_123',
                    flw_ref: 'FLW_REF_123',
                    status: 'successful',
                    amount: 1000,
                    currency: 'NGN',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.verifyPayment(mockVerificationData);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/verify_by_reference?tx_ref=TX_123');
        });

        it('should verify payment by flw_ref', async () => {
            const mockVerificationData = {
                tx_ref: 'TX_123',
                flw_ref: 'FLW_REF_123',
            };

            const mockResponse = {
                status: 'success',
                message: 'Payment verified',
                data: {
                    id: 123,
                    tx_ref: 'TX_123',
                    flw_ref: 'FLW_REF_123',
                    status: 'successful',
                    amount: 1000,
                    currency: 'NGN',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.verifyPayment(mockVerificationData);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/FLW_REF_123/verify');
        });

        it('should verify payment by charge id for v4', async () => {
            const v4Service = new PaymentService({ ...mockOptions, version: 'v4' });
            jest.spyOn(v4Service as any, 'isV4').mockReturnValue(true);
            jest.spyOn(v4Service as any, 'get').mockResolvedValue({ status: 'success', message: 'ok', data: {} });

            await v4Service.verifyPayment({ charge_id: 'chg_123' });
            expect(v4Service['get']).toHaveBeenCalledWith('/charges/chg_123');
        });
    });

    describe('getPaymentByReference', () => {
        it('should get payment by reference', async () => {
            const txRef = 'TX_123';
            const mockResponse = {
                status: 'success',
                message: 'Payment retrieved',
                data: {
                    id: 123,
                    tx_ref: 'TX_123',
                    status: 'successful',
                    amount: 1000,
                    currency: 'NGN',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getPaymentByReference(txRef);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/verify_by_reference?tx_ref=TX_123');
        });
    });

    describe('getPaymentByFlwRef', () => {
        it('should get payment by Flutterwave reference', async () => {
            const flwRef = 'FLW_REF_123';
            const mockResponse = {
                status: 'success',
                message: 'Payment retrieved',
                data: {
                    id: 123,
                    flw_ref: 'FLW_REF_123',
                    status: 'successful',
                    amount: 1000,
                    currency: 'NGN',
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getPaymentByFlwRef(flwRef);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/transactions/FLW_REF_123/verify');
        });
    });
});
