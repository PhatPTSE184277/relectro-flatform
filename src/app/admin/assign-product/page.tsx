'use client';

import React, { useState, useRef, useCallback } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useAssignProductContext } from '@/contexts/admin/AssignProductContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';
import { Package } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import AssignedProductList from '@/components/admin/assign-product/AssignedProductList';
import AssignProductModal from '@/components/admin/assign-product/modal/AssignProductModal';
import Pagination from '@/components/ui/Pagination';
import ProcessingModal from '@/components/admin/assign-product/modal/ProcessingModal';
import { useNotifications } from '@/contexts/NotificationContext';

const AssignProductPage: React.FC = () => {
    const {
        assignedProducts,
        loading,
        fetchAssignedProducts,
        assignProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize
    } = useAssignProductContext();

    const { user } = useAuth();
    const { notifications } = useNotifications();
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayString);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [processing, setProcessing] = useState(() => {
        // Nếu có timestamp trong localStorage thì đang processing
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('ewise_processing_time');
        }
        return false;
    });
    const [processingTimestamp, setProcessingTimestamp] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ewise_processing_time') || '';
        }
        return '';
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const tableScrollRef = useRef<HTMLDivElement>(null);

    // Kiểm tra notification khi mount để tự động tắt processing nếu đã có thông báo
    React.useEffect(() => {
        if (processing && notifications.length > 0 && processingTimestamp) {
            // Kiểm tra xem có notification "Phân bổ hoàn tất" mới hơn timestamp đang xử lý không
            const hasCompletionNotif = notifications.some(n => {
                if (!n.title.includes('Phân bổ hoàn tất')) return false;
                
                // So sánh createdAt của notification với processingTimestamp
                const notifTime = new Date(n.createdAt).getTime();
                const processingTime = new Date(processingTimestamp).getTime();
                
                // Notification phải mới hơn hoặc bằng thời điểm bắt đầu xử lý
                return notifTime >= processingTime;
            });
            
            if (hasCompletionNotif) {
                // Có notification hoàn tất rồi, tắt processing
                setProcessing(false);
                setProcessingTimestamp('');
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('ewise_processing_time');
                }
            }
        }
    }, [processing, notifications, processingTimestamp]);

    // Lắng nghe notification từ SignalR
    const handleAssignCompleted = useCallback((data: any) => {
        setProcessing(false);
        setProcessingTimestamp('');
        // Xóa timestamp từ localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ewise_processing_time');
        }
        
        const { success, failed, totalRequested } = data?.data || {};
        
        if (failed === 0) {
            setNotification({
                type: 'success',
                message: `Phân công thành công ${success}/${totalRequested} sản phẩm!`
            });
        } else {
            setNotification({
                type: 'error',
                message: `Phân công hoàn tất: ${success} thành công, ${failed} thất bại`
            });
        }
        
        // Reload danh sách
        fetchAssignedProducts(selectedDate, page, pageSize);
        
        // Tự động ẩn notification sau 5 giây
        setTimeout(() => setNotification(null), 5000);
    }, [selectedDate, page, pageSize, fetchAssignedProducts]);

    // Kết nối SignalR
    useNotificationHub({
        onAssignCompleted: handleAssignCompleted,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    const filteredProducts = assignedProducts.filter((product) => {
        const matchSearch = 
            product.productName?.toLowerCase().includes(search.toLowerCase()) ||
            product.userName?.toLowerCase().includes(search.toLowerCase()) ||
            product.address?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
        fetchAssignedProducts(date, 1, pageSize);
    };

    const handleAssignProducts = async (data: { workDate: string; productIds: string[] }) => {
        setShowAssignModal(false);
        setProcessing(true);
        
        // Lưu timestamp hiện tại khi bắt đầu phân công
        const timestamp = new Date().toISOString();
        setProcessingTimestamp(timestamp);
        
        // Lưu timestamp vào localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('ewise_processing_time', timestamp);
        }
        try {
            await assignProductsToDate(data);
            // Không tắt processing ở đây, chờ SignalR notification
        } catch (error) {
            // Chỉ tắt processing nếu có lỗi
            console.log(error);
            setProcessing(false);
            setProcessingTimestamp('');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('ewise_processing_time');
            }
            setNotification({
                type: 'error',
                message: 'Có lỗi xảy ra khi phân công sản phẩm'
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        fetchAssignedProducts(selectedDate, page, pageSize);
    }, [selectedDate, page, pageSize, fetchAssignedProducts]);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative'>
            {/* Processing Overlay cho toàn bộ content khi đang xử lý */}
            {processing && <ProcessingModal />}

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Phân công sản phẩm
                    </h1>
                </div>
                <div className='w-full sm:max-w-md'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm theo tên sản phẩm, khách hàng...'
                    />
                </div>
            </div>
            <div className='mt-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                <div className='w-64'>
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder='Chọn ngày phân công'
                        disabled={processing}
                    />
                </div>
                <div className='flex flex-1 justify-end w-full sm:w-auto mt-2 sm:mt-0'>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        disabled={processing}
                        className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Package size={18} />
                        Phân công sản phẩm
                    </button>
                </div>
            </div>

            {/* Product List */}
            <AssignedProductList
                products={filteredProducts}
                loading={loading}
                ref={tableScrollRef}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Assign Modal */}
            {showAssignModal && (
                <AssignProductModal
                    open={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    onConfirm={handleAssignProducts}
                    selectedDate={selectedDate}
                />
            )}

            {/* Notification Toast */}
            {notification && (
                <div className='fixed top-4 right-4 z-50 animate-fade-in'>
                    <div className={`rounded-xl shadow-2xl p-4 min-w-[320px] border-l-4 ${
                        notification.type === 'success' 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-red-50 border-red-500'
                    }`}>
                        <div className='flex items-start gap-3'>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {notification.type === 'success' ? (
                                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                    </svg>
                                ) : (
                                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                )}
                            </div>
                            <div className='flex-1'>
                                <h4 className={`font-semibold mb-1 ${
                                    notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {notification.type === 'success' ? 'Thành công!' : 'Thông báo'}
                                </h4>
                                <p className={`text-sm ${
                                    notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className='text-gray-400 hover:text-gray-600 transition'
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignProductPage;
