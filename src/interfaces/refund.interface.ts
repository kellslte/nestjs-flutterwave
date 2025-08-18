export interface RefundRequest {
    amount: number;
    tx_ref: string;
    flw_ref: string;
}

export interface RefundResponse {
    status: string;
    message: string;
    data: any;
}
