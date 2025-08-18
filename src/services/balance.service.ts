import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class BalanceService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async getBalance(): Promise<any> {
    return this.get('/balance');
  }
}
