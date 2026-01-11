'use client';

import React, { useState } from 'react';
import { formatDate } from '@/utils/FormatDate';
import EditGroupingModal from './modal/EditGroupingModal';
import ProductList from './ProductList';

interface AssignDayStepProps {
    loading: boolean;
    preAssignResult: any;
    vehicles: any[];
    products: any[];
    onCreateGrouping: (payload: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }) => void;
    onBack: () => void;
    calculateRoute: (saveResult: boolean) => Promise<void>;
}

const AssignDayStep: React.FC<AssignDayStepProps> = ({
    loading,
    preAssignResult,
    vehicles,
    products,
    onCreateGrouping,
    onBack,
    calculateRoute
}) => {
    const [daySuggestions, setDaySuggestions] = useState<any[]>(
        (preAssignResult?.days || []).map((day: any) => ({
            ...day,
            products: (day.products || []).map((dayProduct: any) => {
                // Tìm product đầy đủ từ mảng products để lấy categoryName và brandName
                const fullProduct = products.find(p => p.productId === dayProduct.productId);
                return fullProduct ? { ...dayProduct, ...fullProduct } : dayProduct;
            })
        }))
    );
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
        (preAssignResult?.days || [])[0]?.workDate || ''
    );

    // Get current filtered day data
    const currentDay = daySuggestions.find(day => day.workDate === selectedDateFilter);

    const handleOpenEditModal = (day: any) => {
        setSelectedDay(day);
        setShowModal(true);
    };

    const handleConfirmEdit = (data: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }) => {
        // Cập nhật lại ngày đang chỉnh sửa
        setDaySuggestions((prev) => prev.map((day) => {
            if (day.workDate === data.workDate) {
                const selectedVehicle = vehicles.find(v => v.vehicleId === data.vehicleId || v.id === data.vehicleId);
                const updatedProducts = data.productIds.map(productId => {
                    const found = products.find(p => p.productId === productId)
                    return found ? { ...found } : { productId };
                });

                // Tính lại tổng khối lượng và thể tích
                const totalWeight = updatedProducts.reduce((sum, p) => sum + (p.weight || 0), 0);
                const totalVolume = updatedProducts.reduce((sum, p) => sum + (p.volume || 0), 0);

                return {
                    ...day,
                    suggestedVehicle: selectedVehicle,
                    products: updatedProducts,
                    totalWeight,
                    totalVolume
                };
            }
            return day;
        }));

        setShowModal(false);
        setSelectedDay(null);
    };

    // Xử lý tạo nhóm thu gom (gọi API)
    const handleCreateGrouping = async (data: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }) => {
        try {
            await onCreateGrouping(data);
            await calculateRoute(true);
            window.location.href = "/small-collector/grouping/list";
        } catch (error) {
            console.error('Error creating grouping:', error);
        }
    };

    return (
        <div className='space-y-2'>
            {/* Filter bar with dates */}
            <div className='flex flex-col md:flex-row md:items-center md:gap-2 gap-1 bg-gray-50 rounded-lg px-2 py-2'>
                <h2 className='text-lg font-bold text-gray-900 mb-0 md:mb-0 md:mr-4 whitespace-nowrap'>
                    Bước 2: Tạo nhóm thu gom
                </h2>
                <div className='flex items-center gap-2 flex-wrap flex-1'>
                    {daySuggestions.map((day: any) => (
                        <button
                            key={day.workDate}
                            onClick={() => setSelectedDateFilter(day.workDate)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
                                selectedDateFilter === day.workDate
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50'
                            }`}
                        >
                            {formatDate(day.workDate)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onBack}
                    className='px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                >
                    ← Quay lại
                </button>
            </div>

            {/* Current day info and products */}
            {currentDay && (
                <>
                    {/* Day Summary Card with inline vehicle info */}
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mt-1'>
                        <div className='flex items-center justify-between mb-1 gap-2 flex-wrap'>
                            <div className='flex items-center gap-3 flex-wrap'>
                                <div className='w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center'>
                                    <span className='text-primary-600 font-bold text-base'>
                                        {new Date(currentDay.workDate).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className='text-base font-bold text-gray-900 mb-0'>
                                        {new Date(currentDay.workDate).toLocaleDateString('vi-VN', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </h3>
                                    <p className='text-xs text-gray-500 mb-0'>
                                        {currentDay.products.length} sản phẩm • {currentDay.totalWeight} kg • {currentDay.totalVolume} m³
                                    </p>
                                </div>
                                {/* Inline vehicle info */}
                                <div className='ml-2 px-2 py-1 bg-blue-50 rounded-lg border border-blue-200 text-blue-600 font-medium text-xs flex items-center'>
                                    Gợi ý: Biển số: {currentDay.suggestedVehicle.plate_Number} - Trọng lượng: {currentDay.suggestedVehicle.capacity_Kg} kg, Thể tích: {currentDay.suggestedVehicle.capacity_M3 || 0} m³
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => handleOpenEditModal(currentDay)}
                                    className='px-4 py-2 bg-white border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition cursor-pointer'
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleCreateGrouping({
                                        workDate: currentDay.workDate,
                                        vehicleId: currentDay.suggestedVehicle.id.toString(),
                                        productIds: currentDay.products.map((p: any) => p.productId)
                                    })}
                                    className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition cursor-pointer shadow-md'
                                >
                                    Tạo nhóm
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <ProductList
                        products={currentDay.products}
                        loading={loading}
                        showCheckbox={false}
                        maxHeight={350}
                    />
                </>
            )}

            {/* Edit Modal */}
            <EditGroupingModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedDay(null);
                }}
                onConfirm={handleConfirmEdit}
                day={selectedDay}
                vehicles={vehicles}
                allProducts={selectedDay?.products || []}
                loading={loading}
            />
        </div>
    );
};

export default AssignDayStep;
