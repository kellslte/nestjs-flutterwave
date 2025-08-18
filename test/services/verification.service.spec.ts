import { VerificationService } from '../../src/services/verification.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('VerificationService', () => {
  let service: VerificationService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new VerificationService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyCardBin', () => {
    it('should verify card BIN successfully', async () => {
      const bin = '123456';
      const mockResponse = {
        status: 'success',
        message: 'Card BIN verified',
        data: {
          bin: '123456',
          brand: 'VISA',
          type: 'DEBIT',
          bank: 'Test Bank',
          country: 'NG',
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.verifyCardBin(bin);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/card-bins/123456');
    });
  });

  describe('verifyAccountNumber', () => {
    it('should verify account number successfully', async () => {
      const accountNumber = '1234567890';
      const accountBank = '044';
      const mockResponse = {
        status: 'success',
        message: 'Account verified',
        data: {
          account_number: '1234567890',
          account_name: 'John Doe',
          bank_id: 1,
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.verifyAccountNumber(accountNumber, accountBank);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/accounts/resolve', {
        account_number: '1234567890',
        account_bank: '044',
      });
    });

    it('should handle account verification errors', async () => {
      const accountNumber = '1234567890';
      const accountBank = '044';
      const mockError = new Error('Account verification failed');
      jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

      await expect(service.verifyAccountNumber(accountNumber, accountBank)).rejects.toThrow('Account verification failed');
    });
  });
});
