'use client';

import React, { useState, useRef, useCallback } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useDistributeProductContext } from '@/contexts/admin/DistributeProductContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';
import { Package } from 'lucide-react';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DistributeProductConfirmModal from '@/components/admin/distribute-product/modal/DistributeProductConfirmModal';
import Pagination from '@/components/ui/Pagination';
import { useNotifications } from '@/contexts/NotificationContext';
import Toast from '@/components/ui/Toast';
import DistributeProductFilter from '@/components/admin/distribute-product/DistributeProductFilter';
import CompanyList from '@/components/admin/distribute-product/CompanyList';
import ProductList from '@/components/admin/distribute-product/ProductList';
import SmallPointList from '@/components/admin/distribute-product/SmallPointList';


const DistributeProductPage: React.FC = () => {
    const {
        undistributedProducts,
        allUndistributedProducts,
        companies,
        scpProducts,
        loading,
        companyLoading,
        scpLoading,
        activeFilter,
        setActiveFilter,
        fetchUndistributedProducts,
        fetchCompanies,
        fetchSCPProducts,
        distributeProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize,
        scpPage,
        setScpPage,
        scpTotalPages
    } = useDistributeProductContext();

    const { user } = useAuth();
    const { notifications } = useNotifications();
    const [selectedDate, setSelectedDate] = useState(getTodayString);
    const [showDistributeModal, setShowDistributeModal] = useState(false);
    const [undistributedCount, setUndistributedCount] = useState(0);
    const [processing, setProcessing] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('ewise_processing_date');
        }
        return false;
    });
    const [processingDate, setProcessingDate] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ewise_processing_date') || '';
        }
        return '';
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [selectedSCP, setSelectedSCP] = useState<any>(null);

    React.useEffect(() => {
        if (processing && notifications.length > 0 && processingDate) {
            const lastNotification = notifications[notifications.length - 1];
            if (lastNotification?.type === 'AssignCompleted') {
                handleDistributeCompleted(lastNotification);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processing, notifications, processingDate]);

    const handleDistributeCompleted = useCallback((data: any) => {
        setProcessing(false);
        setProcessingDate('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ewise_processing_date');
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
        if (activeFilter === 'undistributed') {
            fetchUndistributedProducts(selectedDate, page, pageSize);
        } else {
            fetchCompanies(selectedDate);
        }
        setTimeout(() => setNotification(null), 5000);
    }, [selectedDate, page, pageSize, activeFilter, fetchUndistributedProducts, fetchCompanies]);

    useNotificationHub({
        onAssignCompleted: handleDistributeCompleted,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
        setSelectedCompany(null);
        setSelectedSCP(null);
        
        // Check if this date is currently being processed
        const isProcessingThisDate = processingDate && processingDate === date;
        
        if (activeFilter === 'undistributed') {
            // Don't fetch if this date is being processed
            if (!isProcessingThisDate) {
                fetchUndistributedProducts(date, 1, pageSize);
            }
        } else {
            fetchCompanies(date);
        }
    };

    const handleFilterChange = (filter: 'undistributed' | 'distributed') => {
        setActiveFilter(filter);
        setPage(1);
        setSelectedCompany(null);
        setSelectedSCP(null);
        
        // Check if selected date is currently being processed
        const isProcessingThisDate = processingDate && processingDate === selectedDate;
        
        if (filter === 'undistributed') {
            // Don't fetch if this date is being processed
            if (!isProcessingThisDate) {
                fetchUndistributedProducts(selectedDate, 1, pageSize);
            }
        } else {
            fetchCompanies(selectedDate);
        }
    };

    const handleSelectCompany = (company: any) => {
        setSelectedCompany(company);
        setSelectedSCP(null);
    };

    const handleSelectSCP = (scp: any) => {
        setSelectedSCP(scp);
        setScpPage(1);
        fetchSCPProducts(scp.pointId, selectedDate, 1, pageSize);
    };

    const handleBackToCompanies = () => {
        setSelectedSCP(null);
        setScpPage(1);
    };

    const handleBackToFilter = () => {
        setSelectedCompany(null);
        setSelectedSCP(null);
    };

    const handleShowDistributeModal = () => {
        setUndistributedCount(allUndistributedProducts.length);
        setShowDistributeModal(true);
    };

    const handleDistributeProducts = async () => {
        setShowDistributeModal(false);
        const dateToProcess = selectedDate;
        setProcessing(true);
        setProcessingDate(dateToProcess);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ewise_processing_date', dateToProcess);
        }
        // Reset date picker về ngày hiện tại
        setSelectedDate(getTodayString());
        setPage(1);
        try {
            const productIds = allUndistributedProducts.map((p: any) => p.productId);
            await distributeProductsToDate({ workDate: dateToProcess, productIds });
        } catch (error) {
            console.log(error);
            setProcessing(false);
            setProcessingDate('');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('ewise_processing_date');
            }
            setNotification({
                type: 'error',
                message: 'Có lỗi xảy ra khi chia sản phẩm'
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (activeFilter === 'undistributed') {
            fetchUndistributedProducts(selectedDate, newPage, pageSize);
        }
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleScpPageChange = (newPage: number) => {
        setScpPage(newPage);
        if (selectedSCP) {
            fetchSCPProducts(selectedSCP.pointId, selectedDate, newPage, pageSize);
        }
    };

    React.useEffect(() => {
        // Check if selected date is currently being processed
        const isProcessingThisDate = processingDate && processingDate === selectedDate;
        
        if (activeFilter === 'undistributed') {
            // Don't fetch if this date is being processed
            if (!isProcessingThisDate) {
                fetchUndistributedProducts(selectedDate, page, pageSize);
            }
        } else {
            fetchCompanies(selectedDate);
        }
    }, [selectedDate, activeFilter, page, pageSize, processingDate, fetchUndistributedProducts, fetchCompanies]);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Chia sản phẩm
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    {activeFilter === 'distributed' && (selectedCompany || selectedSCP) && (
                        <Breadcrumb
                            items={[
                                { label: 'Danh sách công ty', onClick: handleBackToFilter },
                                ...(selectedCompany ? [{ 
                                    label: selectedCompany.companyName, 
                                    onClick: selectedSCP ? handleBackToCompanies : undefined 
                                }] : []),
                                ...(selectedSCP ? [{ label: selectedSCP.pointName }] : [])
                            ]}
                        />
                    )}
                    <div className='min-w-fit'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder='Chọn ngày chia'
                        />
                    </div>
                    <button
                        onClick={handleShowDistributeModal}
                        disabled={processing || (processingDate && processingDate === selectedDate) || activeFilter !== 'undistributed' || allUndistributedProducts.length === 0}
                        className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Package size={18} />
                        Chia sản phẩm
                    </button>
                </div>
            </div>
            {/* Filter Buttons */}
            <DistributeProductFilter 
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
            />

            {/* Undistributed Products View */}
            {activeFilter === 'undistributed' && (
                <>
                    <ProductList
                        products={undistributedProducts}
                        loading={loading}
                        page={page}
                        itemsPerPage={pageSize}
                        scpName=""
                    />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Distributed Products View */}
            {activeFilter === 'distributed' && !selectedCompany && (
                <CompanyList
                    companies={companies}
                    loading={companyLoading}
                    onSelectCompany={handleSelectCompany}
                />
            )}

            {/* Company's SCP List */}
            {activeFilter === 'distributed' && selectedCompany && !selectedSCP && (
                <SmallPointList
                    points={selectedCompany.smallCollectionPoints || []}
                    loading={false}
                    onSelectPoint={handleSelectSCP}
                />
            )}

            {/* SCP Products List */}
            {activeFilter === 'distributed' && selectedSCP && (
                <>
                    <ProductList
                        products={scpProducts}
                        loading={scpLoading}
                        scpName={selectedSCP.pointName}
                        page={scpPage}
                        itemsPerPage={pageSize}
                    />
                    <Pagination
                        page={scpPage}
                        totalPages={scpTotalPages}
                        onPageChange={handleScpPageChange}
                    />
                </>
            )}

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
