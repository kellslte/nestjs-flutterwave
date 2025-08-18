import { Customer } from './customer.interface';

export interface Transaction {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  status: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
  account_id: number;
  customer: Customer;
  meta: any;
  amount_settled: number;
  payment_plan: any;
  split: any;
}

export interface TransactionListResponse {
  status: string;
  message: string;
  data: Transaction[];
  meta: {
    page_info: {
      total: number;
      current_page: number;
      total_pages: number;
    };
  };
}

export interface TransactionVerifyResponse {
  status: string;
  message: string;
  data: Transaction;
}
