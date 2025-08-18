import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class SettlementService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async getSettlements(params?: any): Promise<any> {
    return this.get('/settlements', params);
  }

  async getSettlement(id: number): Promise<any> {
    return this.get(`/settlements/${id}`);
  }
}
