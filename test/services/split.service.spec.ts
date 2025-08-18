import { SplitService } from '../../src/services/split.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('SplitService', () => {
  let service: SplitService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new SplitService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSplit', () => {
    it('should create split successfully', async () => {
      const mockSplitData = {
        name: 'Revenue Split',
        type: 'percentage',
        currency: 'NGN',
        subaccounts: [
          {
            id: 123,
            transaction_split_ratio: 60,
          },
          {
            id: 456,
            transaction_split_ratio: 40,
          },
        ],
      };

      const mockResponse = {
        status: 'success',
        message: 'Split created',
        data: {
          id: 123,
          name: 'Revenue Split',
          type: 'percentage',
          currency: 'NGN',
          subaccounts: [
            {
              id: 123,
              transaction_split_ratio: 60,
            },
            {
              id: 456,
              transaction_split_ratio: 40,
            },
          ],
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.createSplit(mockSplitData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/splits', mockSplitData);
    });
  });

  describe('getSplits', () => {
    it('should get splits successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Splits retrieved',
        data: [
          {
            id: 1,
            name: 'Revenue Split 1',
            type: 'percentage',
            currency: 'NGN',
          },
          {
            id: 2,
            name: 'Revenue Split 2',
            type: 'flat',
            currency: 'NGN',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSplits();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/splits', undefined);
    });

    it('should get splits with parameters', async () => {
      const params = {
        page: 1,
        per_page: 10,
        from: '2024-01-01',
        to: '2024-12-31',
      };

      const mockResponse = {
        status: 'success',
        message: 'Splits retrieved',
        data: [
          {
            id: 1,
            name: 'Revenue Split 1',
            type: 'percentage',
            currency: 'NGN',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSplits(params);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/splits', params);
    });
  });

  describe('getSplit', () => {
    it('should get a specific split by ID', async () => {
      const splitId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Split retrieved',
        data: {
          id: 123,
          name: 'Revenue Split',
          type: 'percentage',
          currency: 'NGN',
          subaccounts: [
            {
              id: 123,
              transaction_split_ratio: 60,
            },
            {
              id: 456,
              transaction_split_ratio: 40,
            },
          ],
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSplit(splitId);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/splits/123');
    });
  });

  describe('updateSplit', () => {
    it('should update split successfully', async () => {
      const splitId = 123;
      const updateData = {
        name: 'Updated Revenue Split',
        type: 'flat',
      };

      const mockResponse = {
        status: 'success',
        message: 'Split updated',
        data: {
          id: 123,
          name: 'Updated Revenue Split',
          type: 'flat',
          currency: 'NGN',
        },
      };

      jest.spyOn(service as any, 'put').mockResolvedValue(mockResponse);

      const result = await service.updateSplit(splitId, updateData);

      expect(result).toEqual(mockResponse);
      expect(service['put']).toHaveBeenCalledWith('/splits/123', updateData);
    });
  });

  describe('deleteSplit', () => {
    it('should delete split successfully', async () => {
      const splitId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Split deleted',
      };

      jest.spyOn(service as any, 'delete').mockResolvedValue(mockResponse);

      const result = await service.deleteSplit(splitId);

      expect(result).toEqual(mockResponse);
      expect(service['delete']).toHaveBeenCalledWith('/splits/123');
    });
  });
});
