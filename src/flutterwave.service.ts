import { Injectable, Inject } from '@nestjs/common';
import { FLUTTERWAVE_MODULE_OPTIONS } from './constants';
import { FlutterwaveModuleOptions } from './interfaces';
import { BaseService } from './base.service';
import { PaymentService } from './services/payment.service';
import { TransactionService } from './services/transaction.service';
import { CustomerService } from './services/customer.service';
import { BankService } from './services/bank.service';
import { TransferService } from './services/transfer.service';
import { VirtualAccountService } from './services/virtual-account.service';
import { SubscriptionService } from './services/subscription.service';
import { PlanService } from './services/plan.service';
import { RefundService } from './services/refund.service';
import { SettlementService } from './services/settlement.service';
import { SplitService } from './services/split.service';
import { VerificationService } from './services/verification.service';
import { BalanceService } from './services/balance.service';
import { BvnService } from './services/bvn.service';
import { OtpService } from './services/otp.service';
import { ChargeService } from './services/charge.service';

@Injectable()
export class FlutterwaveService extends BaseService {
  public readonly payments: PaymentService;
  public readonly transactions: TransactionService;
  public readonly customers: CustomerService;
  public readonly banks: BankService;
  public readonly transfers: TransferService;
  public readonly virtualAccounts: VirtualAccountService;
  public readonly subscriptions: SubscriptionService;
  public readonly plans: PlanService;
  public readonly refunds: RefundService;
  public readonly settlements: SettlementService;
  public readonly splits: SplitService;
  public readonly verifications: VerificationService;
  public readonly balances: BalanceService;
  public readonly bvn: BvnService;
  public readonly otp: OtpService;
  public readonly charges: ChargeService;

  constructor(@Inject(FLUTTERWAVE_MODULE_OPTIONS) options: FlutterwaveModuleOptions) {
    super(options);
    
    // Initialize all service instances
    this.payments = new PaymentService(options);
    this.transactions = new TransactionService(options);
    this.customers = new CustomerService(options);
    this.banks = new BankService(options);
    this.transfers = new TransferService(options);
    this.virtualAccounts = new VirtualAccountService(options);
    this.subscriptions = new SubscriptionService(options);
    this.plans = new PlanService(options);
    this.refunds = new RefundService(options);
    this.settlements = new SettlementService(options);
    this.splits = new SplitService(options);
    this.verifications = new VerificationService(options);
    this.balances = new BalanceService(options);
    this.bvn = new BvnService(options);
    this.otp = new OtpService(options);
    this.charges = new ChargeService(options);
  }

  /**
   * Get the current API configuration
   */
  getConfig(): FlutterwaveModuleOptions {
    return this.options;
  }

  /**
   * Check if the service is configured for a specific API version
   */
  isVersion(version: 'v3' | 'v4'): boolean {
    return this.options.version === version;
  }
}
