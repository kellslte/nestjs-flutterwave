export interface Bank {
    id: number;
    code: string;
    name: string;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface BankListResponse {
    status: string;
    message: string;
    data: Bank[];
}

export interface BankBranch {
    id: number;
    bank_id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
}

export interface BankBranchResponse {
    status: string;
    message: string;
    data: BankBranch[];
}

export interface AccountValidationRequest {
    account_number: string;
    account_bank: string;
}

export interface AccountValidationResponse {
    status: string;
    message: string;
    data: {
        account_number: string;
        account_name: string;
        bank_id: number;
    };
}
