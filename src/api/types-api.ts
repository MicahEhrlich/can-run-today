import { RawAxiosRequestHeaders } from "axios";

type T = Record<string, unknown>;

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: T;
}

export interface ApiRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data: Record<string, unknown>;
    headers?: RawAxiosRequestHeaders | undefined;
}