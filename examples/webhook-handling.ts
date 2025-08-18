import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { FlutterwaveService } from '@scwar/nestjs-flutterwave';
import { FlutterwaveError } from '@scwar/nestjs-flutterwave';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly flutterwave: FlutterwaveService) {}

  @Post('flutterwave')
  @HttpCode(HttpStatus.OK)
  async handleFlutterwaveWebhook(
    @Body() webhookData: any,
    @Headers('verif-hash') verificationHash: string,
  ) {
    try {
      // Verify webhook signature (you should implement this)
      if (!this.verifyWebhookSignature(webhookData, verificationHash)) {
        throw new Error('Invalid webhook signature');
      }

      const { event, data } = webhookData;

      switch (event) {
        case 'charge.completed':
          await this.handlePaymentSuccess(data);
          break;

        case 'transfer.completed':
          await this.handleTransferSuccess(data);
          break;

        case 'subscription.activated':
          await this.handleSubscriptionActivated(data);
          break;

        case 'subscription.deactivated':
          await this.handleSubscriptionDeactivated(data);
          break;

        case 'refund.processed':
          await this.handleRefundProcessed(data);
          break;

        default:
          console.log(`Unhandled webhook event: ${event}`);
      }

      return { status: 'success', message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      
      if (error instanceof FlutterwaveError) {
        console.error('Flutterwave Error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          data: error.data,
        });
      }

      return { status: 'error', message: error.message };
    }
  }

  private async handlePaymentSuccess(data: any) {
    console.log('Payment successful:', {
      transactionId: data.id,
      reference: data.tx_ref,
      amount: data.amount,
      currency: data.currency,
      customerEmail: data.customer?.email,
    });

    // Update your database
    // Send confirmation email
    // Update order status
    // etc.
  }

  private async handleTransferSuccess(data: any) {
    console.log('Transfer successful:', {
      transferId: data.id,
      reference: data.reference,
      amount: data.amount,
      currency: data.currency,
      recipient: data.recipient,
    });

    // Update transfer status in your database
    // Send notification to recipient
    // etc.
  }

  private async handleSubscriptionActivated(data: any) {
    console.log('Subscription activated:', {
      subscriptionId: data.id,
      planId: data.plan,
      customerEmail: data.customer?.email,
      nextPaymentDate: data.next_payment_date,
    });

    // Activate subscription in your system
    // Grant access to premium features
    // etc.
  }

  private async handleSubscriptionDeactivated(data: any) {
    console.log('Subscription deactivated:', {
      subscriptionId: data.id,
      reason: data.reason,
      customerEmail: data.customer?.email,
    });

    // Deactivate subscription in your system
    // Revoke access to premium features
    // etc.
  }

  private async handleRefundProcessed(data: any) {
    console.log('Refund processed:', {
      refundId: data.id,
      transactionId: data.flw_ref,
      amount: data.amount,
      reason: data.reason,
    });

    // Update refund status in your database
    // Process refund in your system
    // etc.
  }

  private verifyWebhookSignature(webhookData: any, verificationHash: string): boolean {
    // Implement webhook signature verification
    // This is a simplified example - you should implement proper verification
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    
    if (!secretHash || !verificationHash) {
      return false;
    }

    // In a real implementation, you would:
    // 1. Hash the webhook data with your secret hash
    // 2. Compare it with the verification hash
    // 3. Return true if they match
    
    return true; // Placeholder
  }
}
