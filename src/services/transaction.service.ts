import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';
import {
  Transaction,
  TransactionListResponse,
  TransactionVerifyResponse,
} from '../interfaces';

export class TransactionService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  /**
   * Get all transactions with optional filtering
   */
  async getTransactions(params?: {
    page?: number;
    per_page?: number;
    from?: string;
    to?: string;
    status?: string;
    customer_email?: string;
    tx_ref?: string;
  }): Promise<TransactionListResponse> {
    return this.get<TransactionListResponse>('/transactions', params);
  }

  /**
   * Get a specific transaction by ID
   */
  async getTransaction(id: number | string): Promise<TransactionVerifyResponse> {
    return this.get<TransactionVerifyResponse>(`/transactions/${id}`);
  }

  /**
   * Verify or retrieve a charge by id/reference in v4.
   */
  async getCharge(chargeId: string): Promise<TransactionVerifyResponse> {
    if (this.isV4()) {
      return this.get<TransactionVerifyResponse>(`/charges/${chargeId}`);
    }
    return this.get<TransactionVerifyResponse>(`/transactions/${chargeId}/verify`);
  }

  /**
   * Verify a transaction by reference.
   */
  async verifyByReference(reference: string): Promise<TransactionVerifyResponse> {
    if (this.isV4()) {
      return this.get<TransactionVerifyResponse>('/transactions', { reference });
    }
    return this.get<TransactionVerifyResponse>(`/transactions/verify_by_reference?tx_ref=${reference}`);
  }

  /**
   * Get transaction fees
   */
  async getTransactionFees(amount: number, currency: string = 'NGN'): Promise<any> {
    return this.get('/transactions/fee', { amount, currency });
  }

  /**
   * Get transaction timeline
   */
  async getTransactionTimeline(id: number): Promise<any> {
    return this.get(`/transactions/${id}/timeline`);
  }

  /**
   * Get transaction events
   */
  async getTransactionEvents(id: number): Promise<any> {
    return this.get(`/transactions/${id}/events`);
  }
}
