import { RefundService } from '../../src/services/refund.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('RefundService', () => {
  let service: RefundService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new RefundService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRefund', () => {
    it('should create refund successfully', async () => {
      const mockRefundData = {
        amount: 500,
        tx_ref: 'TX_REF_123',
        flw_ref: 'FLW_REF_123',
      };

      const mockResponse = {
        status: 'success',
        message: 'Refund created',
        data: {
          id: 123,
          amount: 500,
          tx_ref: 'TX_REF_123',
          flw_ref: 'FLW_REF_123',
          status: 'pending',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.createRefund(mockRefundData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/refunds', mockRefundData);
    });
  });

  describe('getRefunds', () => {
    it('should get refunds successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Refunds retrieved',
        data: [
          {
            id: 1,
            amount: 500,
            tx_ref: 'TX_REF_001',
            flw_ref: 'FLW_REF_001',
            status: 'completed',
          },
          {
            id: 2,
            amount: 1000,
            tx_ref: 'TX_REF_002',
            flw_ref: 'FLW_REF_002',
            status: 'pending',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getRefunds();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/refunds', undefined);
    });

    it('should get refunds with parameters', async () => {
      const params = {
        page: 1,
        per_page: 10,
        from: '2024-01-01',
        to: '2024-12-31',
      };

      const mockResponse = {
        status: 'success',
        message: 'Refunds retrieved',
        data: [
          {
            id: 1,
            amount: 500,
            tx_ref: 'TX_REF_001',
            flw_ref: 'FLW_REF_001',
            status: 'completed',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getRefunds(params);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/refunds', params);
    });
  });

  describe('getRefund', () => {
    it('should get a specific refund by ID', async () => {
      const refundId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Refund retrieved',
        data: {
          id: 123,
          amount: 500,
          tx_ref: 'TX_REF_123',
          flw_ref: 'FLW_REF_123',
          status: 'completed',
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getRefund(refundId);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/refunds/123');
    });
  });
});
