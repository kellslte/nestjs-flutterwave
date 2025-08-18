export interface SubscriptionRequest {
    amount: number;
    currency: string;
    plan: number;
    email: string;
    tx_ref: string;
}

export interface SubscriptionResponse {
    status: string;
    message: string;
    data: any;
}
