export interface SplitRequest {
    name: string;
    type: string;
    currency: string;
    subaccounts: any[];
}

export interface SplitResponse {
    status: string;
    message: string;
    data: any;
}
