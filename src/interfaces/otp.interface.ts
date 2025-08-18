export interface OtpRequest {
    length: number;
    customer: {
        email: string;
        phone: string;
        name: string;
    };
    sender: string;
    send: boolean;
}

export interface OtpResponse {
    status: string;
    message: string;
    data: any;
}

export interface OtpValidationRequest {
    reference: string;
    otp: string;
}
