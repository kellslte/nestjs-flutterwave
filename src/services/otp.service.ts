import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class OtpService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async createOtp(data: any): Promise<any> {
    return this.post('/otps', data);
  }

  async validateOtp(reference: string, otp: string): Promise<any> {
    return this.post('/otps/validate', { reference, otp });
  }
}
