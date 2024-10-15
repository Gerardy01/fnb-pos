

export interface BaseResponse {
    status : string;
    message : string;
    userMessage : string;
}

export interface FetchResponse<T> extends BaseResponse {
    data : T
}