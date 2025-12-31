import React from 'react';
import Image from 'next/image';

interface UserInfoProps {
    user?: {
        name?: string;
        phone?: string;
        email?: string;
        address?: string;
        avatar?: string;
        [key: string]: any;
    };
    label?: React.ReactNode;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, label }) => {
    const hasValidData = user && (user.name || user.phone || user.email || user.avatar);

    if (!hasValidData) {
        return (
            <p className='text-sm text-gray-500'>Thông tin người dùng không khả dụng.</p>
        );
    }

    return (
        <div className={`relative bg-white rounded-xl p-6 mb-3 shadow-sm border border-gray-100 flex gap-2 items-center${label ? ' mt-10' : ''}`}>
            {label && (
                <div
                    className="absolute -top-3 left-4 bg-white px-3 py-0.5 text-sm font-bold text-primary-700 border border-primary-300 rounded-full shadow-sm z-10 select-none"
                    style={{transform: 'translateY(-50%)', minHeight: 28, lineHeight: '20px'}}
                >
                    {label}
                </div>
            )}
            {user.avatar && (
                <Image
                    src={user.avatar}
                    width={40}
                    height={40}
                    className='w-10 h-10 rounded-full object-cover shrink-0'
                    alt='Avatar người dùng'
                />
            )}
            <div className='flex flex-col justify-center w-full'>
                <div className='text-sm font-semibold text-gray-900'>
                    {user.name || 'Không có tên'}
                </div>
                {(user.phone || user.email) && (
                    <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mt-1'>
                        {user.phone && (
                            <span className='text-gray-700'>{user.phone}</span>
                        )}
                        {user.phone && user.email && (
                            <span className='mx-1 text-gray-400'>•</span>
                        )}
                        {user.email && (
                            <span className='text-gray-700'>{user.email}</span>
                        )}
                    </div>
                )}
                {user.address && (
                    <p className='mt-1 text-gray-600 text-sm'>{user.address}</p>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
