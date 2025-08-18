export interface ChargeRequest {
    amount: number;
    currency: string;
    tx_ref: string;
    email: string;
    phone_number: string;
    fullname: string;
    [key: string]: any;
}

export interface ChargeResponse {
    status: string;
    message: string;
    data: any;
}
