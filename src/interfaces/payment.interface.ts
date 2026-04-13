export interface PaymentRequest {
  reference?: string;
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer_id?: string;
  payment_method_id?: string;
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
    id?: string | number;
    link?: string;
    status: string;
    message?: string;
    reference?: string;
    amount?: number;
    currency?: string;
    customer?: string | object;
    payment_method?: {
      type?: string;
      card?: {
        expiry_month?: number;
        expiry_year?: number;
        first6?: string;
        last4?: string;
        network?: string;
      };
      [key: string]: any;
    };
    next_action?: {
      type?: string;
      url?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export interface PaymentVerificationRequest {
  tx_ref?: string;
  flw_ref?: string;
  charge_id?: string;
}

export interface PaymentVerificationResponse {
  status: string;
  message: string;
  data: {
    id: number;
    reference?: string;
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
    payment_method?: any;
    [key: string]: any;
  };
}
