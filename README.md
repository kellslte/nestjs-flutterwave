# @scwar/nestjs-flutterwave

A comprehensive NestJS module for integrating with the Flutterwave API. This package provides a clean, type-safe interface to all Flutterwave payment services including payments, transfers, virtual accounts, subscriptions, and more.

## Features

- 🚀 **Full API Coverage**: Supports all Flutterwave API endpoints (v3 and v4)
- 🔒 **Type Safety**: Built with TypeScript for excellent developer experience
- 🧪 **Comprehensive Testing**: Full test coverage with Jest
- 🔄 **Automatic Retries**: Built-in retry logic with exponential backoff
- ⚡ **Performance**: Optimized HTTP client with connection pooling
- 🎯 **NestJS Native**: Built specifically for NestJS applications
- 📚 **Well Documented**: Comprehensive API documentation and examples

## Installation

```bash
npm install @scwar/nestjs-flutterwave
```

## Quick Start

### 1. Import the Module

#### v3 Configuration

```typescript
import { Module } from '@nestjs/common';
import { FlutterwaveModule } from '@scwar/nestjs-flutterwave';

@Module({
  imports: [
    FlutterwaveModule.forRoot({
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY, // v3 key or pre-fetched v4 access token
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
      version: 'v3', // or 'v4'
    }),
  ],
})
export class AppModule {}
```

#### v4 Configuration (OAuth2)

```typescript
import { Module } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FlutterwaveModule } from '@scwar/nestjs-flutterwave';

@Module({
  imports: [
    FlutterwaveModule.forRoot({
      version: 'v4',
      environment: 'sandbox', // or 'production'
      clientId: process.env.FLW_CLIENT_ID,
      clientSecret: process.env.FLW_CLIENT_SECRET,
      idempotencyKeyFactory: () => randomUUID().replace(/-/g, ''),
    }),
  ],
})
export class AppModule {}
```

### 2. Use in Your Service

```typescript
import { Injectable } from '@nestjs/common';
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
      customer: {
        email,
        name: 'John Doe',
        phone_number: '+2348012345678',
      },
      customizations: {
        title: 'My App Payment',
        description: 'Payment for services',
        logo: 'https://yourapp.com/logo.png',
      },
    });

    return payment;
  }

  async verifyPayment(txRef: string) {
    const verification = await this.flutterwave.payments.verifyPayment({
      tx_ref: txRef,
    });

    return verification;
  }
}
```

## Configuration Options

```typescript
interface FlutterwaveModuleOptions {
  secretKey?: string;          // v3: secret key, v4: optional pre-fetched access token
  publicKey?: string;          // Optional: Your Flutterwave public key
  baseUrl?: string;            // Optional: Custom API base URL
  version?: 'v3' | 'v4';      // Optional: API version (default: 'v3')
  environment?: 'sandbox' | 'production'; // v4 base URL selector
  clientId?: string;           // v4 OAuth client_id
  clientSecret?: string;       // v4 OAuth client_secret
  oauthTokenUrl?: string;      // Optional custom OAuth token URL
  oauthTokenRefreshBufferSeconds?: number; // Refresh before expiry (default: 60s)
  enforceV4IdempotencyKey?: boolean; // Throw if no idempotency factory is provided
  idempotencyKeyFactory?: () => string; // Generate POST idempotency keys in v4 mode
  defaultTraceId?: string;     // Optional X-Trace-Id for v4 requests
  defaultScenarioKey?: string; // Optional X-Scenario-Key for v4 test scenarios
  timeout?: number;            // Optional: Request timeout in ms (default: 30000)
  retries?: number;            // Optional: Number of retries (default: 3)
  retryDelay?: number;         // Optional: Retry delay in ms (default: 1000)
  maxRetryDelay?: number;      // Optional: Max retry delay in ms (default: 10000)
  shouldRetry?: (error: any) => boolean; // Optional: Custom retry logic
}
```

### v4 OAuth + Header Behavior

When `version: 'v4'` is enabled, the module follows Flutterwave v4 docs:

- Auth uses OAuth client credentials (`clientId` + `clientSecret`) and auto-refreshes tokens.
- `X-Idempotency-Key` is sent automatically for `POST` requests.
- Optional `X-Trace-Id` and `X-Scenario-Key` can be set globally via config.

```typescript
FlutterwaveModule.forRoot({
  version: 'v4',
  environment: 'sandbox',
  clientId: process.env.FLW_CLIENT_ID,
  clientSecret: process.env.FLW_CLIENT_SECRET,
  idempotencyKeyFactory: () => crypto.randomUUID().replace(/-/g, ''),
});
```

### Migration Notes (v3 -> v4)

- Use `clientId`/`clientSecret` instead of long-lived secret-key auth.
- `charges` in v4 mode sends `type` in request body (not query-string routing).
- Payment verification methods use v4 retrieval routes where applicable.
- Transfer service now includes v4 helpers: `initiateDirectTransfer`, `createTransferRecipient`, and `createTransferSender`.

### v3 Deprecation Path

If you plan to retire v3 once v4 is GA, this rollout keeps consumers stable:

1. Introduce `version` from app config (default to `v3` initially).
2. Add v4 credentials (`FLW_CLIENT_ID`, `FLW_CLIENT_SECRET`) and idempotency key generation.
3. Migrate payment/charge integrations first, then transfer flows.
4. Run dual-environment testing in sandbox before production cutover.
5. Switch default to `v4`, keep `v3` behind an explicit override for a short grace period.
6. Announce v3 removal date in release notes, then remove `v3` mode in the next major version.

### Planned Breaking Changes (v3 Removal)

When v3 support is removed in a future major version, expect these breaking changes:

- `version: 'v3'` will no longer be accepted.
- `secretKey` will no longer be the primary auth path for v4; use `clientId` and `clientSecret`.
- v3-only endpoint behavior will be dropped (for example, `/payments` and v3 verify-by-reference patterns).
- Legacy charge request shapes that rely on v3 semantics should be migrated to v4 charge payloads.
- Integrations should rely on v4 idempotency behavior for all `POST` requests.

Recommended pre-upgrade checklist:

1. Replace all `version: 'v3'` config with `version: 'v4'`.
2. Add and validate `FLW_CLIENT_ID` and `FLW_CLIENT_SECRET` in each environment.
3. Add an `idempotencyKeyFactory` to your module configuration.
4. Update payment verification calls to use v4-friendly retrieval (`charge_id`/reference flow).
5. Re-test transfer flows using v4 transfer helpers where needed.
6. Roll out behind a feature flag before removing v3 fallback.

## Async Configuration

```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FlutterwaveModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.get('FLUTTERWAVE_SECRET_KEY'),
        publicKey: configService.get('FLUTTERWAVE_PUBLIC_KEY'),
        version: configService.get('FLUTTERWAVE_API_VERSION', 'v3'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Async Configuration (v4)

```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
    FlutterwaveModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        version: 'v4',
        environment: configService.get<'sandbox' | 'production'>('FLW_ENV', 'sandbox'),
        clientId: configService.get('FLW_CLIENT_ID'),
        clientSecret: configService.get('FLW_CLIENT_SECRET'),
        idempotencyKeyFactory: () => randomUUID().replace(/-/g, ''),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## v3 vs v4 Usage Notes

- `v3 auth`: Use `secretKey`.
- `v4 auth`: Use `clientId` + `clientSecret` (or pass a pre-fetched token via `secretKey`).
- `v3 payments`: Uses `/payments` and v3 verification routes.
- `v4 payments`: Uses `/charges` retrieval and reference-based transaction lookup.
- `v4 headers`: Adds `X-Idempotency-Key` automatically on `POST` requests.
- `v4 transfers`: Use `initiateDirectTransfer`, `createTransferRecipient`, and `createTransferSender` for new transfer flows.

## Available Services

### Payment Service
```typescript
// v3 style (hosted payments endpoint)
const paymentV3 = await this.flutterwave.payments.initializePayment({
  tx_ref: `TX_${Date.now()}`,
  amount: 1000,
  currency: 'NGN',
  redirect_url: 'https://yourapp.com/callback',
  customer: {
    email: 'john@example.com',
    name: 'John Doe',
    phone_number: '+2348012345678',
  },
});

// v4 style (charge-style initialization)
const paymentV4 = await this.flutterwave.payments.initializePayment({
  reference: `REF_${Date.now()}`,
  amount: 1000,
  currency: 'NGN',
  customer_id: 'cus_xxx',
  payment_method_id: 'pmd_xxx',
  redirect_url: 'https://yourapp.com/callback',
});

// Initialize payment
const payment = await this.flutterwave.payments.initializePayment(paymentData);

// Verify payment (v3 by tx_ref)
const verification = await this.flutterwave.payments.verifyPayment({
  tx_ref: 'TX_REF_123',
});

// Verify/retrieve payment (v4 by charge_id)
const verificationV4 = await this.flutterwave.payments.verifyPayment({
  charge_id: 'chg_xxx',
});

// Get payment by reference (v3: verify_by_reference, v4: transactions?reference=)
const paymentDetails = await this.flutterwave.payments.getPaymentByReference('TX_REF_123');
```

### Transaction Service
```typescript
// Get all transactions
const transactions = await this.flutterwave.transactions.getTransactions({
  page: 1,
  per_page: 10,
  from: '2024-01-01',
  to: '2024-12-31',
});

// Get specific transaction
const transaction = await this.flutterwave.transactions.getTransaction(123);

// Get transaction fees
const fees = await this.flutterwave.transactions.getTransactionFees(1000, 'NGN');
```

### Customer Service
```typescript
// Create customer
const customer = await this.flutterwave.customers.createCustomer({
  email: 'john@example.com',
  phone_number: '+2348012345678',
  name: 'John Doe',
});

// Get customers
const customers = await this.flutterwave.customers.getCustomers({
  page: 1,
  per_page: 20,
});

// Update customer
const updatedCustomer = await this.flutterwave.customers.updateCustomer(123, {
  name: 'John Smith',
});
```

### Bank Service
```typescript
// Get all banks
const banks = await this.flutterwave.banks.getBanks('NG');

// Get bank branches
const branches = await this.flutterwave.banks.getBankBranches(123);

// Validate bank account
const account = await this.flutterwave.banks.validateBankAccount(
  '1234567890',
  '044'
);
```

### Transfer Service
```typescript
// Initiate transfer
const transfer = await this.flutterwave.transfers.initiateTransfer({
  account_bank: '044',
  account_number: '0690000032',
  amount: 500,
  narration: 'Transfer to John',
  currency: 'NGN',
  reference: 'REF_123',
  callback_url: 'https://yourapp.com/callback',
});

// Get transfers
const transfers = await this.flutterwave.transfers.getTransfers();

// Get transfer fees
const fees = await this.flutterwave.transfers.getTransferFees(1000, 'NGN');
```

### Virtual Account Service
```typescript
// Create virtual account
const virtualAccount = await this.flutterwave.virtualAccounts.createVirtualAccount({
  email: 'john@example.com',
  is_permanent: true,
  bvn: '12345678901',
  tx_ref: 'TX_REF_123',
  phone_number: '+2348012345678',
  firstname: 'John',
  lastname: 'Doe',
  narration: 'Virtual account for John',
});

// Get virtual accounts
const virtualAccounts = await this.flutterwave.virtualAccounts.getVirtualAccounts();

// Deactivate virtual account
await this.flutterwave.virtualAccounts.deactivateVirtualAccount(123);
```

### Subscription Service
```typescript
// Create subscription
const subscription = await this.flutterwave.subscriptions.createSubscription({
  amount: 1000,
  currency: 'NGN',
  plan: 123,
  email: 'john@example.com',
  tx_ref: 'TX_REF_123',
});

// Get subscriptions
const subscriptions = await this.flutterwave.subscriptions.getSubscriptions();

// Cancel subscription
await this.flutterwave.subscriptions.cancelSubscription(123);
```

### Plan Service
```typescript
// Create payment plan
const plan = await this.flutterwave.plans.createPlan({
  amount: 1000,
  name: 'Monthly Plan',
  interval: 'monthly',
  duration: 12,
});

// Get plans
const plans = await this.flutterwave.plans.getPlans();

// Update plan
const updatedPlan = await this.flutterwave.plans.updatePlan(123, {
  name: 'Updated Plan Name',
});
```

### Refund Service
```typescript
// Create refund
const refund = await this.flutterwave.refunds.createRefund({
  amount: 500,
  tx_ref: 'TX_REF_123',
  flw_ref: 'FLW_REF_123',
});

// Get refunds
const refunds = await this.flutterwave.refunds.getRefunds();

// Get specific refund
const refundDetails = await this.flutterwave.refunds.getRefund(123);
```

### Settlement Service
```typescript
// Get settlements
const settlements = await this.flutterwave.settlements.getSettlements({
  from: '2024-01-01',
  to: '2024-12-31',
});

// Get specific settlement
const settlement = await this.flutterwave.settlements.getSettlement(123);
```

### Split Service
```typescript
// Create split
const split = await this.flutterwave.splits.createSplit({
  name: 'Revenue Split',
  type: 'percentage',
  currency: 'NGN',
  subaccounts: [
    {
      id: 123,
      transaction_split_ratio: 60,
    },
    {
      id: 456,
      transaction_split_ratio: 40,
    },
  ],
});

// Get splits
const splits = await this.flutterwave.splits.getSplits();

// Update split
const updatedSplit = await this.flutterwave.splits.updateSplit(123, {
  name: 'Updated Split Name',
});
```

### Verification Service
```typescript
// Verify card BIN
const cardInfo = await this.flutterwave.verifications.verifyCardBin('123456');

// Verify bank account
const accountInfo = await this.flutterwave.verifications.verifyAccountNumber(
  '1234567890',
  '044'
);
```

### Balance Service
```typescript
// Get balance
const balance = await this.flutterwave.balances.getBalance();
```

### BVN Service
```typescript
// Verify BVN
const bvnInfo = await this.flutterwave.bvn.verifyBvn('12345678901');

// Verify BVN with image
const bvnWithImage = await this.flutterwave.bvn.verifyBvnWithImage(
  '12345678901',
  'base64_image_string'
);
```

### OTP Service
```typescript
// Create OTP
const otp = await this.flutterwave.otp.createOtp({
  length: 6,
  customer: {
    email: 'john@example.com',
    phone: '+2348012345678',
    name: 'John Doe',
  },
  sender: 'Flutterwave',
  send: true,
});

// Validate OTP
const validation = await this.flutterwave.otp.validateOtp('REF_123', '123456');
```

### Charge Service
```typescript
// v3 payload shape (legacy)
// Charge card
const cardCharge = await this.flutterwave.charges.chargeCard({
  amount: 1000,
  currency: 'NGN',
  tx_ref: 'TX_REF_123',
  card_number: '1234567890123456',
  cvv: '123',
  expiry_month: '12',
  expiry_year: '25',
  email: 'john@example.com',
  phone_number: '+2348012345678',
  fullname: 'John Doe',
});

// v4 payload shape (recommended): use `reference` and typed charge body
const cardChargeV4 = await this.flutterwave.charges.chargeCard({
  reference: 'REF_123',
  amount: 1000,
  currency: 'NGN',
  customer_id: 'cus_xxx',
  payment_method_id: 'pmd_xxx',
});

// Charge bank account
const bankCharge = await this.flutterwave.charges.chargeBank({
  amount: 1000,
  currency: 'NGN',
  tx_ref: 'TX_REF_123',
  email: 'john@example.com',
  phone_number: '+2348012345678',
  fullname: 'John Doe',
  account_bank: '044',
  account_number: '1234567890',
});

// Charge mobile money
const mobileMoneyCharge = await this.flutterwave.charges.chargeMobileMoney({
  amount: 1000,
  currency: 'NGN',
  tx_ref: 'TX_REF_123',
  email: 'john@example.com',
  phone_number: '+2348012345678',
  fullname: 'John Doe',
  order_id: 'ORDER_123',
  is_mobile_money_franco: true,
  redirect_url: 'https://yourapp.com/callback',
});

// Charge USSD
const ussdCharge = await this.flutterwave.charges.chargeUSSD({
  amount: 1000,
  currency: 'NGN',
  tx_ref: 'TX_REF_123',
  email: 'john@example.com',
  phone_number: '+2348012345678',
  fullname: 'John Doe',
  order_id: 'ORDER_123',
  redirect_url: 'https://yourapp.com/callback',
});

// Charge QR code
const qrCharge = await this.flutterwave.charges.chargeQRCode({
  amount: 1000,
  currency: 'NGN',
  tx_ref: 'TX_REF_123',
  email: 'john@example.com',
  phone_number: '+2348012345678',
  fullname: 'John Doe',
  order_id: 'ORDER_123',
  redirect_url: 'https://yourapp.com/callback',
});
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

## Development Workflow

### Code Quality

The package includes several tools to maintain code quality:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Run pre-commit checks
npm run pre-commit
```

### Pre-commit Hook

A pre-commit hook is configured to automatically:
- Run ESLint
- Check code formatting
- Run TypeScript type checking
- Run tests (if test files are staged)

This ensures all committed code meets quality standards.

## Versioning and Releases

This package follows [Semantic Versioning](https://semver.org/) and uses conventional commit messages for automated versioning.

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add support for virtual accounts"
git commit -m "fix: resolve payment verification issue"
git commit -m "docs: update API documentation"
git commit -m "test: add comprehensive test coverage"
```

### Version Management

#### Manual Version Bumping

```bash
# Patch version (bug fixes)
npm run version:patch

# Minor version (new features)
npm run version:minor

# Major version (breaking changes)
npm run version:major
```

#### Automatic Version Bumping

The package can automatically determine the next version based on commit messages:

```bash
npm run version:auto
```

This analyzes commits since the last tag and determines whether to bump patch, minor, or major version.

### Changelog Management

Update the changelog automatically:

```bash
npm run changelog:update
```

This generates a changelog entry based on conventional commit messages.

### Release Process

The package includes automated release scripts that handle the entire release process:

#### Quick Release Commands

```bash
# Release patch version
npm run release:patch

# Release minor version
npm run release:minor

# Release major version
npm run release:major

# Auto-release (determines version automatically)
npm run release:auto
```

#### What the Release Script Does

1. **Prerequisites Check**: Verifies git repository and branch
2. **Version Bump**: Updates package.json version
3. **Changelog Update**: Generates changelog entry
4. **Build**: Compiles TypeScript code
5. **Testing**: Runs the test suite
6. **Git Operations**: Commits changes and creates git tag
7. **Summary**: Provides next steps for publishing

#### Manual Release Steps

If you prefer to handle releases manually:

```bash
# 1. Bump version
npm run version:patch  # or minor/major

# 2. Update changelog
npm run changelog:update

# 3. Build package
npm run build

# 4. Run tests
npm test

# 5. Commit changes
git add .
git commit -m "chore: release version X.Y.Z"

# 6. Create tag
git tag -a vX.Y.Z -m "Release version X.Y.Z"

# 7. Push changes and tags
git push origin main
git push origin --tags

# 8. Publish to npm
npm publish
```

### Release Workflow Example

Here's a typical release workflow:

```bash
# 1. Make your changes and commit with conventional messages
git add .
git commit -m "feat: add new payment method support"
git commit -m "fix: resolve webhook handling issue"
git commit -m "docs: update installation guide"

# 2. Run automatic release
npm run release:auto

# 3. Push changes and tags
git push origin main
git push origin --tags

# 4. Publish to npm
npm publish

# 5. Create GitHub release with the generated changelog
```

### Version Bump Rules

- **Patch** (`1.0.0` → `1.0.1`): Bug fixes, documentation updates, minor improvements
- **Minor** (`1.0.0` → `1.1.0`): New features, backward-compatible enhancements
- **Major** (`1.0.0` → `2.0.0`): Breaking changes, major refactoring

### Breaking Changes

When making breaking changes:

1. Use `!` in commit messages: `feat!: breaking change description`
2. Include `BREAKING CHANGE:` in commit body
3. Document migration steps in changelog

Example:
```bash
git commit -m "feat!: change API response format

BREAKING CHANGE: The payment response structure has changed.
Migration: Update response handling to use new format."
```

## Examples

Check out the `examples/` directory for complete working examples of:

- Basic payment integration
- Webhook handling
- Subscription management
- Transfer operations
- Virtual account creation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@scwar.com](mailto:support@scwar.com)
- 🐛 Issues: [GitHub Issues](https://github.com/kellslte/nestjs-flutterwave/issues)
- 📖 Documentation: [Flutterwave API Docs](https://developer.flutterwave.com/)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## Acknowledgments

- [Flutterwave](https://flutterwave.com/) for providing the excellent payment API
- [NestJS](https://nestjs.com/) for the amazing framework
- All contributors who help improve this package
