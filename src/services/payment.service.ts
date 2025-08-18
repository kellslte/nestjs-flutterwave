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
    return this.post<PaymentResponse>('/payments', data);
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    const { tx_ref, flw_ref } = data;
    const endpoint = flw_ref ? `/transactions/${flw_ref}/verify` : `/transactions/verify_by_reference?tx_ref=${tx_ref}`;
    
    return this.get<PaymentVerificationResponse>(endpoint);
  }

  /**
   * Get payment details by transaction reference
   */
  async getPaymentByReference(tx_ref: string): Promise<PaymentVerificationResponse> {
    return this.get<PaymentVerificationResponse>(`/transactions/verify_by_reference?tx_ref=${tx_ref}`);
  }

  /**
   * Get payment details by Flutterwave reference
   */
  async getPaymentByFlwRef(flw_ref: string): Promise<PaymentVerificationResponse> {
    return this.get<PaymentVerificationResponse>(`/transactions/${flw_ref}/verify`);
  }
}
