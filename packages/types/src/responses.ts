export interface ApiSuccessResponse<T> {
    data: T;
    status: 'success';
}

export interface ApiErrorResponse {
    status: 'error';
    message: string;
    code?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse; 