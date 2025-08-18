import { Test, TestingModule } from '@nestjs/testing';
import { FlutterwaveService } from '../src/flutterwave.service';
import { FlutterwaveModule } from '../src/flutterwave.module';

describe('FlutterwaveService', () => {
  let service: FlutterwaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        FlutterwaveModule.forRoot({
          secretKey: 'test_secret_key',
          publicKey: 'test_public_key',
          version: 'v3',
        }),
      ],
    }).compile();

    service = module.get<FlutterwaveService>(FlutterwaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have all service instances', () => {
    expect(service.payments).toBeDefined();
    expect(service.transactions).toBeDefined();
    expect(service.customers).toBeDefined();
    expect(service.banks).toBeDefined();
    expect(service.transfers).toBeDefined();
    expect(service.virtualAccounts).toBeDefined();
    expect(service.subscriptions).toBeDefined();
    expect(service.plans).toBeDefined();
    expect(service.refunds).toBeDefined();
    expect(service.settlements).toBeDefined();
    expect(service.splits).toBeDefined();
    expect(service.verifications).toBeDefined();
    expect(service.balances).toBeDefined();
    expect(service.bvn).toBeDefined();
    expect(service.otp).toBeDefined();
    expect(service.charges).toBeDefined();
  });

  it('should return configuration', () => {
    const config = service.getConfig();
    expect(config.secretKey).toBe('test_secret_key');
    expect(config.publicKey).toBe('test_public_key');
  });

  it('should check API version correctly', () => {
    // Since we explicitly set version to 'v3' in the test, it should return true
    expect(service.isVersion('v3')).toBe(true);
    expect(service.isVersion('v4')).toBe(false);
  });
});
