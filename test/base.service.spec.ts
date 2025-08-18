import { BaseService } from '../src/base.service';
import { FlutterwaveModuleOptions } from '../src/interfaces';

class TestService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  // Expose protected methods for testing
  public testGetBaseUrl(): string {
    return this.getBaseUrl();
  }

  public testGetHeaders(): Record<string, string> {
    return this.getHeaders();
  }

  public testGetRetryOptions() {
    return this.getRetryOptions();
  }
}

describe('BaseService', () => {
  let service: TestService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    timeout: 5000,
    retries: 2,
    retryDelay: 500,
    maxRetryDelay: 5000,
  };

  beforeEach(() => {
    service = new TestService(mockOptions);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct base URL for v3', () => {
    const options = { ...mockOptions, version: 'v3' as const };
    const v3Service = new TestService(options);
    expect(v3Service.testGetBaseUrl()).toBe('https://api.flutterwave.com/v3');
  });

  it('should return correct base URL for v4', () => {
    const options = { ...mockOptions, version: 'v4' as const };
    const v4Service = new TestService(options);
    expect(v4Service.testGetBaseUrl()).toBe('https://api.flutterwave.com/v4');
  });

  it('should return custom base URL when provided', () => {
    const options = { ...mockOptions, baseUrl: 'https://custom.api.com' };
    const customService = new TestService(options);
    expect(customService.testGetBaseUrl()).toBe('https://custom.api.com');
  });

  it('should return correct headers', () => {
    const headers = service.testGetHeaders();
    expect(headers.Authorization).toBe('Bearer test_secret_key');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should return correct retry options', () => {
    const retryOptions = service.testGetRetryOptions();
    expect(retryOptions.retries).toBe(2);
    expect(retryOptions.retryDelay).toBe(500);
    expect(retryOptions.maxRetryDelay).toBe(5000);
  });

  it('should use default retry options when not provided', () => {
    const options = { secretKey: 'test' };
    const defaultService = new TestService(options);
    const retryOptions = defaultService.testGetRetryOptions();
    expect(retryOptions.retries).toBe(3);
    expect(retryOptions.retryDelay).toBe(1000);
    expect(retryOptions.maxRetryDelay).toBe(10000);
  });
});
