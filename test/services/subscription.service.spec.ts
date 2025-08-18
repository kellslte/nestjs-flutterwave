import { SubscriptionService } from '../../src/services/subscription.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new SubscriptionService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should create subscription successfully', async () => {
      const mockSubscriptionData = {
        amount: 1000,
        currency: 'NGN',
        plan: 123,
        email: 'test@example.com',
        tx_ref: 'SUB_REF_123',
      };

      const mockResponse = {
        status: 'success',
        message: 'Subscription created',
        data: {
          id: 123,
          amount: 1000,
          currency: 'NGN',
          plan: 123,
          email: 'test@example.com',
          status: 'active',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.createSubscription(mockSubscriptionData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/subscriptions', mockSubscriptionData);
    });
  });

  describe('getSubscriptions', () => {
    it('should get subscriptions successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Subscriptions retrieved',
        data: [
          {
            id: 1,
            amount: 1000,
            currency: 'NGN',
            plan: 123,
            email: 'test1@example.com',
            status: 'active',
          },
          {
            id: 2,
            amount: 2000,
            currency: 'NGN',
            plan: 456,
            email: 'test2@example.com',
            status: 'active',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSubscriptions();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/subscriptions', undefined);
    });

    it('should get subscriptions with parameters', async () => {
      const params = {
        page: 1,
        per_page: 10,
        from: '2024-01-01',
        to: '2024-12-31',
      };

      const mockResponse = {
        status: 'success',
        message: 'Subscriptions retrieved',
        data: [
          {
            id: 1,
            amount: 1000,
            currency: 'NGN',
            plan: 123,
            email: 'test@example.com',
            status: 'active',
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSubscriptions(params);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/subscriptions', params);
    });
  });

  describe('getSubscription', () => {
    it('should get a specific subscription by ID', async () => {
      const subscriptionId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Subscription retrieved',
        data: {
          id: 123,
          amount: 1000,
          currency: 'NGN',
          plan: 123,
          email: 'test@example.com',
          status: 'active',
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getSubscription(subscriptionId);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/subscriptions/123');
    });
  });

  describe('updateSubscription', () => {
    it('should update subscription successfully', async () => {
      const subscriptionId = 123;
      const updateData = {
        amount: 1500,
        currency: 'NGN',
      };

      const mockResponse = {
        status: 'success',
        message: 'Subscription updated',
        data: {
          id: 123,
          amount: 1500,
          currency: 'NGN',
          plan: 123,
          email: 'test@example.com',
          status: 'active',
        },
      };

      jest.spyOn(service as any, 'put').mockResolvedValue(mockResponse);

      const result = await service.updateSubscription(subscriptionId, updateData);

      expect(result).toEqual(mockResponse);
      expect(service['put']).toHaveBeenCalledWith('/subscriptions/123', updateData);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      const subscriptionId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Subscription cancelled',
      };

      jest.spyOn(service as any, 'put').mockResolvedValue(mockResponse);

      const result = await service.cancelSubscription(subscriptionId);

      expect(result).toEqual(mockResponse);
      expect(service['put']).toHaveBeenCalledWith('/subscriptions/123/cancel', {});
    });
  });
});
