'use client';

import React, { useState, useEffect } from 'react';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import { Users, Calendar, GitBranch } from 'lucide-react';
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
        pendingProductsData,
        preAssignResult,
        fetchVehicles,
        fetchPendingProducts,
        getPreAssignSuggestion,
        createGrouping,
        calculateRoute
    } = useGroupingContext();

    const [activeStep, setActiveStep] = useState(1);
    const [loadThreshold, setLoadThreshold] = useState(80);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
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

    const handleGetSuggestion = async () => {
        await getPreAssignSuggestion(loadThreshold);
        setActiveStep(2);
    };

    const handleCreateGrouping = async (payload: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }) => {
        await createGrouping(payload);
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

    const steps = [
        { id: 1, name: 'Gợi ý gom nhóm', icon: <Users size={20} /> },
        { id: 2, name: 'Tạo nhóm thu gom', icon: <Calendar size={20} /> }
    ];

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                    <GitBranch className='text-white' size={20} />
                </div>
                <h1 className='text-3xl font-bold text-gray-900'>
                    Gom nhóm thu gom
                </h1>
                <button
                    onClick={() => router.push('/small-collector/grouping/list')}
                    className='ml-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer'
                >
                    Xem danh sách nhóm
                </button>
            </div>

            {/* Date Picker và Thông tin tổng quan */}
            {activeStep === 1 && (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex-1 max-w-xs'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Chọn ngày làm việc
                            </label>
                            <CustomDatePicker
                                value={selectedDate}
                                onChange={handleDateChange}
                                placeholder='Chọn ngày'
                            />
                        </div>
                        {pendingProductsData && (
                            <div className='flex gap-6'>
                                <div className='text-center'>
                                    <p className='text-sm text-gray-600'>Tổng sản phẩm</p>
                                    <p className='text-2xl font-bold text-primary-600'>
                                        {pendingProductsData.total}
                                    </p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-sm text-gray-600'>Tổng khối lượng</p>
                                    <p className='text-2xl font-bold text-primary-600'>
                                        {pendingProductsData.totalWeightKg} kg
                                    </p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-sm text-gray-600'>Tổng thể tích</p>
                                    <p className='text-2xl font-bold text-primary-600'>
                                        {pendingProductsData.totalVolumeM3.toFixed(2)} m³
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Steps */}
            <div className='mb-8'>
                <div className='flex items-center justify-center'>
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className='flex flex-col items-center'>
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                        activeStep >= step.id
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {step.icon}
                                </div>
                                <span
                                    className={`mt-2 text-sm font-medium ${
                                        activeStep >= step.id
                                            ? 'text-primary-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-24 h-1 mx-4 transition-all ${
                                        activeStep > step.id
                                            ? 'bg-primary-600'
                                            : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
                {activeStep === 1 && (
                    <>
                        <PreAssignStep
                            loading={loading}
                            products={paginatedProducts}
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
        </div>
    );
};

export default GroupingPage;
