import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class TransferService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  /**
   * Initiate a transfer
   */
  async initiateTransfer(data: any): Promise<any> {
    return this.post('/transfers', data);
  }

  /**
   * Get all transfers
   */
  async getTransfers(params?: any): Promise<any> {
    return this.get('/transfers', params);
  }

  /**
   * Get a specific transfer
   */
  async getTransfer(id: number): Promise<any> {
    return this.get(`/transfers/${id}`);
  }

  /**
   * Get transfer fees
   */
  async getTransferFees(amount: number, currency: string = 'NGN'): Promise<any> {
    return this.get('/transfers/fee', { amount, currency });
  }
}
