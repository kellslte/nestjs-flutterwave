import { BaseService } from '../base.service';
import {
  FlutterwaveModuleOptions,
  TransferFeeResponse,
  TransferListResponse,
  TransferRequest,
  TransferResponse,
  V4TransferRecipientRequest,
  V4TransferSenderRequest,
} from '../interfaces';

export class TransferService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  /**
   * Initiate a transfer
   */
  async initiateTransfer(data: TransferRequest): Promise<TransferResponse> {
    if (this.isV4()) {
      return this.post('/transfers', data);
    }
    return this.post('/transfers', data);
  }

  /**
   * Initiate direct transfer (v4 orchestrator flow)
   */
  async initiateDirectTransfer(data: TransferRequest): Promise<TransferResponse> {
    if (this.isV4()) {
      return this.post('/direct-transfers', data);
    }
    return this.post('/transfers', data);
  }

  /**
   * Create transfer recipient (v4 flow)
   */
  async createTransferRecipient(data: V4TransferRecipientRequest): Promise<{ status: string; message: string; data: unknown }> {
    if (this.isV4()) {
      return this.post('/transfers/recipients', data);
    }
    return this.post('/beneficiaries', data);
  }

  /**
   * Create transfer sender (v4 flow)
   */
  async createTransferSender(data: V4TransferSenderRequest): Promise<{ status: string; message: string; data: unknown }> {
    if (this.isV4()) {
      return this.post('/transfers/senders', data);
    }
    return this.post('/transfers', data);
  }

  /**
   * Get all transfers
   */
  async getTransfers(params?: Record<string, unknown>): Promise<TransferListResponse> {
    return this.get<TransferListResponse>('/transfers', params);
  }

  /**
   * Get a specific transfer
   */
  async getTransfer(id: number | string): Promise<TransferResponse> {
    return this.get<TransferResponse>(`/transfers/${id}`);
  }

  /**
   * Get transfer fees
   */
  async getTransferFees(amount: number, currency: string = 'NGN'): Promise<TransferFeeResponse> {
    return this.get<TransferFeeResponse>('/transfers/fee', { amount, currency });
  }
}
