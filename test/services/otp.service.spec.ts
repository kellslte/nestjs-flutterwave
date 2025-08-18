import { OtpService } from '../../src/services/otp.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('OtpService', () => {
  let service: OtpService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new OtpService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOtp', () => {
    it('should create OTP successfully', async () => {
      const mockOtpData = {
        length: 6,
        customer: {
          email: 'test@example.com',
          phone: '+2348012345678',
          name: 'John Doe',
        },
        sender: 'Flutterwave',
        send: true,
      };

      const mockResponse = {
        status: 'success',
        message: 'OTP created',
        data: {
          reference: 'OTP_REF_123',
          length: 6,
          customer: {
            email: 'test@example.com',
            phone: '+2348012345678',
            name: 'John Doe',
          },
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.createOtp(mockOtpData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/otps', mockOtpData);
    });

    it('should handle OTP creation errors', async () => {
      const mockOtpData = {
        length: 6,
        customer: {
          email: 'test@example.com',
          phone: '+2348012345678',
          name: 'John Doe',
        },
        sender: 'Flutterwave',
        send: true,
      };

      const mockError = new Error('OTP creation failed');
      jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

      await expect(service.createOtp(mockOtpData)).rejects.toThrow('OTP creation failed');
    });
  });

  describe('validateOtp', () => {
    it('should validate OTP successfully', async () => {
      const reference = 'OTP_REF_123';
      const otp = '123456';
      const mockResponse = {
        status: 'success',
        message: 'OTP validated',
        data: {
          reference: 'OTP_REF_123',
          status: 'validated',
          customer: {
            email: 'test@example.com',
            phone: '+2348012345678',
            name: 'John Doe',
          },
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.validateOtp(reference, otp);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/otps/validate', {
        reference: 'OTP_REF_123',
        otp: '123456',
      });
    });

    it('should handle OTP validation errors', async () => {
      const reference = 'OTP_REF_123';
      const otp = '123456';
      const mockError = new Error('OTP validation failed');
      jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

      await expect(service.validateOtp(reference, otp)).rejects.toThrow('OTP validation failed');
    });
  });
});
