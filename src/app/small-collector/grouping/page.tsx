'use client';

import React, { useState, useEffect } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import { GitBranch } from 'lucide-react';
import PreAssignStep from '@/components/small-collector/grouping/PreAssignStep';
import AssignDayStep from '@/components/small-collector/grouping/AssignDayStep';
import RejectAssignmentModal from '@/components/small-collector/grouping/modal/RejectAssignmentModal';
import Toast from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/hooks/useAuth';

const GroupingPage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const {
        loading,
        pendingProducts,
        pendingProductsData,
        pendingProductsPage,
        pendingProductsTotalPages,
        allProductIds,
        preAssignResult,
        fetchPendingProducts,
        fetchAllProductIds,
        setPendingProductsPage,
        getPreAssignSuggestion,
        createGrouping,
        calculateRoute,
        rejectAssignmentHandler
    } = useGroupingContext();

    const [activeStep, setActiveStep] = useState(1);
    const [loadThreshold, setLoadThreshold] = useState(80);
    const [selectedDate, setSelectedDate] = useState<string>(getTodayString);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({ 
        open: false, 
        type: 'success', 
        message: '' 
    });

    useEffect(() => {
        console.log('User profile:', user);
        console.log('smallCollectionPointId:', user?.smallCollectionPointId);
    }, [user]);

    // Handle sessionStorage params from notification
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const navDate = sessionStorage.getItem('grouping_nav_date');
        const navTrigger = sessionStorage.getItem('grouping_nav_trigger');
        const rejectTrigger = sessionStorage.getItem('grouping_reject_trigger');

        // Handle reject trigger (from distribution notification)
        if (rejectTrigger === 'show_reject_modal' && navDate) {
            // Clear the trigger immediately
            sessionStorage.removeItem('grouping_reject_trigger');
            sessionStorage.removeItem('grouping_nav_trigger');
            sessionStorage.removeItem('grouping_nav_date');

            // Apply date and show modal
            setSelectedDate(navDate);
            setPendingProductsPage(1);
            setShowRejectModal(true);

            // Fetch data with new date
            fetchPendingProducts(navDate, 1);
            return;
        }

        // Only apply if triggered from notification
        if (navTrigger === 'notification' && navDate) {
            // Clear the trigger immediately
            sessionStorage.removeItem('grouping_nav_trigger');
            sessionStorage.removeItem('grouping_nav_date');

            // Apply date
            setSelectedDate(navDate);
            setPendingProductsPage(1);

            // Fetch data with new date
            fetchPendingProducts(navDate, 1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchPendingProducts(selectedDate, pendingProductsPage);
    }, [selectedDate, pendingProductsPage, fetchPendingProducts]);

    useEffect(() => {
        // Fetch all product IDs when date changes or when data is loaded
        if (pendingProductsData?.totalItems) {
            fetchAllProductIds(selectedDate);
        }
    }, [selectedDate, pendingProductsData?.totalItems, fetchAllProductIds]);

    const handleGetSuggestion = async (workDate: string, vehicleIds: string[], selectedProductIds?: string[]) => {
        await getPreAssignSuggestion(workDate, vehicleIds, loadThreshold, selectedProductIds);
        setActiveStep(2);
    };

    const handleCreateGrouping = async (assignments: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }[]) => {
        // Ensure vehicleId is string for all assignments
        const formattedAssignments = assignments.map(assignment => ({
            ...assignment,
            vehicleId: String(assignment.vehicleId)
        }));
        await createGrouping(formattedAssignments);
    };

    const handleConfirmReject = async (reason: string) => {
        setRejectLoading(true);
        try {
            const result = await rejectAssignmentHandler(reason, selectedDate);
            
            setShowRejectModal(false);
            setToast({
                open: true,
                type: 'success',
                message: result?.message || `Đã từ chối nhận ${result?.data?.totalSuccess || 0} sản phẩm thành công!`
            });

            // Refresh data after rejection
            await fetchPendingProducts(selectedDate, 1);
            await fetchAllProductIds(selectedDate);
        } catch (error: any) {
            console.error('Error rejecting assignment:', error);
            setToast({
                open: true,
                type: 'error',
                message: error?.response?.data?.message || error?.message || 'Không thể từ chối nhận hàng. Vui lòng thử lại!'
            });
        } finally {
            setRejectLoading(false);
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPendingProductsPage(1);
    };

    // const steps = [
    //     { id: 1, name: 'Gợi ý gom nhóm', icon: <Users size={20} /> },
    //     { id: 2, name: 'Tạo nhóm thu gom', icon: <Calendar size={20} /> }
    // ];

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <GitBranch className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Gom nhóm thu gom
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <div className='min-w-fit'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder='Chọn ngày làm việc'
                        />
                    </div>
                    <button
                        onClick={() => router.push('/small-collector/grouping/list')}
                        className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer'
                    >
                        Xem danh sách nhóm
                    </button>
                </div>
            </div>

            {/* Content (no white box) */}
            {activeStep === 1 && (
                <div className='space-y-4'>
                    <PreAssignStep
                        loading={loading}
                        products={pendingProducts}
                        totalItems={pendingProductsData?.totalItems || 0}
                        allProductIds={allProductIds}
                        loadThreshold={loadThreshold}
                        setLoadThreshold={setLoadThreshold}
                        onGetSuggestion={handleGetSuggestion}
                        onReject={() => setShowRejectModal(true)}
                        rejectLoading={rejectLoading}
                        page={pendingProductsPage}
                        itemsPerPage={10}
                        workDate={selectedDate}
                    />
                    {pendingProductsTotalPages > 1 && (
                        <Pagination
                            page={pendingProductsPage}
                            totalPages={pendingProductsTotalPages}
                            onPageChange={setPendingProductsPage}
                        />
                    )}
                </div>
            )}

            {activeStep === 2 && preAssignResult && (
                <AssignDayStep
                    loading={loading}
                    workDate={selectedDate}
                    onCreateGrouping={handleCreateGrouping}
                    onBack={() => setActiveStep(1)}
                    calculateRoute={calculateRoute}
                />
            )}

            {/* Reject Assignment Modal */}
            <RejectAssignmentModal
                open={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleConfirmReject}
                loading={rejectLoading}
                productCount={pendingProductsData?.totalItems || 0}
                workDate={selectedDate}
            />

            {/* Toast */}
            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
};

export default GroupingPage;
