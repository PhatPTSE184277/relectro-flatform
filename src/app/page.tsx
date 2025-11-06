'use client';

import Header from '@/components/Header';
import LoginForm from '@/components/forms/LoginForm';

export default function Home() {
    return (
        <>
            <Header />
            <div className='min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center py-20 relative overflow-hidden'>
                <div className='absolute inset-0 pointer-events-none'>
                    <div className='absolute -top-20 -left-20 w-96 h-96 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl'></div>
                    <div className='absolute -top-10 -right-10 w-80 h-80 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-25 blur-3xl'></div>
                </div>
                <div className='max-w-md w-full space-y-8 relative z-10'>
                    <div className='text-center animate-fade-in'>
                        <div className='flex items-center justify-center gap-2'>
                            <span className='text-4xl font-bold text-black mb-2'>
                                Đăng nhập nhân viên
                            </span>
                        </div>
                        <p className='text-gray-600 text-lg'>
                            Đăng nhập để truy cập công việc của bạn
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </>
    );
}