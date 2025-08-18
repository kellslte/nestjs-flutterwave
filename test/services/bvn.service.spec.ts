import { BvnService } from '../../src/services/bvn.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('BvnService', () => {
  let service: BvnService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new BvnService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyBvn', () => {
    it('should verify BVN successfully', async () => {
      const bvn = '12345678901';
      const mockResponse = {
        status: 'success',
        message: 'BVN verified',
        data: {
          bvn: '12345678901',
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '1990-01-01',
          phone_number: '+2348012345678',
          registration_date: '2020-01-01',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.verifyBvn(bvn);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/kyc/bvn', { bvn: '12345678901' });
    });

    it('should handle BVN verification errors', async () => {
      const bvn = '12345678901';
      const mockError = new Error('BVN verification failed');
      jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

      await expect(service.verifyBvn(bvn)).rejects.toThrow('BVN verification failed');
    });
  });

  describe('verifyBvnWithImage', () => {
    it('should verify BVN with image successfully', async () => {
      const bvn = '12345678901';
      const image = 'base64_image_string';
      const mockResponse = {
        status: 'success',
        message: 'BVN verified with image',
        data: {
          bvn: '12345678901',
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '1990-01-01',
          phone_number: '+2348012345678',
          registration_date: '2020-01-01',
          image_verification: 'successful',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.verifyBvnWithImage(bvn, image);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/kyc/bvn', {
        bvn: '12345678901',
        image: 'base64_image_string',
      });
    });
  });
});
