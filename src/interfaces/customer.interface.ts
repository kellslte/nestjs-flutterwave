export interface Customer {
  id: number;
  customer_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  metadata?: any;
  risk_action: string;
  international_format_phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerRequest {
  email: string;
  phone_number: string;
  name: string;
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
