export interface TransferRequest {
    account_bank: string;
    account_number: string;
    amount: number;
    narration: string;
    currency: string;
    reference: string;
    callback_url?: string;
    debit_currency?: string;
}

export interface TransferResponse {
    status: string;
    message: string;
    data: {
        id: number;
        account_number: string;
        bank_code: string;
        fullname: string;
        created_at: string;
        currency: string;
        debit_currency: string;
        amount: number;
        fee: number;
        status: string;
        reference: string;
        meta: any;
        narration: string;
        approver: any;
        complete_message: string;
        requires_approval: number;
        is_approved: number;
        bank_name: string;
    };
}

export interface TransferListResponse {
    status: string;
    message: string;
    data: any[];
    meta: {
        page_info: {
            total: number;
            current_page: number;
            total_pages: number;
        };
    };
}

export interface TransferFeeResponse {
    status: string;
    message: string;
    data: {
        fee: number;
        currency: string;
    };
}
