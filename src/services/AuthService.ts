import axios from '@/lib/axios';

export const login = async (username: string, password: string) => {
    const response = await axios.post('/auth/login', { username, password });
    return response.data;
};

// Forgot password: save OTP
export const saveForgotPasswordOtp = async (email: string) => {
    const response = await axios.post('/forgot-password/save-otp', { email });
    return response.data;
};

// Forgot password: check OTP
export const checkForgotPasswordOtp = async (email: string, otp: string) => {
    const response = await axios.post('/forgot-password/check-otp', { email, otp });
    return response.data;
};

// Forgot password: reset password
export const resetForgotPassword = async (email: string, newPassword: string, confirmNewPassword: string) => {
    const response = await axios.post('/forgot-password/re-pass', {
        email,
        newPassword,
        confirmNewPassword
    });
    return response.data;
};

// Change password for first login
export const changePasswordFirstLogin = async (oldPassword: string, newPassword: string, confirmNewPassword: string) => {
    const response = await axios.post('/auth/change-password', {
        oldPassword,
        newPassword,
        confirmNewPassword
    });
    return response.data;
};