import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class SubscriptionService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async createSubscription(data: any): Promise<any> {
    return this.post('/subscriptions', data);
  }

  async getSubscriptions(params?: any): Promise<any> {
    return this.get('/subscriptions', params);
  }

  async getSubscription(id: number): Promise<any> {
    return this.get(`/subscriptions/${id}`);
  }

  async updateSubscription(id: number, data: any): Promise<any> {
    return this.put(`/subscriptions/${id}`, data);
  }

  async cancelSubscription(id: number): Promise<any> {
    return this.put(`/subscriptions/${id}/cancel`, {});
  }
}
