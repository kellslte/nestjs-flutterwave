import { FlutterwaveModuleOptions, FlutterwaveModuleAsyncOptions } from '../../src/interfaces';

describe('Module Interfaces', () => {
  describe('FlutterwaveModuleOptions', () => {
    it('should have required secretKey property', () => {
      const options: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
      };

      expect(options.secretKey).toBe('test_secret_key');
    });

    it('should have optional properties with correct types', () => {
      const options: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        publicKey: 'test_public_key',
        baseUrl: 'https://custom.api.com',
        version: 'v4',
        timeout: 60000,
        retries: 5,
        retryDelay: 2000,
        maxRetryDelay: 15000,
        shouldRetry: (error: any) => error.status === 500,
      };

      expect(options.secretKey).toBe('test_secret_key');
      expect(options.publicKey).toBe('test_public_key');
      expect(options.baseUrl).toBe('https://custom.api.com');
      expect(options.version).toBe('v4');
      expect(options.timeout).toBe(60000);
      expect(options.retries).toBe(5);
      expect(options.retryDelay).toBe(2000);
      expect(options.maxRetryDelay).toBe(15000);
      expect(typeof options.shouldRetry).toBe('function');
    });

    it('should allow version to be v3 or v4', () => {
      const v3Options: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        version: 'v3',
      };

      const v4Options: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        version: 'v4',
      };

      expect(v3Options.version).toBe('v3');
      expect(v4Options.version).toBe('v4');
    });
  });

  describe('FlutterwaveModuleAsyncOptions', () => {
    it('should have required useFactory property', () => {
      const asyncOptions: FlutterwaveModuleAsyncOptions = {
        useFactory: () => ({
          secretKey: 'test_secret_key',
        }),
      };

      expect(typeof asyncOptions.useFactory).toBe('function');
      expect(asyncOptions.useFactory()).toEqual({
        secretKey: 'test_secret_key',
      });
    });

    it('should have optional imports and inject properties', () => {
      const mockImports = [{ name: 'ConfigModule' }];
      const mockInject = ['ConfigService'];

      const asyncOptions: FlutterwaveModuleAsyncOptions = {
        imports: mockImports,
        useFactory: (configService: any) => ({
          secretKey: configService.get('SECRET_KEY'),
        }),
        inject: mockInject,
      };

      expect(asyncOptions.imports).toEqual(mockImports);
      expect(asyncOptions.inject).toEqual(mockInject);
    });

    it('should support async useFactory', async () => {
      const asyncOptions: FlutterwaveModuleAsyncOptions = {
        useFactory: async () => ({
          secretKey: 'async_secret_key',
        }),
      };

      const result = await asyncOptions.useFactory();
      expect(result.secretKey).toBe('async_secret_key');
    });
  });
});
