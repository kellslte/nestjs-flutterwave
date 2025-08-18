export interface PlanRequest {
    amount: number;
    name: string;
    interval: string;
    duration: number;
}

export interface PlanResponse {
    status: string;
    message: string;
    data: any;
}
