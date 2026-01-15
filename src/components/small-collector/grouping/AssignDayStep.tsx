'use client';

import React, { useState } from 'react';
import { formatDate } from '@/utils/FormatDate';
import EditGroupingModal from './modal/EditGroupingModal';
import ProductList from './ProductList';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
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
    const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number>(0);

    // Get unique dates for filter
    const uniqueDates = Array.from(new Set(daySuggestions.map(d => d.workDate)));
    
    // Get all vehicles for selected date
    const vehiclesForSelectedDate = daySuggestions.filter(day => day.workDate === selectedDateFilter);
    
    // Get current selected vehicle group
    const currentVehicleGroup = vehiclesForSelectedDate[selectedVehicleIndex];

    const handleOpenEditModal = (day: any) => {
        setSelectedDay(day);
        setShowModal(true);
    };

    const handleConfirmEdit = (data: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }) => {
        // Cập nhật lại xe và sản phẩm của nhóm đang chỉnh sửa
        setDaySuggestions((prev) => prev.map((day) => {
            // Tìm đúng day dựa trên cả workDate và vehicleId
            if (day.workDate === data.workDate && (day.suggestedVehicle.id === data.vehicleId || day.suggestedVehicle.id.toString() === data.vehicleId)) {
                const selectedVehicle = vehicles.find(v => v.vehicleId === data.vehicleId || v.id === data.vehicleId || v.id.toString() === data.vehicleId);
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

    // Xử lý tạo nhóm thu gom cho TẤT CẢ xe của ngày đó
    const handleCreateGrouping = async () => {
        try {
            // Lấy tất cả xe của ngày đang chọn
            const allVehiclesOfDay = vehiclesForSelectedDate;
            
            // Tạo nhóm cho từng xe
            for (let i = 0; i < allVehiclesOfDay.length; i++) {
                const vehicleGroup = allVehiclesOfDay[i];
                console.log(`Đang tạo nhóm cho xe ${i + 1}/${allVehiclesOfDay.length}: ${vehicleGroup.suggestedVehicle.plate_Number}`);
                
                await onCreateGrouping({
                    workDate: vehicleGroup.workDate,
                    vehicleId: vehicleGroup.suggestedVehicle.id.toString(),
                    productIds: vehicleGroup.products.map((p: any) => p.productId)
                });
            }
            
            // Sau khi tạo xong tất cả xe, tính route và chuyển trang
            await calculateRoute(true);
            router.push("/small-collector/grouping/list");
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
                    {uniqueDates.map((date: string) => (
                        <button
                            key={date}
                            onClick={() => {
                                setSelectedDateFilter(date);
                                setSelectedVehicleIndex(0); // Reset về xe đầu tiên khi đổi ngày
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
                                selectedDateFilter === date
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50'
                            }`}
                        >
                            {formatDate(date)}
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

            {/* Filter bar for vehicles */}
            {vehiclesForSelectedDate.length > 0 && (
                <div className='flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 overflow-x-auto'>
                    <span className='text-sm font-semibold text-gray-700 whitespace-nowrap mr-2'>Chọn xe:</span>
                    {vehiclesForSelectedDate.map((vehicleGroup: any, index: number) => (
                        <button
                            key={`${vehicleGroup.suggestedVehicle.id}-${index}`}
                            onClick={() => setSelectedVehicleIndex(index)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                selectedVehicleIndex === index
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                            }`}
                        >
                            {vehicleGroup.suggestedVehicle.plate_Number}
                        </button>
                    ))}
                </div>
            )}

            {/* Current vehicle info and products */}
            {currentVehicleGroup && (
                <>
                    {/* Vehicle Header Card */}
                    <div className='bg-primary-50 p-4 rounded-lg'>
                        <div className='flex items-center justify-between gap-2 flex-wrap'>
                            <div className='flex items-center gap-3 flex-1'>
                                <div className='w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shadow-md'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <h3 className='text-lg font-bold text-gray-900'>
                                            Biển số: {currentVehicleGroup.suggestedVehicle.plate_Number}
                                        </h3>
                                        <span className='text-sm text-gray-600 flex items-center gap-1'>
                                            <strong>Tải trọng:</strong> {currentVehicleGroup.suggestedVehicle.capacity_Kg} kg
                                            <span className='text-xs text-gray-500'>({currentVehicleGroup.suggestedVehicle.allowedCapacityKg} kg cho phép)</span>
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-4 mt-1 text-sm'>
                                        <span className='text-primary-600 font-semibold'>
                                            {currentVehicleGroup.products.length} sản phẩm
                                        </span>
                                        <span className='text-gray-600'>
                                            Tổng: {currentVehicleGroup.totalWeight.toFixed(2)} kg • {currentVehicleGroup.totalVolume.toFixed(2)} m³
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => handleOpenEditModal(currentVehicleGroup)}
                                    className='px-4 py-2 bg-white border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition cursor-pointer font-medium'
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={handleCreateGrouping}
                                    className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition cursor-pointer shadow-md font-medium'
                                    disabled={loading}
                                >
                                    {loading ? 'Đang tạo...' : `Tạo nhóm (${vehiclesForSelectedDate.length} xe)`}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products List for this vehicle */}
                    <ProductList
                        products={currentVehicleGroup.products}
                        loading={loading}
                        showCheckbox={false}
                        maxHeight={260}
                    />
                </>
            )}

            {/* No vehicles message */}
            {vehiclesForSelectedDate.length === 0 && (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                    <p className='text-gray-500'>Không có xe nào được gợi ý cho ngày này.</p>
                </div>
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
