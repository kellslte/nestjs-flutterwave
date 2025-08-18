import { Module } from '@nestjs/common';
import { FlutterwaveModule } from '@scwar/nestjs-flutterwave';

@Module({
  imports: [
    FlutterwaveModule.forRoot({
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY!,
      version: 'v3',
    }),
  ],
})
export class AppModule {}

// In your service
import { Injectable } from '@nestjs/common';
import { FlutterwaveService } from '@scwar/nestjs-flutterwave';

@Injectable()
export class PaymentService {
  constructor(private readonly flutterwave: FlutterwaveService) {}

  async processPayment(amount: number, email: string, customerName: string) {
    try {
      // Initialize payment
      const payment = await this.flutterwave.payments.initializePayment({
        tx_ref: `TX_${Date.now()}`,
        amount,
        currency: 'NGN',
        redirect_url: 'https://yourapp.com/payment/callback',
        customer: {
          email,
          name: customerName,
          phone_number: '+2348012345678',
        },
        customizations: {
          title: 'My App Payment',
          description: 'Payment for services rendered',
          logo: 'https://yourapp.com/logo.png',
        },
      });

      return {
        success: true,
        paymentUrl: payment.data.link,
        reference: payment.data.reference,
      };
    } catch (error) {
      console.error('Payment initialization failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async verifyPayment(txRef: string) {
    try {
      const verification = await this.flutterwave.payments.verifyPayment({
        tx_ref: txRef,
      });

      if (verification.data.status === 'successful') {
        return {
          success: true,
          transaction: verification.data,
          message: 'Payment verified successfully',
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
          status: verification.data.status,
        };
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
