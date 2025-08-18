export interface PaymentRequest {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    phone_number?: string;
    name?: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  meta?: any;
  payment_options?: string | string[];
  subaccounts?: any[];
  payment_plan?: number;
  callback_url?: string;
  callback_method?: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
  data: {
    link: string;
    status: string;
    message: string;
    reference: string;
  };
}

export interface PaymentVerificationRequest {
  tx_ref?: string;
  flw_ref?: string;
}

export interface PaymentVerificationResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
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
    account_id: number;
    customer: any;
    [key: string]: any;
  };
}
