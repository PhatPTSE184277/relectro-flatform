import React, { useState } from 'react';
import { X, Mail, Lock, Key } from 'lucide-react';
import { saveForgotPasswordOtp, checkForgotPasswordOtp, resetForgotPassword } from '@/services/AuthService';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

interface ForgotPasswordModalProps {
    open: boolean;
    onClose: () => void;
}

type Step = 'email' | 'otp' | 'password';

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose }) => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleReset = () => {
        setStep('email');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleSendOtp = async () => {
        if (!email) {
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return;
        }

        setLoading(true);
        try {
            await saveForgotPasswordOtp(email);
            setStep('otp');
        } catch (error: any) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            return;
        }

        setLoading(true);
        try {
            await checkForgotPasswordOtp(email, otp);
            setStep('password');
        } catch (error: any) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            return;
        }

        if (newPassword.length < 6) {
            return;
        }

        if (newPassword !== confirmPassword) {
            return;
        }

        setLoading(true);
        try {
            await resetForgotPassword(email, newPassword, confirmPassword);
            handleClose();
        } catch (error: any) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div 
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
            onClick={handleClose}
        >
            <div 
                className='bg-white rounded-2xl shadow-2xl max-w-md w-full'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-200'>
                    <h2 className='text-2xl font-bold text-gray-900'>Quên mật khẩu</h2>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-gray-600 transition cursor-pointer'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className='p-6'>
                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <div className='space-y-4'>
                            <p className='text-gray-600 text-sm'>
                                Nhập email của bạn để nhận mã OTP khôi phục mật khẩu
                            </p>
                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Email
                                </label>
                                <div className='relative'>
                                    <Mail className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                                    <input
                                        id='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Nhập email của bạn'
                                        className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className='w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                            </button>
                        </div>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <div className='space-y-4'>
                            <p className='text-gray-600 text-sm'>
                                Mã OTP đã được gửi đến email <strong>{email}</strong>
                            </p>
                            <div>
                                <label htmlFor='otp' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Mã OTP
                                </label>
                                <div className='relative'>
                                    <Key className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                                    <input
                                        id='otp'
                                        type='text'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder='Nhập mã OTP'
                                        className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                                    />
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => setStep('email')}
                                    className='flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer'
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className='flex-1 bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: New Password */}
                    {step === 'password' && (
                        <div className='space-y-4'>
                            <p className='text-gray-600 text-sm'>
                                Nhập mật khẩu mới của bạn
                            </p>
                            <div>
                                <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Mật khẩu mới
                                </label>
                                <div className='relative'>
                                    <Lock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                                    <input
                                        id='newPassword'
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='Nhập mật khẩu mới'
                                        className='w-full pl-10 pr-10 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition cursor-pointer'
                                    >
                                        {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Xác nhận mật khẩu
                                </label>
                                <div className='relative'>
                                    <Lock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                                    <input
                                        id='confirmPassword'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Xác nhận mật khẩu mới'
                                        className='w-full pl-10 pr-10 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition cursor-pointer'
                                    >
                                        {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className='w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
