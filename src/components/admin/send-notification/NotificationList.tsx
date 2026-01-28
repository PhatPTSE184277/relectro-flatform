import React from 'react';
import { Notification } from '@/services/admin/SendNotiService';
import NotificationShow from './NotificationShow';

interface NotificationListProps {
    notifications: Notification[];
    loading: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
    notifications, 
    loading
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[60vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[45vh] xl:max-h-[85vh] 2xl:max-h-[55vh] overflow-y-auto'>
                            <table className='min-w-full text-sm text-gray-800'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left'>Tiêu đề</th>
                                        <th className='py-3 px-4 text-left'>Nội dung</th>
                                        <th className='py-3 px-4 text-center w-36'>Ngày gửi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-gray-100'>
                                                <td colSpan={4} className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded animate-pulse' />
                                                </td>
                                            </tr>
                                        ))
                                    ) : notifications.length > 0 ? (
                                        notifications.map((noti, idx) => (
                                            <NotificationShow
                                                key={noti.notificationId}
                                                notification={noti}
                                                stt={idx + 1}
                                                isLast={idx === notifications.length - 1}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Chưa có thông báo nào được gửi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationList;
