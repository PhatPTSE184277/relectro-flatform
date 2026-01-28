'use client';

import React, { useState, useEffect } from 'react';
import { useSendNotiContext } from '@/contexts/admin/SendNotiContext';
import NotificationList from '@/components/admin/send-notification/NotificationList';
import CreateNotiModal from '@/components/admin/send-notification/modal/CreateNotiModal';
import Pagination from '@/components/ui/Pagination';
import { Bell, Send } from 'lucide-react';

const SendNotiPage: React.FC = () => {
    const { notifications, loading, fetchNotifications } = useSendNotiContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);



    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchNotifications();
    };

    const handleOpenModal = () => {
        setIsCreateModalOpen(true);
    };

    const totalPages = Math.max(1, Math.ceil(notifications.length / pageSize));
    const paginatedNotifications = notifications.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Bell className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Quản lý thông báo</h1>
                </div>
                <button
                    onClick={handleOpenModal}
                    className='px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl font-medium cursor-pointer'
                >
                    <Send size={20} />
                    Gửi thông báo mới
                </button>
            </div>

            <NotificationList
                notifications={paginatedNotifications}
                loading={loading}
            />

            <div className='mt-4'>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            {isCreateModalOpen && (
                <CreateNotiModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
};

export default SendNotiPage;
