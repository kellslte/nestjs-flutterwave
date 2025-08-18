# Flutterwave NestJS Package - Package Summary

## Overview
This is a comprehensive NestJS package for integrating with the Flutterwave API. It provides a clean, type-safe interface to all Flutterwave payment services.

## Package Structure

```
@scwar/nestjs-flutterwave/
├── src/
│   ├── constants.ts                 # Package constants and defaults
│   ├── errors/
│   │   ├── flutterwave.error.ts     # Custom error handling
│   │   └── index.ts                 # Error exports
│   ├── interfaces/                   # TypeScript interfaces
│   │   ├── index.ts                 # Main interface exports
│   │   ├── module.interface.ts      # Module configuration
│   │   ├── http.interface.ts        # HTTP client interfaces
│   │   ├── transaction.interface.ts # Transaction types
│   │   ├── payment.interface.ts     # Payment types
│   │   ├── customer.interface.ts    # Customer types
│   │   ├── bank.interface.ts        # Bank types
│   │   ├── transfer.interface.ts    # Transfer types
│   │   ├── webhook.interface.ts     # Webhook types
│   │   ├── card.interface.ts        # Card payment types
│   │   ├── virtual-account.interface.ts # Virtual account types
│   │   ├── subscription.interface.ts # Subscription types
│   │   ├── plan.interface.ts        # Payment plan types
│   │   ├── refund.interface.ts      # Refund types
│   │   ├── settlement.interface.ts  # Settlement types
│   │   ├── split.interface.ts       # Split payment types
│   │   ├── verification.interface.ts # Verification types
│   │   ├── balance.interface.ts     # Balance types
│   │   ├── bvn.interface.ts         # BVN verification types
│   │   ├── otp.interface.ts         # OTP types
│   │   └── charge.interface.ts      # Charge types
│   ├── services/                     # Service implementations
│   │   ├── payment.service.ts        # Payment operations
│   │   ├── transaction.service.ts    # Transaction operations
│   │   ├── customer.service.ts       # Customer operations
│   │   ├── bank.service.ts           # Bank operations
│   │   ├── transfer.service.ts       # Transfer operations
│   │   ├── virtual-account.service.ts # Virtual account operations
│   │   ├── subscription.service.ts   # Subscription operations
│   │   ├── plan.service.ts           # Payment plan operations
│   │   ├── refund.service.ts         # Refund operations
│   │   ├── settlement.service.ts     # Settlement operations
│   │   ├── split.service.ts          # Split payment operations
│   │   ├── verification.service.ts   # Verification operations
│   │   ├── balance.service.ts        # Balance operations
│   │   ├── bvn.service.ts            # BVN verification operations
│   │   ├── otp.service.ts            # OTP operations
│   │   └── charge.service.ts         # Charge operations
│   ├── base.service.ts               # Base service class
│   ├── http-client.ts                # HTTP client with retry logic
│   ├── flutterwave.service.ts        # Main service aggregator
│   ├── flutterwave.module.ts         # NestJS module
│   └── index.ts                      # Main exports
├── test/                             # Test files
│   ├── base.service.spec.ts          # Base service tests
│   ├── http-client.spec.ts           # HTTP client tests
│   ├── flutterwave.service.spec.ts   # Main service tests
│   └── jest-e2e.json                 # E2E test config
├── examples/                          # Usage examples
│   ├── basic-payment.ts              # Basic payment example
│   ├── webhook-handling.ts           # Webhook handling example
│   └── subscription-management.ts    # Subscription management example
├── package.json                       # Package configuration
├── tsconfig.json                      # TypeScript config
├── tsconfig.test.json                 # Test TypeScript config
├── .eslintrc.js                       # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── .gitignore                         # Git ignore rules
├── README.md                          # Comprehensive documentation
├── CHANGELOG.md                       # Change history
├── LICENSE                            # MIT license
└── PACKAGE_SUMMARY.md                # This file
```

## Key Features

### 🚀 **Full API Coverage**
- **Payments**: Initialize, verify, and manage payments
- **Transactions**: Query and manage transaction history
- **Customers**: Create, update, and manage customer profiles
- **Banks**: Get bank lists, branches, and validate accounts
- **Transfers**: Initiate and manage bank transfers
- **Virtual Accounts**: Create and manage virtual account numbers
- **Subscriptions**: Handle recurring payment subscriptions
- **Plans**: Create and manage payment plans
- **Refunds**: Process payment refunds
- **Settlements**: View settlement information
- **Splits**: Handle split payment scenarios
- **Verifications**: Verify cards, accounts, and identities
- **Balance**: Check account balances
- **BVN**: Bank Verification Number operations
- **OTP**: One-Time Password operations
- **Charges**: Direct charging for various payment methods

### 🔒 **Type Safety**
- Full TypeScript support with comprehensive interfaces
- Type-safe API calls and responses
- IntelliSense support for all operations

### 🧪 **Testing**
- Comprehensive test coverage with Jest
- Unit tests for all services
- Mock HTTP responses for reliable testing
- E2E test configuration

### 🔄 **Reliability**
- Automatic retry logic with exponential backoff
- Configurable timeout and retry settings
- Custom retry logic support
- Comprehensive error handling

### ⚡ **Performance**
- Optimized HTTP client
- Connection pooling
- Efficient request handling

### 🎯 **NestJS Native**
- Built specifically for NestJS applications
- Global module support
- Dependency injection ready
- Async configuration support

## Configuration Options

```typescript
interface FlutterwaveModuleOptions {
  secretKey: string;           // Required: Your Flutterwave secret key
  publicKey?: string;          // Optional: Your Flutterwave public key
  baseUrl?: string;            // Optional: Custom API base URL
  version?: 'v3' | 'v4';      // Optional: API version (default: 'v3')
  timeout?: number;            // Optional: Request timeout in ms (default: 30000)
  retries?: number;            // Optional: Number of retries (default: 3)
  retryDelay?: number;         // Optional: Retry delay in ms (default: 1000)
  maxRetryDelay?: number;      // Optional: Max retry delay in ms (default: 10000)
  shouldRetry?: (error: any) => boolean; // Optional: Custom retry logic
}
```

## Usage Examples

### Basic Setup
```typescript
import { FlutterwaveModule } from '@scwar/nestjs-flutterwave';

@Module({
  imports: [
    FlutterwaveModule.forRoot({
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
      version: 'v3',
    }),
  ],
})
export class AppModule {}
```

### Service Usage
```typescript
import { FlutterwaveService } from '@scwar/nestjs-flutterwave';

@Injectable()
export class PaymentService {
  constructor(private readonly flutterwave: FlutterwaveService) {}

  async processPayment(amount: number, email: string) {
    const payment = await this.flutterwave.payments.initializePayment({
      tx_ref: `TX_${Date.now()}`,
      amount,
      currency: 'NGN',
      redirect_url: 'https://yourapp.com/callback',
      customer: { email, name: 'John Doe' },
    });
    return payment;
  }
}
```

## Error Handling

The package provides comprehensive error handling with custom `FlutterwaveError` class:

```typescript
import { FlutterwaveError } from '@scwar/nestjs-flutterwave';

try {
  const payment = await this.flutterwave.payments.initializePayment(paymentData);
} catch (error) {
  if (error instanceof FlutterwaveError) {
    console.log('Flutterwave Error:', error.message);
    console.log('Status:', error.status);
    console.log('Code:', error.code);
    console.log('Data:', error.data);
  }
}
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

## Building

```bash
# Build the package
npm run build

# The built files will be in the `dist/` directory
```

## Dependencies

### Peer Dependencies
- `@nestjs/common`: ^10.0.0
- `@nestjs/core`: ^10.0.0
- `rxjs`: ^7.8.0

### Dev Dependencies
- TypeScript, Jest, ESLint, Prettier, and related tools
- NestJS testing utilities

## License
MIT License - see LICENSE file for details

## Support
- GitHub Issues: [nestjs-flutterwave/issues](https://github.com/kellslte/nestjs-flutterwave/issues)
- Flutterwave API Docs: [developer.flutterwave.com](https://developer.flutterwave.com/)

## Contributing
Contributions are welcome! Please see the contributing guidelines in the README.

---

This package provides a production-ready, enterprise-grade solution for integrating Flutterwave payment services into NestJS applications. It follows NestJS best practices and provides a clean, maintainable API for all Flutterwave operations.
