export interface CardChargeRequest {
    amount: number;
    currency: string;
    tx_ref: string;
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    email: string;
    phone_number: string;
    fullname: string;
}

export interface CardChargeResponse {
    status: string;
    message: string;
    data: any;
}
