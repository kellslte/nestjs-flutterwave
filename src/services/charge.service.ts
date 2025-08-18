import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class ChargeService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async chargeCard(data: any): Promise<any> {
    return this.post('/charges?type=card', data);
  }

  async chargeBank(data: any): Promise<any> {
    return this.post('/charges?type=bank', data);
  }

  async chargeMobileMoney(data: any): Promise<any> {
    return this.post('/charges?type=mobile_money', data);
  }

  async chargeUSSD(data: any): Promise<any> {
    return this.post('/charges?type=ussd', data);
  }

  async chargeQRCode(data: any): Promise<any> {
    return this.post('/charges?type=qr', data);
  }
}
