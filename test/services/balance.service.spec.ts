import { BalanceService } from '../../src/services/balance.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('BalanceService', () => {
  let service: BalanceService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new BalanceService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should get balance successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Balance retrieved',
        data: [
          {
            currency: 'NGN',
            available_balance: 100000,
            ledger_balance: 100000,
          },
          {
            currency: 'USD',
            available_balance: 1000,
            ledger_balance: 1000,
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getBalance();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/balance');
    });

    it('should handle balance retrieval errors', async () => {
      const mockError = new Error('Balance retrieval failed');
      jest.spyOn(service as any, 'get').mockRejectedValue(mockError);

      await expect(service.getBalance()).rejects.toThrow('Balance retrieval failed');
    });
  });
});
