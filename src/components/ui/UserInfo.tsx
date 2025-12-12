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
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    const hasValidData = user && (user.name || user.phone || user.email || user.avatar);

    if (!hasValidData) {
        return (
            <p className='text-sm text-gray-500'>Thông tin người dùng không khả dụng.</p>
        );
    }

    return (
        <div className='flex gap-3 items-center'>
            {user.avatar && (
                user.avatar.startsWith('http') && user.avatar.includes('googleusercontent.com') ? (
                    <img
                        src={user.avatar}
                        width={56}
                        height={56}
                        className='w-14 h-14 rounded-xl object-cover shrink-0'
                        alt='Avatar người dùng'
                    />
                ) : (
                    <Image
                        src={user.avatar}
                        width={56}
                        height={56}
                        className='w-14 h-14 rounded-xl object-cover shrink-0'
                        alt='Avatar người dùng'
                    />
                )
            )}
            <div className='flex flex-col justify-center w-full'>
                <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
                    <span className='font-semibold text-gray-900'>{user.name || 'Không có tên'}</span>
                    <span className='mx-1 text-gray-400'>•</span>
                    <span className='text-gray-700'>{user.phone || 'Không có số điện thoại'}</span>
                    <span className='mx-1 text-gray-400'>•</span>
                    <span className='text-gray-700'>{user.email || 'Không có email'}</span>
                </div>
                {user.address && (
                    <p className='mt-1 text-gray-600 text-sm'>{user.address}</p>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
