'use client';

import Header from '@/components/ui/Header';
import LoginForm from '@/components/forms/LoginForm';

export default function Home() {
    return (
        <>
            <Header 
                title="Thu gom" 
                href="/" 
                profileHref="/profile" 
            />
            <div className='min-h-screen bg-gray-50 flex items-center justify-center py-20'>
                <div className='max-w-md w-full space-y-8'>
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