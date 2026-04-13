export interface ChargeRequest {
    amount: number;
    currency: string;
    tx_ref?: string;
    reference?: string;
    email?: string;
    phone_number?: string;
    fullname?: string;
    customer_id?: string;
    payment_method_id?: string;
    type?: 'card' | 'bank' | 'mobile_money' | 'ussd' | 'qr';
    [key: string]: unknown;
}

export interface ChargeResponse {
    status: string;
    message: string;
    data: {
        id?: number | string;
        tx_ref?: string;
        reference?: string;
        status?: string;
        amount?: number;
        currency?: string;
        customer?: string | Record<string, unknown>;
        payment_method?: Record<string, unknown>;
        next_action?: Record<string, unknown>;
        [key: string]: unknown;
    };
}
