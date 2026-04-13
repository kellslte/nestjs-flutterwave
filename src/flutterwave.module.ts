import { DynamicModule, Module } from '@nestjs/common';
import {
  FLUTTERWAVE_API_BASE_URL,
  FLUTTERWAVE_V4_PRODUCTION_BASE_URL,
  FLUTTERWAVE_V4_SANDBOX_BASE_URL,
  FLUTTERWAVE_MODULE_OPTIONS,
} from './constants';
import { FlutterwaveModuleOptions, FlutterwaveModuleAsyncOptions } from './interfaces';
import { FlutterwaveService } from './flutterwave.service';

@Module({})
export class FlutterwaveModule {
  static forRoot(options: FlutterwaveModuleOptions): DynamicModule {
    return {
      module: FlutterwaveModule,
      providers: [
        {
          provide: FLUTTERWAVE_MODULE_OPTIONS,
          useValue: {
            version: options.version || 'v3',
            environment: options.environment || 'sandbox',
            baseUrl:
              options.baseUrl ||
              (options.version === 'v4'
                ? options.environment === 'production'
                  ? FLUTTERWAVE_V4_PRODUCTION_BASE_URL
                  : FLUTTERWAVE_V4_SANDBOX_BASE_URL
                : FLUTTERWAVE_API_BASE_URL),
            timeout: 30000,
            retries: 3,
            retryDelay: 1000,
            maxRetryDelay: 10000,
            ...options,
          },
        },
        FlutterwaveService,
      ],
      exports: [FlutterwaveService],
      global: true,
    };
  }

  static forRootAsync(options: FlutterwaveModuleAsyncOptions): DynamicModule {
    return {
      module: FlutterwaveModule,
      imports: options.imports || [],
      providers: [
        {
          provide: FLUTTERWAVE_MODULE_OPTIONS,
          useFactory: async (...args: any[]) => {
            const resolved = await options.useFactory(...args);
            const version = resolved.version || 'v3';
            const environment = resolved.environment || 'sandbox';
            return {
              version,
              environment,
              baseUrl:
                resolved.baseUrl ||
                (version === 'v4'
                  ? environment === 'production'
                    ? FLUTTERWAVE_V4_PRODUCTION_BASE_URL
                    : FLUTTERWAVE_V4_SANDBOX_BASE_URL
                  : FLUTTERWAVE_API_BASE_URL),
              timeout: 30000,
              retries: 3,
              retryDelay: 1000,
              maxRetryDelay: 10000,
              ...resolved,
            };
          },
          inject: options.inject || [],
        },
        FlutterwaveService,
      ],
      exports: [FlutterwaveService],
      global: true,
    };
  }
}
