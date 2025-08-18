import { SettlementService } from '../../src/services/settlement.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('SettlementService', () => {
  let service: SettlementService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new SettlementService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettlements', () => {
    it('should get settlements without parameters', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Settlements retrieved',
        data: [
          {
            id: 1,
            amount: 10000,
            currency: 'NGN',
            status: 'completed',
            created_at: '2024-01-01T10:00:00Z',
          },
          {
            id: 2,
            amount: 20000,
            currency: 'NGN',
            status: 'pending',
            created_at: '2024-01-01T11:00:00Z',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSettlements();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/settlements', undefined);
    });

    it('should get settlements with parameters', async () => {
      const params = {
        page: 1,
        per_page: 10,
        from: '2024-01-01',
        to: '2024-12-31',
      };

      const mockResponse = {
        status: 'success',
        message: 'Settlements retrieved',
        data: [
          {
            id: 1,
            amount: 10000,
            currency: 'NGN',
            status: 'completed',
            created_at: '2024-01-01T10:00:00Z',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSettlements(params);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/settlements', params);
    });
  });

  describe('getSettlement', () => {
    it('should get a specific settlement by ID', async () => {
      const settlementId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Settlement retrieved',
        data: {
          id: 123,
          amount: 10000,
          currency: 'NGN',
          status: 'completed',
          created_at: '2024-01-01T10:00:00Z',
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSettlement(settlementId);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/settlements/123');
    });
  });
});
