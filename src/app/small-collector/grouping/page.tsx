'use client';

import React, { useState, useEffect } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import { GitBranch } from 'lucide-react';
import PreAssignStep from '@/components/small-collector/grouping/PreAssignStep';
import AssignDayStep from '@/components/small-collector/grouping/AssignDayStep';
import { useRouter } from 'next/navigation';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/hooks/useAuth';

const GroupingPage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const {
        loading,
        vehicles,
        pendingProducts,
        preAssignResult,
        fetchVehicles,
        fetchPendingProducts,
        getPreAssignSuggestion,
        createGrouping,
        calculateRoute
    } = useGroupingContext();

    const [activeStep, setActiveStep] = useState(1);
    const [loadThreshold, setLoadThreshold] = useState(80);
    const [selectedDate, setSelectedDate] = useState<string>(getTodayString);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        console.log('User profile:', user);
        console.log('smallCollectionPointId:', user?.smallCollectionPointId);
    }, [user]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    useEffect(() => {
        fetchPendingProducts(selectedDate);
    }, [selectedDate, fetchPendingProducts]);

    const handleGetSuggestion = async (selectedProductIds?: string[]) => {
        await getPreAssignSuggestion(loadThreshold, selectedProductIds);
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

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
    };

    // Phân trang
    const totalPages = Math.ceil((pendingProducts?.length || 0) / itemsPerPage);
    const paginatedProducts = pendingProducts?.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    ) || [];

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
                    <div className='w-64'>
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
                <>
                    <PreAssignStep
                        loading={loading}
                        products={paginatedProducts}
                        allProducts={pendingProducts}
                        loadThreshold={loadThreshold}
                        setLoadThreshold={setLoadThreshold}
                        onGetSuggestion={handleGetSuggestion}
                        page={page}
                        itemsPerPage={itemsPerPage}
                    />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            {activeStep === 2 && preAssignResult && (
                <AssignDayStep
                    loading={loading}
                    preAssignResult={preAssignResult}
                    vehicles={vehicles}
                    products={pendingProducts}
                    onCreateGrouping={handleCreateGrouping}
                    onBack={() => setActiveStep(1)}
                    calculateRoute={calculateRoute}
                />
            )}
        </div>
    );
};

export default GroupingPage;
