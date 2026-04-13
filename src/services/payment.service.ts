import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from '../interfaces';

export class PaymentService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(data: PaymentRequest): Promise<PaymentResponse> {
    if (this.isV4()) {
      return this.post<PaymentResponse>('/charges', data);
    }
    return this.post<PaymentResponse>('/payments', data);
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    const { tx_ref, flw_ref, charge_id } = data;
    if (this.isV4()) {
      if (charge_id || flw_ref) {
        return this.get<PaymentVerificationResponse>(`/charges/${charge_id || flw_ref}`);
      }
      if (tx_ref) {
        return this.get<PaymentVerificationResponse>('/transactions', { reference: tx_ref });
      }
      throw new Error('tx_ref, flw_ref, or charge_id is required to verify a v4 payment');
    }

    const endpoint = flw_ref ? `/transactions/${flw_ref}/verify` : `/transactions/verify_by_reference?tx_ref=${tx_ref}`;
    return this.get<PaymentVerificationResponse>(endpoint);
  }

  /**
   * Get payment details by transaction reference
   */
  async getPaymentByReference(tx_ref: string): Promise<PaymentVerificationResponse> {
    if (this.isV4()) {
      return this.get<PaymentVerificationResponse>('/transactions', { reference: tx_ref });
    }
    return this.get<PaymentVerificationResponse>(`/transactions/verify_by_reference?tx_ref=${tx_ref}`);
  }

  /**
   * Get payment details by Flutterwave reference
   */
  async getPaymentByFlwRef(flw_ref: string): Promise<PaymentVerificationResponse> {
    if (this.isV4()) {
      return this.get<PaymentVerificationResponse>(`/charges/${flw_ref}`);
    }
    return this.get<PaymentVerificationResponse>(`/transactions/${flw_ref}/verify`);
  }
}
