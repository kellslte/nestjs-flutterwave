import {
  PaymentRequest,
  PaymentResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from '../../src/interfaces';

describe('Payment Interfaces', () => {
  describe('PaymentRequest', () => {
    it('should have required properties with correct types', () => {
      const paymentRequest: PaymentRequest = {
        tx_ref: 'TX_REF_123',
        amount: 1000,
        currency: 'NGN',
        redirect_url: 'https://example.com/callback',
        customer: {
          email: 'test@example.com',
          name: 'John Doe',
        },
      };

      expect(paymentRequest.tx_ref).toBe('TX_REF_123');
      expect(paymentRequest.amount).toBe(1000);
      expect(paymentRequest.currency).toBe('NGN');
      expect(paymentRequest.redirect_url).toBe('https://example.com/callback');
      expect(paymentRequest.customer.email).toBe('test@example.com');
      expect(paymentRequest.customer.name).toBe('John Doe');
    });

    it('should support optional properties', () => {
      const paymentRequest: PaymentRequest = {
        tx_ref: 'TX_REF_123',
        amount: 1000,
        currency: 'NGN',
        redirect_url: 'https://example.com/callback',
        customer: {
          email: 'test@example.com',
          name: 'John Doe',
        },
        meta: { source: 'website' },
        customizations: {
          title: 'Payment Page',
          description: 'Payment for services',
          logo: 'https://example.com/logo.png',
        },
        payment_options: ['card', 'bank', 'ussd'],
        subaccounts: [
          {
            id: '123',
            transaction_split_ratio: '0.2',
          },
        ],
      };

      expect(paymentRequest.meta).toEqual({ source: 'website' });
      expect(paymentRequest.customizations?.title).toBe('Payment Page');
      expect(paymentRequest.payment_options).toEqual(['card', 'bank', 'ussd']);
      expect(paymentRequest.subaccounts).toHaveLength(1);
    });
  });

  describe('PaymentResponse', () => {
    it('should have required properties with correct types', () => {
      const paymentResponse: PaymentResponse = {
        status: 'success',
        message: 'Payment initialized',
        data: {
          link: 'https://checkout.flutterwave.com/v3/hosted/pay/123',
          status: 'pending',
          message: 'Payment initialized',
          reference: 'FLW_REF_123',
        },
      };

      expect(paymentResponse.status).toBe('success');
      expect(paymentResponse.message).toBe('Payment initialized');
      expect(paymentResponse.data.link).toBe('https://checkout.flutterwave.com/v3/hosted/pay/123');
      expect(paymentResponse.data.status).toBe('pending');
      expect(paymentResponse.data.reference).toBe('FLW_REF_123');
    });

    it('should support different status values', () => {
      const successResponse: PaymentResponse = {
        status: 'success',
        message: 'Payment successful',
        data: {
          link: 'https://example.com/success',
          status: 'successful',
          message: 'Payment successful',
          reference: 'FLW_REF_123',
        },
      };

      const errorResponse: PaymentResponse = {
        status: 'error',
        message: 'Payment failed',
        data: {
          link: '',
          status: 'failed',
          message: 'Payment failed',
          reference: '',
        },
      };

      expect(successResponse.status).toBe('success');
      expect(errorResponse.status).toBe('error');
    });
  });

  describe('PaymentVerificationRequest', () => {
    it('should support verification by tx_ref only', () => {
      const verificationRequest: PaymentVerificationRequest = {
        tx_ref: 'TX_REF_123',
      };

      expect(verificationRequest.tx_ref).toBe('TX_REF_123');
      expect(verificationRequest.flw_ref).toBeUndefined();
    });

    it('should support verification by flw_ref only', () => {
      const verificationRequest: PaymentVerificationRequest = {
        flw_ref: 'FLW_REF_123',
      };

      expect(verificationRequest.flw_ref).toBe('FLW_REF_123');
      expect(verificationRequest.tx_ref).toBeUndefined();
    });

    it('should support verification by both references', () => {
      const verificationRequest: PaymentVerificationRequest = {
        tx_ref: 'TX_REF_123',
        flw_ref: 'FLW_REF_123',
      };

      expect(verificationRequest.tx_ref).toBe('TX_REF_123');
      expect(verificationRequest.flw_ref).toBe('FLW_REF_123');
    });
  });

  describe('PaymentVerificationResponse', () => {
    it('should have required properties with correct types', () => {
      const verificationResponse: PaymentVerificationResponse = {
        status: 'success',
        message: 'Payment verified',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          flw_ref: 'FLW_REF_123',
          amount: 1000,
          currency: 'NGN',
          charged_amount: 1000,
          app_fee: 50,
          merchant_fee: 0,
          processor_response: 'Approved',
          auth_model: 'AUTH',
          ip: '192.168.1.1',
          narration: 'Payment for services',
          status: 'successful',
          payment_type: 'card',
          created_at: '2024-01-01T10:00:00Z',
          account_id: 456,
          customer: {
            id: 789,
            name: 'John Doe',
            phone_number: '+2348012345678',
            email: 'test@example.com',
            created_at: '2024-01-01T09:00:00Z',
          },
        },
      };

      expect(verificationResponse.status).toBe('success');
      expect(verificationResponse.message).toBe('Payment verified');
      expect(verificationResponse.data.id).toBe(123);
      expect(verificationResponse.data.tx_ref).toBe('TX_REF_123');
      expect(verificationResponse.data.status).toBe('successful');
      expect(verificationResponse.data.customer.name).toBe('John Doe');
    });

    it('should support different payment statuses', () => {
      const successfulPayment: PaymentVerificationResponse = {
        status: 'success',
        message: 'Payment verified',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          flw_ref: 'FLW_REF_123',
          amount: 1000,
          currency: 'NGN',
          charged_amount: 1000,
          app_fee: 50,
          merchant_fee: 0,
          processor_response: 'Approved',
          auth_model: 'AUTH',
          ip: '192.168.1.1',
          narration: 'Payment for services',
          status: 'successful',
          payment_type: 'card',
          created_at: '2024-01-01T10:00:00Z',
          account_id: 456,
          customer: {
            id: 789,
            name: 'John Doe',
            phone_number: '+2348012345678',
            email: 'test@example.com',
            created_at: '2024-01-01T09:00:00Z',
          },
        },
      };

      const pendingPayment: PaymentVerificationResponse = {
        status: 'success',
        message: 'Payment verified',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          flw_ref: 'FLW_REF_123',
          amount: 1000,
          currency: 'NGN',
          charged_amount: 1000,
          app_fee: 50,
          merchant_fee: 0,
          processor_response: 'Pending',
          auth_model: 'AUTH',
          ip: '192.168.1.1',
          narration: 'Payment for services',
          status: 'pending',
          payment_type: 'card',
          created_at: '2024-01-01T10:00:00Z',
          account_id: 456,
          customer: {
            id: 789,
            name: 'John Doe',
            phone_number: '+2348012345678',
            email: 'test@example.com',
            created_at: '2024-01-01T09:00:00Z',
          },
        },
      };

      expect(successfulPayment.data.status).toBe('successful');
      expect(pendingPayment.data.status).toBe('pending');
    });
  });
});
