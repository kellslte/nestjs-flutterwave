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

export interface V4TransferRecipientRequest {
    type: string;
    [key: string]: unknown;
}

export interface V4TransferSenderRequest {
    type: string;
    [key: string]: unknown;
}

export interface TransferResponse {
    status: string;
    message: string;
    data: {
        id: number | string;
        account_number?: string;
        bank_code?: string;
        fullname?: string;
        created_at?: string;
        created_datetime?: string;
        currency?: string;
        debit_currency?: string;
        amount?: number;
        fee?: number;
        status?: string;
        reference?: string;
        meta?: unknown;
        narration?: string;
        approver?: unknown;
        complete_message?: string;
        requires_approval?: number;
        is_approved?: number;
        bank_name?: string;
        type?: string;
        action?: string;
        source_currency?: string;
        destination_currency?: string;
        [key: string]: unknown;
    };
}

export interface TransferListResponse {
    status: string;
    message: string;
    data: TransferResponse['data'][];
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
