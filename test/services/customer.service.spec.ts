import { CustomerService } from '../../src/services/customer.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('CustomerService', () => {
    let service: CustomerService;
    const mockOptions: FlutterwaveModuleOptions = {
        secretKey: 'test_secret_key',
        publicKey: 'test_public_key',
        version: 'v3',
    };

    beforeEach(() => {
        service = new CustomerService(mockOptions);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createCustomer', () => {
        it('should create customer successfully', async () => {
            const mockCustomerData = {
                email: 'test@example.com',
                phone_number: '+2348012345678',
                name: 'Test User',
                metadata: { source: 'website' },
            };

            const mockResponse = {
                status: 'success',
                message: 'Customer created successfully',
                data: {
                    id: 123,
                    customer_code: 'CUST_123',
                    first_name: 'Test',
                    last_name: 'User',
                    email: 'test@example.com',
                    phone: '+2348012345678',
                    metadata: { source: 'website' },
                    risk_action: 'default',
                    international_format_phone: '+2348012345678',
                    created_at: '2024-01-01T10:00:00Z',
                    updated_at: '2024-01-01T10:00:00Z',
                },
            };

            jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

            const result = await service.createCustomer(mockCustomerData);

            expect(result).toEqual(mockResponse);
            expect(service['post']).toHaveBeenCalledWith('/customers', mockCustomerData);
        });

        it('should handle customer creation errors', async () => {
            const mockCustomerData = {
                email: 'test@example.com',
                phone_number: '+2348012345678',
                name: 'Test User',
            };

            const mockError = new Error('Customer creation failed');
            jest.spyOn(service as any, 'post').mockRejectedValue(mockError);

            await expect(service.createCustomer(mockCustomerData)).rejects.toThrow('Customer creation failed');
        });
    });

    describe('getCustomers', () => {
        it('should get customers without parameters', async () => {
            const mockResponse = {
                status: 'success',
                message: 'Customers retrieved',
                data: [
                    {
                        id: 1,
                        customer_code: 'CUST_001',
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john@example.com',
                        phone: '+2348012345678',
                    },
                    {
                        id: 2,
                        customer_code: 'CUST_002',
                        first_name: 'Jane',
                        last_name: 'Smith',
                        email: 'jane@example.com',
                        phone: '+2348012345679',
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

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getCustomers();

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/customers', undefined);
        });

        it('should get customers with parameters', async () => {
            const params = {
                page: 1,
                per_page: 10,
                from: '2024-01-01',
                to: '2024-12-31',
                customer_email: 'test@example.com',
            };

            const mockResponse = {
                status: 'success',
                message: 'Customers retrieved',
                data: [
                    {
                        id: 1,
                        customer_code: 'CUST_001',
                        first_name: 'Test',
                        last_name: 'User',
                        email: 'test@example.com',
                        phone: '+2348012345678',
                    },
                ],
                meta: {
                    page_info: {
                        total: 1,
                        current_page: 1,
                        total_pages: 1,
                    },
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getCustomers(params);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/customers', params);
        });
    });

    describe('getCustomer', () => {
        it('should get a specific customer by ID', async () => {
            const customerId = 123;
            const mockResponse = {
                id: 123,
                customer_code: 'CUST_123',
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                phone: '+2348012345678',
                metadata: { source: 'website' },
                risk_action: 'default',
                international_format_phone: '+2348012345678',
                created_at: '2024-01-01T10:00:00Z',
                updated_at: '2024-01-01T10:00:00Z',
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getCustomer(customerId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/customers/123');
        });
    });

    describe('updateCustomer', () => {
        it('should update customer successfully', async () => {
            const customerId = 123;
            const updateData = {
                first_name: 'Updated',
                last_name: 'Name',
                email: 'updated@example.com',
                phone: '+2348012345679',
                metadata: { source: 'mobile_app' },
            };

            const mockResponse = {
                id: 123,
                customer_code: 'CUST_123',
                first_name: 'Updated',
                last_name: 'Name',
                email: 'updated@example.com',
                phone: '+2348012345679',
                metadata: { source: 'mobile_app' },
                risk_action: 'default',
                international_format_phone: '+2348012345679',
                created_at: '2024-01-01T10:00:00Z',
                updated_at: '2024-01-01T11:00:00Z',
            };

            jest.spyOn(service as any, 'put').mockResolvedValue(mockResponse);

            const result = await service.updateCustomer(customerId, updateData);

            expect(result).toEqual(mockResponse);
            expect(service['put']).toHaveBeenCalledWith('/customers/123', updateData);
        });
    });

    describe('deleteCustomer', () => {
        it('should delete customer successfully', async () => {
            const customerId = 123;
            const mockResponse = {
                status: 'success',
                message: 'Customer deleted successfully',
            };

            jest.spyOn(service as any, 'delete').mockResolvedValue(mockResponse);

            const result = await service.deleteCustomer(customerId);

            expect(result).toEqual(mockResponse);
            expect(service['delete']).toHaveBeenCalledWith('/customers/123');
        });
    });

    describe('getCustomerTransactions', () => {
        it('should get customer transactions without parameters', async () => {
            const customerId = 123;
            const mockResponse = {
                status: 'success',
                message: 'Customer transactions retrieved',
                data: [
                    {
                        id: 1,
                        tx_ref: 'TX_001',
                        amount: 1000,
                        currency: 'NGN',
                        status: 'successful',
                    },
                ],
                meta: {
                    page_info: {
                        total: 1,
                        current_page: 1,
                        total_pages: 1,
                    },
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getCustomerTransactions(customerId);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/customers/123/transactions', undefined);
        });

        it('should get customer transactions with parameters', async () => {
            const customerId = 123;
            const params = {
                page: 1,
                per_page: 10,
                from: '2024-01-01',
                to: '2024-12-31',
                status: 'successful',
            };

            const mockResponse = {
                status: 'success',
                message: 'Customer transactions retrieved',
                data: [
                    {
                        id: 1,
                        tx_ref: 'TX_001',
                        amount: 1000,
                        currency: 'NGN',
                        status: 'successful',
                    },
                ],
                meta: {
                    page_info: {
                        total: 1,
                        current_page: 1,
                        total_pages: 1,
                    },
                },
            };

            jest.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

            const result = await service.getCustomerTransactions(customerId, params);

            expect(result).toEqual(mockResponse);
            expect(service['get']).toHaveBeenCalledWith('/customers/123/transactions', params);
        });
    });
});
