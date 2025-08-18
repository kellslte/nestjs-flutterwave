import { BaseService } from '../base.service';
import { FlutterwaveModuleOptions } from '../interfaces';
import {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerListResponse,
  UpdateCustomerRequest,
} from '../interfaces';

export class CustomerService extends BaseService {
  constructor(options: FlutterwaveModuleOptions) {
    super(options);
  }

  /**
   * Create a new customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    return this.post<CreateCustomerResponse>('/customers', data);
  }

  /**
   * Get all customers with optional filtering
   */
  async getCustomers(params?: {
    page?: number;
    per_page?: number;
    from?: string;
    to?: string;
    customer_email?: string;
  }): Promise<CustomerListResponse> {
    return this.get<CustomerListResponse>('/customers', params);
  }

  /**
   * Get a specific customer by ID
   */
  async getCustomer(id: number): Promise<Customer> {
    return this.get<Customer>(`/customers/${id}`);
  }

  /**
   * Update a customer
   */
  async updateCustomer(id: number, data: UpdateCustomerRequest): Promise<Customer> {
    return this.put<Customer>(`/customers/${id}`, data);
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(id: number): Promise<any> {
    return this.delete(`/customers/${id}`);
  }

  /**
   * Get customer transactions
   */
  async getCustomerTransactions(customerId: number, params?: {
    page?: number;
    per_page?: number;
    from?: string;
    to?: string;
    status?: string;
  }): Promise<any> {
    return this.get(`/customers/${customerId}/transactions`, params);
  }
}
