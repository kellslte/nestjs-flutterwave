import { BaseService } from '../base.service';
import { ChargeRequest, ChargeResponse, FlutterwaveModuleOptions } from '../interfaces';

export class ChargeService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async chargeCard(data: ChargeRequest): Promise<ChargeResponse> {
    if (this.isV4()) {
      return this.post('/charges', { ...data, type: 'card' });
    }
    return this.post('/charges?type=card', data);
  }

  async chargeBank(data: ChargeRequest): Promise<ChargeResponse> {
    if (this.isV4()) {
      return this.post('/charges', { ...data, type: 'bank' });
    }
    return this.post('/charges?type=bank', data);
  }

  async chargeMobileMoney(data: ChargeRequest): Promise<ChargeResponse> {
    if (this.isV4()) {
      return this.post('/charges', { ...data, type: 'mobile_money' });
    }
    return this.post('/charges?type=mobile_money', data);
  }

  async chargeUSSD(data: ChargeRequest): Promise<ChargeResponse> {
    if (this.isV4()) {
      return this.post('/charges', { ...data, type: 'ussd' });
    }
    return this.post('/charges?type=ussd', data);
  }

  async chargeQRCode(data: ChargeRequest): Promise<ChargeResponse> {
    if (this.isV4()) {
      return this.post('/charges', { ...data, type: 'qr' });
    }
    return this.post('/charges?type=qr', data);
  }
}
