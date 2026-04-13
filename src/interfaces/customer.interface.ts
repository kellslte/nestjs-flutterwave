export interface Customer {
  id: number | string;
  customer_code?: string;
  first_name?: string;
  last_name?: string;
  name?: {
    first?: string;
    middle?: string;
    last?: string;
  };
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  email: string;
  phone?: string;
  phone_number?: string;
  phone_details?: {
    country_code?: string;
    number?: string;
  };
  metadata?: any;
  risk_action?: string;
  international_format_phone?: string;
  created_at?: string;
  updated_at?: string;
  created_datetime?: string;
}

export interface CreateCustomerRequest {
  email: string;
  phone_number?: string;
  name?:
    | string
    | {
        first?: string;
        middle?: string;
        last?: string;
      };
  phone?: {
    country_code?: string;
    number?: string;
  };
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  metadata?: any;
}

export interface CreateCustomerResponse {
  status: string;
  message: string;
  data: Customer;
}

export interface CustomerListResponse {
  status: string;
  message: string;
  data: Customer[];
  meta: {
    page_info: {
      total: number;
      current_page: number;
      total_pages: number;
    };
  };
}

export interface UpdateCustomerRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  metadata?: any;
}
