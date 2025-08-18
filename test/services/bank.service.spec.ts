import { BankService } from '../../src/services/bank.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('BankService', () => {
    let service: BankService;
    const mockOptions: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        publicKey: 'test_public_key',
        version: 'v3',
    };

    beforeEach(() => {
        service = new BankService(mockOptions);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getBanks', () => {
        it('should get banks with default country', async () => {
            const mockResponse = {
                status: 'success',
                message: 'Banks retrieved',
                data: [
                    {
                        id: 1,
                        code: '044',
                        name: 'Access Bank',
                        active: true,
                        country: 'NG',
                        currency: 'NGN',
                        type: 'nuban',
                        is_deleted: false,
                        created_at: '2024-01-01T10:00:00Z',
                        updated_at: '2024-01-01T10:00:00Z',
                    },
                    {
                        id: 2,
                        code: '050',
                        name: 'Ecobank',
                        active: true,
                        country: 'NG',
                        currency: 'NGN',
                        type: 'nuban',
                        is_deleted: false,
                        created_at: '2024-01-01T10:00:00Z',
                        updated_at: '2024-01-01T10:00:00Z',
                    },
                ],
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getBanks();

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/banks', { country: 'NG' });
        });

        it('should get banks with custom country', async () => {
            const country = 'GH';
            const mockResponse = {
                status: 'success',
                message: 'Banks retrieved',
                data: [
                    {
                        id: 1,
                        code: '001',
                        name: 'Ghana Commercial Bank',
                        active: true,
                        country: 'GH',
                        currency: 'GHS',
                        type: 'nuban',
                        is_deleted: false,
                        created_at: '2024-01-01T10:00:00Z',
                        updated_at: '2024-01-01T10:00:00Z',
                    },
                ],
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getBanks(country);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/banks', { country: 'GH' });
        });
    });

    describe('getBankBranches', () => {
        it('should get bank branches successfully', async () => {
            const bankId = 1;
            const mockResponse = {
                status: 'success',
                message: 'Bank branches retrieved',
                data: [
                    {
                        id: 1,
                        bank_id: 1,
                        name: 'Victoria Island Branch',
                        address: '123 Victoria Island, Lagos',
                        city: 'Lagos',
                        state: 'Lagos',
                        country: 'NG',
                    },
                    {
                        id: 2,
                        bank_id: 1,
                        name: 'Ikeja Branch',
                        address: '456 Ikeja, Lagos',
                        city: 'Lagos',
                        state: 'Lagos',
                        country: 'NG',
                    },
                ],
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getBankBranches(bankId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/banks/1/branches');
        });
    });

    describe('validateBankAccount', () => {
        it('should validate bank account successfully', async () => {
            const accountNumber = '1234567890';
            const accountBank = '044';
            const mockResponse = {
                status: 'success',
                message: 'Account validated',
                data: {
                    account_number: '1234567890',
                    account_name: 'John Doe',
                    bank_id: 1,
                },
            };

            jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

            const result = await service.validateBankAccount(accountNumber, accountBank);

            expect(result).toEqual(mockResponse);
            expect(service['post']).toHaveBeenCalledWith('/accounts/resolve', {
                account_number: '1234567890',
                account_bank: '044',
            });
        });

        it('should handle bank account validation errors', async () => {
            const accountNumber = '1234567890';
            const accountBank = '044';
            const mockError = new Error('Account validation failed');
            jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

            await expect(service.validateBankAccount(accountNumber, accountBank)).rejects.toThrow('Account validation failed');
        });
    });
});
