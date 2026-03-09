import React from 'react';
import { Notification } from '@/services/admin/SendNotiService';
import { formatDate } from '@/utils/FormatDate';
import { formatNumber } from '@/utils/formatNumber';

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
    const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center'>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {formatNumber(stt)}
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
