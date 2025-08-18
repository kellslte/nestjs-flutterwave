import { DynamicModule, Module } from '@nestjs/common';
import { FLUTTERWAVE_MODULE_OPTIONS } from './constants';
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
            baseUrl: options.version === 'v4' 
              ? 'https://api.flutterwave.com/v4'
              : 'https://api.flutterwave.com/v3',
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
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        FlutterwaveService,
      ],
      exports: [FlutterwaveService],
      global: true,
    };
  }
}
