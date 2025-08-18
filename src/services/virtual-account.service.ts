import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class VirtualAccountService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async createVirtualAccount(data: any): Promise<any> {
    return this.post('/virtual-account-numbers', data);
  }

  async getVirtualAccounts(params?: any): Promise<any> {
    return this.get('/virtual-account-numbers', params);
  }

  async getVirtualAccount(id: number): Promise<any> {
    return this.get(`/virtual-account-numbers/${id}`);
  }

  async updateVirtualAccount(id: number, data: any): Promise<any> {
    return this.put(`/virtual-account-numbers/${id}`, data);
  }

  async deactivateVirtualAccount(id: number): Promise<any> {
    return this.delete(`/virtual-account-numbers/${id}`);
  }
}
