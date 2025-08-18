import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class PlanService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async createPlan(data: any): Promise<any> {
    return this.post('/payment-plans', data);
  }

  async getPlans(params?: any): Promise<any> {
    return this.get('/payment-plans', params);
  }

  async getPlan(id: number): Promise<any> {
    return this.get(`/payment-plans/${id}`);
  }

  async updatePlan(id: number, data: any): Promise<any> {
    return this.put(`/payment-plans/${id}`, data);
  }

  async deletePlan(id: number): Promise<any> {
    return this.delete(`/payment-plans/${id}`);
  }
}
