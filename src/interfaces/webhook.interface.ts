export interface WebhookData {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    payment_type: string;
    created_at: string;
    customer: any;
    meta: any;
}

export interface WebhookEvent {
    event: string;
    data: WebhookData;
}
