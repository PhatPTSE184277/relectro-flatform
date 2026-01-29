'use client';

import React, { useState, useRef, useCallback } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useDistributeProductContext } from '@/contexts/admin/DistributeProductContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';
import { Package, ListChecks } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/ui/SearchBox';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import DistributeProductList from '@/components/admin/distribute-product/DistributeProductList';
import DistributeProductConfirmModal from '@/components/admin/distribute-product/modal/DistributeProductConfirmModal';
import Pagination from '@/components/ui/Pagination';
import DistributeProcessingModal from '@/components/admin/distribute-product/modal/DistributeProcessingModal';
import { useNotifications } from '@/contexts/NotificationContext';
import Toast from '@/components/ui/Toast';
import { getUndistributedProducts } from '@/services/admin/DistributeProductService';

const DistributeProductPage: React.FC = () => {
    const {
        distributedProducts,
        loading,
        fetchDistributedProducts,
        distributeProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize
    } = useDistributeProductContext();

    const { user } = useAuth();
    const { notifications } = useNotifications();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayString);
    const [showDistributeModal, setShowDistributeModal] = useState(false);
    const [undistributedCount, setUndistributedCount] = useState(0);
    const [processing, setProcessing] = useState(() => {
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

    React.useEffect(() => {
        if (processing && notifications.length > 0 && processingTimestamp) {
            const hasCompletionNotif = notifications.some(n => {
                if (!n.title.includes('Chia sản phẩm hoàn tất')) return false;
                const notifTime = new Date(n.createdAt).getTime();
                const processingTime = new Date(processingTimestamp).getTime();
                return notifTime >= processingTime;
            });
            if (hasCompletionNotif) {
                setProcessing(false);
                setProcessingTimestamp('');
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('ewise_processing_time');
                }
            }
        }
    }, [processing, notifications, processingTimestamp]);

    const handleDistributeCompleted = useCallback((data: any) => {
        setProcessing(false);
        setProcessingTimestamp('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ewise_processing_time');
        }
        const { success, failed, totalRequested } = data?.data || {};
        if (failed === 0) {
            setNotification({
                type: 'success',
                message: `Chia thành công ${success}/${totalRequested} sản phẩm!`
            });
        } else {
            setNotification({
                type: 'error',
                message: `Chia hoàn tất: ${success} thành công, ${failed} thất bại`
            });
        }
        fetchDistributedProducts(selectedDate, page, pageSize);
        setTimeout(() => setNotification(null), 5000);
    }, [selectedDate, page, pageSize, fetchDistributedProducts]);

    useNotificationHub({
        onAssignCompleted: handleDistributeCompleted,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    const filteredProducts = distributedProducts.filter((product) => {
        const matchSearch = 
            product.productName?.toLowerCase().includes(search.toLowerCase()) ||
            product.userName?.toLowerCase().includes(search.toLowerCase()) ||
            product.address?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
        fetchDistributedProducts(date, 1, pageSize);
    };

    const fetchUndistributedCount = async (date: string) => {
        try {
            const data = await getUndistributedProducts(date);
            setUndistributedCount(data.length);
        } catch (error) {
            console.log(error);
            setUndistributedCount(0);
        }
    };

    const handleShowDistributeModal = async () => {
        await fetchUndistributedCount(selectedDate);
        setShowDistributeModal(true);
    };

    const handleDistributeProducts = async () => {
        setShowDistributeModal(false);
        setProcessing(true);
        const timestamp = new Date().toISOString();
        setProcessingTimestamp(timestamp);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ewise_processing_time', timestamp);
        }
        try {
            const undistributedProducts = await getUndistributedProducts(selectedDate);
            const productIds = undistributedProducts.map(p => p.productId);
            await distributeProductsToDate({ workDate: selectedDate, productIds });
        } catch (error) {
            console.log(error);
            setProcessing(false);
            setProcessingTimestamp('');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('ewise_processing_time');
            }
            setNotification({
                type: 'error',
                message: 'Có lỗi xảy ra khi chia sản phẩm'
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
        fetchDistributedProducts(selectedDate, page, pageSize);
    }, [selectedDate, page, pageSize, fetchDistributedProducts]);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative'>
            {processing && <DistributeProcessingModal />}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Chia sản phẩm
                    </h1>
                </div>
                <div className='flex flex-nowrap items-center gap-2 w-full max-w-2xl justify-end'>
                    <button
                        onClick={() => router.push('/admin/assigned-product')}
                        className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Xem sản phẩm đã chia'
                    >
                        <ListChecks size={18} />
                        Sản phẩm đã chia
                    </button>
                    <div className='flex-1 min-w-0'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm theo tên sản phẩm, khách hàng...'
                        />
                    </div>
                </div>
            </div>
            <div className='mt-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                <div className='w-64'>
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder='Chọn ngày chia'
                        disabled={processing}
                    />
                </div>
                <div className='flex flex-1 justify-end w-full sm:w-auto mt-2 sm:mt-0'>
                    <button
                        onClick={handleShowDistributeModal}
                        disabled={processing}
                        className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Package size={18} />
                        Chia sản phẩm
                    </button>
                </div>
            </div>
            <DistributeProductList
                products={filteredProducts}
                loading={loading}
                ref={tableScrollRef}
            />
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {showDistributeModal && (
                <DistributeProductConfirmModal
                    open={showDistributeModal}
                    onClose={() => setShowDistributeModal(false)}
                    onConfirm={handleDistributeProducts}
                    workDate={selectedDate}
                    productCount={undistributedCount}
                />
            )}
            <Toast
                open={!!notification}
                type={notification?.type}
                message={notification?.message || ''}
                onClose={() => setNotification(null)}
                duration={5000}
            />
        </div>
    );
};

export default DistributeProductPage;
