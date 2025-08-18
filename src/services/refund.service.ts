import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class RefundService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async createRefund(data: any): Promise<any> {
    return this.post('/refunds', data);
  }

  async getRefunds(params?: any): Promise<any> {
    return this.get('/refunds', params);
  }

  async getRefund(id: number): Promise<any> {
    return this.get(`/refunds/${id}`);
  }
}
