import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class VerificationService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  async verifyCardBin(bin: string): Promise<any> {
    return this.get(`/card-bins/${bin}`);
  }

  async verifyAccountNumber(accountNumber: string, accountBank: string): Promise<any> {
    return this.post('/accounts/resolve', {
      account_number: accountNumber,
      account_bank: accountBank,
    });
  }
}
