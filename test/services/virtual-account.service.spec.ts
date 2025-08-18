import { VirtualAccountService } from '../../src/services/virtual-account.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('VirtualAccountService', () => {
  let service: VirtualAccountService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new VirtualAccountService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVirtualAccount', () => {
    it('should create virtual account successfully', async () => {
      const mockVirtualAccountData = {
        email: 'test@example.com',
        is_permanent: true,
        bvn: '12345678901',
        tx_ref: 'TX_REF_123',
        phone_number: '+2348012345678',
        firstname: 'John',
        lastname: 'Doe',
        narration: 'Virtual account for John',
      };

      const mockResponse = {
        status: 'success',
        message: 'Virtual account created',
        data: {
          id: 123,
          account_number: '1234567890',
          bank_name: 'Test Bank',
          created_at: '2024-01-01T10:00:00Z',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.createVirtualAccount(mockVirtualAccountData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/virtual-account-numbers', mockVirtualAccountData);
    });
  });

  describe('getVirtualAccounts', () => {
    it('should get virtual accounts successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Virtual accounts retrieved',
        data: [
          {
            id: 1,
            account_number: '1234567890',
            bank_name: 'Test Bank 1',
            created_at: '2024-01-01T10:00:00Z',
          },
          {
            id: 2,
            account_number: '0987654321',
            bank_name: 'Test Bank 2',
            created_at: '2024-01-01T11:00:00Z',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getVirtualAccounts();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/virtual-account-numbers', undefined);
    });

    it('should get virtual accounts with parameters', async () => {
      const params = {
        page: 1,
        per_page: 10,
        from: '2024-01-01',
        to: '2024-12-31',
      };

      const mockResponse = {
        status: 'success',
        message: 'Virtual accounts retrieved',
        data: [
          {
            id: 1,
            account_number: '1234567890',
            bank_name: 'Test Bank 1',
            created_at: '2024-01-01T10:00:00Z',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getVirtualAccounts(params);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/virtual-account-numbers', params);
    });
  });

  describe('getVirtualAccount', () => {
    it('should get a specific virtual account by ID', async () => {
      const virtualAccountId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Virtual account retrieved',
        data: {
          id: 123,
          account_number: '1234567890',
          bank_name: 'Test Bank',
          created_at: '2024-01-01T10:00:00Z',
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getVirtualAccount(virtualAccountId);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/virtual-account-numbers/123');
    });
  });

  describe('updateVirtualAccount', () => {
    it('should update virtual account successfully', async () => {
      const virtualAccountId = 123;
      const updateData = {
        narration: 'Updated virtual account description',
      };

      const mockResponse = {
        status: 'success',
        message: 'Virtual account updated',
        data: {
          id: 123,
          account_number: '1234567890',
          bank_name: 'Test Bank',
          narration: 'Updated virtual account description',
          updated_at: '2024-01-01T12:00:00Z',
        },
      };

      jest.spyOn(service as any, 'put').mockResolvedValue(mockResponse);

      const result = await service.updateVirtualAccount(virtualAccountId, updateData);

      expect(result).toEqual(mockResponse);
      expect(service['put']).toHaveBeenCalledWith('/virtual-account-numbers/123', updateData);
    });
  });

  describe('deactivateVirtualAccount', () => {
    it('should deactivate virtual account successfully', async () => {
      const virtualAccountId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Virtual account deactivated',
      };

      jest.spyOn(service as any, 'delete').mockResolvedValue(mockResponse);

      const result = await service.deactivateVirtualAccount(virtualAccountId);

      expect(result).toEqual(mockResponse);
      expect(service['delete']).toHaveBeenCalledWith('/virtual-account-numbers/123');
    });
  });
});
