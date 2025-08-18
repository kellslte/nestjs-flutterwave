import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class BvnService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async verifyBvn(bvn: string): Promise<any> {
    return this.post('/kyc/bvn', { bvn });
  }

  async verifyBvnWithImage(bvn: string, image: string): Promise<any> {
    return this.post('/kyc/bvn', { bvn, image });
  }
}
