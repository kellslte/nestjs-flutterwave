import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';

export class BankService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  /**
   * Get all banks
   */
  async getBanks(country: string = 'NG'): Promise<any> {
    return this.get('/banks', { country });
  }

  /**
   * Get bank branches
   */
  async getBankBranches(bankId: number): Promise<any> {
    return this.get(`/banks/${bankId}/branches`);
  }

  /**
   * Validate bank account
   */
  async validateBankAccount(accountNumber: string, accountBank: string): Promise<any> {
    return this.post('/accounts/resolve', { account_number: accountNumber, account_bank: accountBank });
  }
}
