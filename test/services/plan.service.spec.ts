import { PlanService } from '../../src/services/plan.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('PlanService', () => {
  let service: PlanService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new PlanService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPlan', () => {
    it('should create plan successfully', async () => {
      const mockPlanData = {
        amount: 1000,
        name: 'Monthly Plan',
        interval: 'monthly',
        duration: 12,
      };

      const mockResponse = {
        status: 'success',
        message: 'Plan created',
        data: {
          id: 123,
          amount: 1000,
          name: 'Monthly Plan',
          interval: 'monthly',
          duration: 12,
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.createPlan(mockPlanData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/payment-plans', mockPlanData);
    });
  });

  describe('getPlans', () => {
    it('should get plans successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Plans retrieved',
        data: [
          {
            id: 1,
            amount: 1000,
            name: 'Monthly Plan',
            interval: 'monthly',
            duration: 12,
          },
          {
            id: 2,
            amount: 2000,
            name: 'Yearly Plan',
            interval: 'yearly',
            duration: 1,
          },
        ],
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getPlans();

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/payment-plans', undefined);
    });
  });

  describe('getPlan', () => {
    it('should get a specific plan by ID', async () => {
      const planId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Plan retrieved',
        data: {
          id: 123,
          amount: 1000,
          name: 'Monthly Plan',
          interval: 'monthly',
          duration: 12,
        },
      };

      jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

      const result = await service.getPlan(planId);

      expect(result).toEqual(mockResponse);
      expect(service['get']).toHaveBeenCalledWith('/payment-plans/123');
    });
  });

  describe('updatePlan', () => {
    it('should update plan successfully', async () => {
      const planId = 123;
      const updateData = {
        name: 'Updated Monthly Plan',
        amount: 1500,
      };

      const mockResponse = {
        status: 'success',
        message: 'Plan updated',
        data: {
          id: 123,
          amount: 1500,
          name: 'Updated Monthly Plan',
          interval: 'monthly',
          duration: 12,
        },
      };

      jest.spyOn(service as any, 'put').mockResolvedValue(mockResponse);

      const result = await service.updatePlan(planId, updateData);

      expect(result).toEqual(mockResponse);
      expect(service['put']).toHaveBeenCalledWith('/payment-plans/123', updateData);
    });
  });

  describe('deletePlan', () => {
    it('should delete plan successfully', async () => {
      const planId = 123;
      const mockResponse = {
        status: 'success',
        message: 'Plan deleted',
      };

      jest.spyOn(service as any, 'delete').mockResolvedValue(mockResponse);

      const result = await service.deletePlan(planId);

      expect(result).toEqual(mockResponse);
      expect(service['delete']).toHaveBeenCalledWith('/payment-plans/123');
    });
  });
});
