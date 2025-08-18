export interface VirtualAccountRequest {
    email: string;
    is_permanent: boolean;
    bvn: string;
    tx_ref: string;
    phone_number: string;
    firstname: string;
    lastname: string;
    narration: string;
}

export interface VirtualAccountResponse {
    status: string;
    message: string;
    data: any;
}
