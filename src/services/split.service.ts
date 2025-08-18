import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class SplitService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async createSplit(data: any): Promise<any> {
    return this.post('/splits', data);
  }

  async getSplits(params?: any): Promise<any> {
    return this.get('/splits', params);
  }

  async getSplit(id: number): Promise<any> {
    return this.get(`/splits/${id}`);
  }

  async updateSplit(id: number, data: any): Promise<any> {
    return this.put(`/splits/${id}`, data);
  }

  async deleteSplit(id: number): Promise<any> {
    return this.delete(`/splits/${id}`);
  }
}
