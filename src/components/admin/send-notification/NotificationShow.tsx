import React from 'react';
import { Notification } from '@/services/admin/SendNotiService';
import { formatDate } from '@/utils/FormatDate';

interface NotificationShowProps {
    notification: Notification;
    stt: number;
    isLast?: boolean;
}

const NotificationShow: React.FC<NotificationShowProps> = ({
    notification,
    stt,
    isLast = false
}) => {
    return (
        <tr className={`${
            !isLast ? 'border-b border-primary-100' : ''
        } hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900'>
                <div className='line-clamp-1'>{notification.title}</div>
            </td>
            <td className='py-3 px-4 text-gray-700'>
                <div className='line-clamp-2'>{notification.message}</div>
            </td>
            <td className='py-3 px-4 text-center text-gray-600'>
                {formatDate(notification.createdAt)}
            </td>
        </tr>
    );
};

export default NotificationShow;
