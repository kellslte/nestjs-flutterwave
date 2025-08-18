import { Injectable } from '@nestjs/common';
import { FlutterwaveService } from '@scwar/nestjs-flutterwave';

@Injectable()
export class SubscriptionService {
    constructor(private readonly flutterwave: FlutterwaveService) { }

    async createSubscriptionPlan(name: string, amount: number, interval: string, duration: number) {
        try {
            const plan = await this.flutterwave.plans.createPlan({
                amount,
                name,
                interval, // 'daily', 'weekly', 'monthly', 'yearly'
                duration,
            });

            return {
                success: true,
                planId: plan.data.id,
                plan: plan.data,
            };
        } catch (error) {
            console.error('Failed to create subscription plan:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async createSubscription(planId: number, email: string, amount: number) {
        try {
            const subscription = await this.flutterwave.subscriptions.createSubscription({
                amount,
                currency: 'NGN',
                plan: planId,
                email,
                tx_ref: `SUB_${Date.now()}`,
            });

            return {
                success: true,
                subscriptionId: subscription.data.id,
                subscription: subscription.data,
            };
        } catch (error) {
            console.error('Failed to create subscription:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async cancelSubscription(subscriptionId: number) {
        try {
            await this.flutterwave.subscriptions.cancelSubscription(subscriptionId);

            return {
                success: true,
                message: 'Subscription cancelled successfully',
            };
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getSubscriptionDetails(subscriptionId: number) {
        try {
            const subscription = await this.flutterwave.subscriptions.getSubscription(subscriptionId);

            return {
                success: true,
                subscription: subscription.data,
            };
        } catch (error) {
            console.error('Failed to get subscription details:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
