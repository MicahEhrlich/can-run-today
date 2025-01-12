import axios from "axios"
import { RegisterFields } from "../store/registerStore"
import axiosInstance from "./axiosInstance";
import { UserSettings } from "../store/settingsStore";
import { ApiRequest, ApiResponse } from "./types-api";


const apiRequest = async ({method, url, data}: ApiRequest): Promise<ApiResponse> => {
    try {
        let response;
        if (method === 'GET') {
            response = await axiosInstance.get(url);
        }
        else if (method === 'PUT') {
            response = await axiosInstance.put(url, data);
        }
        else {
            response = await axiosInstance.post(url, data);
        }
        if (response.status === 200) {
            return {
                success: true,
                message: response.data.message || 'Success',
                data: response.data,
            };
        } else {
            console.error(response.data || 'An error occurred');
            return {
                success: false,
                message: response.data.detail || 'An error occurred',
            };
        }
    } catch (error: unknown) {
        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.detail
            } else {
                errorMessage = error.message;
            }
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
};

export const register = async (formFields: RegisterFields): Promise<ApiResponse> => {
    return apiRequest({ method: 'POST', url: '/register', data: formFields });
};

export const requestOTP = async (phoneNumber: string): Promise<ApiResponse> => {
    return apiRequest({ method: 'POST', url: '/request-otp', data: { phone_number: phoneNumber } });
};

export const verifyOTP = async (phoneNumber: string, code: string): Promise<ApiResponse> => {
    return apiRequest({ method: 'POST', url: '/verify-otp', data: { phone_number: phoneNumber, otp: code } });
}

export const login = async (email: string, password: string): Promise<ApiResponse> => { 
    return apiRequest({ method: 'POST', url: '/login', data: { email, password } });
}

export const getUserDetails = async (): Promise<ApiResponse> => {
    return apiRequest({ method: 'GET', url: '/get_user_details', data: {}});
};

export const updateUserDetails = async (userSettings: UserSettings): Promise<ApiResponse> => {
    const updatedUserDetails = { ...userSettings, weekDaysRunning: Number(userSettings.weekDaysRunning?.toString().split(',').join('')) };
    return apiRequest({ method: 'PUT', url: '/update_user_details', data: { ...updatedUserDetails }});
};