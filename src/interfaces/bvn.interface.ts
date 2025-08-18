export interface BvnRequest {
    bvn: string;
    image?: string;
}

export interface BvnResponse {
    status: string;
    message: string;
    data: any;
}
