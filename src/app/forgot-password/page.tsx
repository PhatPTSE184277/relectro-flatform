'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Key, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { saveForgotPasswordOtp, checkForgotPasswordOtp, resetForgotPassword } from '@/services/AuthService';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Header from '@/components/ui/Header';

type Step = 'email' | 'otp' | 'password';

const ForgotPasswordPage: React.FC = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSendOtp = async () => {
        if (!email) {
            toast.error('Vui lòng nhập email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        setLoading(true);
        try {
            await saveForgotPasswordOtp(email);
            toast.success('Mã OTP đã được gửi đến email của bạn');
            setStep('otp');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Không thể gửi OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Vui lòng nhập mã OTP');
            return;
        }

        setLoading(true);
        try {
            await checkForgotPasswordOtp(email, otp);
            toast.success('Xác thực OTP thành công');
            setStep('password');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Mã OTP không đúng');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        try {
            await resetForgotPassword(email, newPassword, confirmPassword);
            toast.success('Đổi mật khẩu thành công');
            router.push('/');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header 
                title="Thu gom" 
                href="/" 
                profileHref="/profile" 
            />
            <div className='min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center py-20 relative overflow-hidden'>
                <div className='absolute inset-0 pointer-events-none'>
                    <div className='absolute -top-20 -left-20 w-96 h-96 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl'></div>
                    <div className='absolute -top-10 -right-10 w-80 h-80 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-25 blur-3xl'></div>
                </div>

                <div className='max-w-md w-full relative z-10'>
                    <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                        {/* Header */}
                        <div className='mb-6'>
                            <button
                                onClick={() => router.push('/')}
                                className='flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition cursor-pointer mb-4'
                            >
                                <ArrowLeft size={20} />
                                Quay lại đăng nhập
                            </button>
                            <h2 className='text-2xl font-bold text-gray-900'>Quên mật khẩu</h2>
                        </div>

                        {/* Body */}
                        <div>
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
            </div>
        </>
    );
};

export default ForgotPasswordPage;
