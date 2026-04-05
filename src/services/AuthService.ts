import api from '@/lib/axios';
import axios from 'axios';

export const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

// Forgot password: save OTP
export const saveForgotPasswordOtp = async (email: string) => {
    const response = await api.post('/forgot-password/save-otp', { email });
    return response.data;
};

// Forgot password: check OTP
export const checkForgotPasswordOtp = async (email: string, otp: string) => {
    const response = await api.post('/forgot-password/check-otp', { email, otp });
    return response.data;
};

// Forgot password: reset password
export const resetForgotPassword = async (email: string, newPassword: string, confirmNewPassword: string) => {
    const response = await api.post('/forgot-password/re-pass', {
        email,
        newPassword,
        confirmNewPassword
    });
    return response.data;
};

// Change password for first login
export const changePasswordFirstLogin = async (oldPassword: string, newPassword: string, confirmNewPassword: string) => {
    const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
        confirmNewPassword
    });
    return response.data;
};

// Refresh token
export interface RefreshTokenRequest {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    isFirstLogin: boolean;
}

export const refreshToken = async ({ accessToken, refreshToken }: RefreshTokenRequest) => {
    const rawAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
        },
    });
    const response = await rawAxios.post('/auth/refresh-token', { accessToken, refreshToken });
    return response.data;
};