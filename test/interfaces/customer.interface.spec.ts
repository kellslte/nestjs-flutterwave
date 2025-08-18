import {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerListResponse,
  UpdateCustomerRequest,
} from '../../src/interfaces';

describe('Customer Interfaces', () => {
  describe('Customer', () => {
    it('should have required properties with correct types', () => {
      const customer: Customer = {
        id: 123,
        customer_code: 'CUST_123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+2348012345678',
        metadata: { source: 'website' },
        risk_action: 'default',
        international_format_phone: '+2348012345678',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      };

      expect(customer.id).toBe(123);
      expect(customer.customer_code).toBe('CUST_123');
      expect(customer.first_name).toBe('John');
      expect(customer.last_name).toBe('Doe');
      expect(customer.email).toBe('john.doe@example.com');
      expect(customer.phone).toBe('+2348012345678');
      expect(customer.metadata).toEqual({ source: 'website' });
      expect(customer.risk_action).toBe('default');
      expect(customer.international_format_phone).toBe('+2348012345678');
      expect(customer.created_at).toBe('2024-01-01T10:00:00Z');
      expect(customer.updated_at).toBe('2024-01-01T10:00:00Z');
    });

    it('should support optional metadata', () => {
      const customer: Customer = {
        id: 123,
        customer_code: 'CUST_123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+2348012345678',
        risk_action: 'default',
        international_format_phone: '+2348012345678',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      };

      expect(customer.metadata).toBeUndefined();
    });
  });

  describe('CreateCustomerRequest', () => {
    it('should have required properties with correct types', () => {
      const createCustomerRequest: CreateCustomerRequest = {
        email: 'john.doe@example.com',
        phone_number: '+2348012345678',
        name: 'John Doe',
      };

      expect(createCustomerRequest.email).toBe('john.doe@example.com');
      expect(createCustomerRequest.phone_number).toBe('+2348012345678');
      expect(createCustomerRequest.name).toBe('John Doe');
    });

    it('should support optional properties', () => {
      const createCustomerRequest: CreateCustomerRequest = {
        email: 'john.doe@example.com',
        phone_number: '+2348012345678',
        name: 'John Doe',
        metadata: { source: 'website', campaign: 'summer2024' },
      };

      expect(createCustomerRequest.metadata).toEqual({ source: 'website', campaign: 'summer2024' });
    });
  });

  describe('CreateCustomerResponse', () => {
    it('should have required properties with correct types', () => {
      const createCustomerResponse: CreateCustomerResponse = {
        status: 'success',
        message: 'Customer created successfully',
        data: {
          id: 123,
          customer_code: 'CUST_123',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+2348012345678',
          metadata: { source: 'website' },
          risk_action: 'default',
          international_format_phone: '+2348012345678',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z',
        },
      };

      expect(createCustomerResponse.status).toBe('success');
      expect(createCustomerResponse.message).toBe('Customer created successfully');
      expect(createCustomerResponse.data.id).toBe(123);
      expect(createCustomerResponse.data.customer_code).toBe('CUST_123');
      expect(createCustomerResponse.data.email).toBe('john.doe@example.com');
    });

    it('should support different status values', () => {
      const successResponse: CreateCustomerResponse = {
        status: 'success',
        message: 'Customer created successfully',
        data: {
          id: 123,
          customer_code: 'CUST_123',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+2348012345678',
          risk_action: 'default',
          international_format_phone: '+2348012345678',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z',
        },
      };

      const errorResponse: CreateCustomerResponse = {
        status: 'error',
        message: 'Customer creation failed',
        data: null as any,
      };

      expect(successResponse.status).toBe('success');
      expect(errorResponse.status).toBe('error');
    });
  });

  describe('CustomerListResponse', () => {
    it('should have required properties with correct types', () => {
      const customerListResponse: CustomerListResponse = {
        status: 'success',
        message: 'Customers retrieved',
        data: [
          {
            id: 1,
            customer_code: 'CUST_001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '+2348012345678',
            risk_action: 'default',
            international_format_phone: '+2348012345678',
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
          },
          {
            id: 2,
            customer_code: 'CUST_002',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+2348012345679',
            risk_action: 'default',
            international_format_phone: '+2348012345679',
            created_at: '2024-01-01T11:00:00Z',
            updated_at: '2024-01-01T11:00:00Z',
          },
        ],
        meta: {
          page_info: {
            total: 2,
            current_page: 1,
            total_pages: 1,
          },
        },
      };

      expect(customerListResponse.status).toBe('success');
      expect(customerListResponse.message).toBe('Customers retrieved');
      expect(customerListResponse.data).toHaveLength(2);
      expect(customerListResponse.data[0].first_name).toBe('John');
      expect(customerListResponse.data[1].first_name).toBe('Jane');
      expect(customerListResponse.meta.page_info.total).toBe(2);
    });
  });

  describe('UpdateCustomerRequest', () => {
    it('should support partial updates', () => {
      const updateCustomerRequest: UpdateCustomerRequest = {
        first_name: 'Updated',
        last_name: 'Name',
        email: 'updated.email@example.com',
        phone: '+2348012345680',
        metadata: { source: 'mobile_app', updated_at: '2024-01-01' },
      };

      expect(updateCustomerRequest.first_name).toBe('Updated');
      expect(updateCustomerRequest.last_name).toBe('Name');
      expect(updateCustomerRequest.email).toBe('updated.email@example.com');
      expect(updateCustomerRequest.phone).toBe('+2348012345680');
      expect(updateCustomerRequest.metadata).toEqual({ source: 'mobile_app', updated_at: '2024-01-01' });
    });

    it('should allow updating only specific fields', () => {
      const updateCustomerRequest: UpdateCustomerRequest = {
        first_name: 'Updated',
      };

      expect(updateCustomerRequest.first_name).toBe('Updated');
      expect(updateCustomerRequest.last_name).toBeUndefined();
      expect(updateCustomerRequest.email).toBeUndefined();
      expect(updateCustomerRequest.phone).toBeUndefined();
      expect(updateCustomerRequest.metadata).toBeUndefined();
    });
  });
});
