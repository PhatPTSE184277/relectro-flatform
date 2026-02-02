'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import ProductList from './ProductList';
import Pagination from '@/components/ui/Pagination';
import UnassignedProductsModal from './modal/UnassignedProductsModal';
import { formatDate } from '@/utils/FormatDate';
import { AlertTriangle } from 'lucide-react';

interface AssignDayStepProps {
    loading: boolean;
    workDate: string;
    onCreateGrouping: (assignments: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }[]) => void;
    onBack: () => void;
    calculateRoute: (saveResult: boolean) => Promise<void>;
}

const AssignDayStep: React.FC<AssignDayStepProps> = ({
    loading,
    workDate,
    onCreateGrouping,
    onBack,
    calculateRoute
}) => {
    const router = useRouter();
    const { 
        fetchPreviewVehicles, 
        previewVehicles, 
        fetchPreviewProducts, 
        previewProductsPaging,
        unassignedProducts,
        unassignedProductsData,
        unassignedProductsLoading,
        fetchUnassignedProducts
    } = useGroupingContext();
    
    const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number>(0);
    const [productPage, setProductPage] = useState(1);
    const [createDisabled, setCreateDisabled] = useState(false);
    const [showUnassignedModal, setShowUnassignedModal] = useState(false);
    const [unassignedPage, setUnassignedPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch vehicles on mount
    useEffect(() => {
        fetchPreviewVehicles(workDate);
    }, [workDate, fetchPreviewVehicles]);

    // Get current selected vehicle
    const currentVehicle = previewVehicles[selectedVehicleIndex];

    // Fetch preview products when vehicle or page changes
    useEffect(() => {
        if (currentVehicle) {
            const vehicleId = currentVehicle.vehicleId?.toString() || currentVehicle.id?.toString();
            if (vehicleId) {
                fetchPreviewProducts(vehicleId, workDate, productPage, itemsPerPage);
            }
        }
    }, [currentVehicle, workDate, productPage, fetchPreviewProducts]);

    // Use data from API preview
    const displayProducts = previewProductsPaging?.products || [];
    const totalPages = previewProductsPaging?.totalPages || 1;

    const handleCreateGrouping = async () => {
        setCreateDisabled(true);
        try {
            // Fetch all products for each vehicle to get productIds
            const assignmentsPromises = previewVehicles.map(async (vehicleData: any) => {
                const vehicleId = vehicleData.vehicleId?.toString() || vehicleData.id?.toString();
                
                // Fetch all products for this vehicle (using large pageSize to get all at once)
                const totalProduct = vehicleData.totalProduct || 0;
                if (totalProduct > 0) {
                    const response = await fetchPreviewProducts(vehicleId, workDate, 1, totalProduct);
                    const productIds = response?.products?.map((p: any) => p.productId) || [];
                    
                    return {
                        workDate: workDate,
                        vehicleId: vehicleId,
                        productIds: productIds
                    };
                } else {
                    return {
                        workDate: workDate,
                        vehicleId: vehicleId,
                        productIds: []
                    };
                }
            });
            
            const assignments = await Promise.all(assignmentsPromises);
            
            console.log(`Đang tạo nhóm cho ${assignments.length} xe cùng lúc`, assignments);
            
            // Call API to create grouping
            await onCreateGrouping(assignments);
            
            // Calculate route and redirect
            await calculateRoute(true);
            router.push("/small-collector/grouping/list");
        } catch (error) {
            console.error('Error creating grouping:', error);
        } finally {
            setCreateDisabled(false);
        }
    };

    const handleShowUnassignedProducts = () => {
        setShowUnassignedModal(true);
        fetchUnassignedProducts(workDate, unassignedPage, 10);
    };

    const handleUnassignedPageChange = (page: number) => {
        setUnassignedPage(page);
        fetchUnassignedProducts(workDate, page, 10);
    };

    return (
        <div className='space-y-2'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-50 rounded-lg px-2 py-2'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-lg font-bold text-gray-900 mb-0'>
                        Bước 2: Tạo nhóm thu gom - {formatDate(workDate)}
                    </h2>
                    <button
                        onClick={handleShowUnassignedProducts}
                        className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2'
                    >
                        <AlertTriangle size={18} />
                        Xem sản phẩm chưa được chia
                    </button>
                </div>
                <button
                    onClick={onBack}
                    className='px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                >
                    ← Quay lại
                </button>
            </div>

            {/* Filter bar for vehicles */}
            {previewVehicles.length > 0 && (
                <div className='flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 overflow-x-auto'>
                    <span className='text-sm font-semibold text-gray-700 whitespace-nowrap mr-2'>Chọn xe:</span>
                    {previewVehicles.map((vehicleData: any, index: number) => {
                        const vehicleId = vehicleData.vehicleId || vehicleData.id;
                        const plateNumber = vehicleData.plateNumber || vehicleData.plate_Number || vehicleData.vehicleName || 'N/A';
                        
                        return (
                            <button
                                key={`${vehicleId}-${index}`}
                                onClick={() => {
                                    setSelectedVehicleIndex(index);
                                    setProductPage(1); // Reset page when vehicle changes
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                    selectedVehicleIndex === index
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                                }`}
                            >
                                {plateNumber}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Current vehicle info and products */}
            {currentVehicle && (
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
                                            Biển số: {currentVehicle.plateNumber || currentVehicle.plate_Number || currentVehicle.vehicleName || 'N/A'}
                                        </h3>
                                        <span className='text-sm text-gray-600 flex items-center gap-1'>
                                            <strong>Loại xe:</strong> {currentVehicle.vehicleType || currentVehicle.vehicle_Type || 'N/A'}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-4 mt-1 text-sm'>
                                        <span className='text-primary-600 font-semibold'>
                                            {previewProductsPaging?.totalProduct || currentVehicle.totalProduct || 0} sản phẩm
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={handleCreateGrouping}
                                    className={`px-4 py-2 bg-primary-600 text-white rounded-lg transition cursor-pointer shadow-md font-medium ${loading || createDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-700'}`}
                                    disabled={loading || createDisabled}
                                >
                                    {loading || createDisabled ? 'Đang tạo...' : `Tạo nhóm (${previewVehicles.length} xe)`}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products List for this vehicle */}
                    <ProductList
                        products={displayProducts}
                        loading={loading}
                        page={productPage}
                        itemsPerPage={itemsPerPage}
                        showCheckbox={false}
                        maxHeight={33}
                    />
                    
                    {totalPages > 1 && (
                        <Pagination
                            page={productPage}
                            totalPages={totalPages}
                            onPageChange={setProductPage}
                        />
                    )}
                </>
            )}

            {/* No vehicles message */}
            {previewVehicles.length === 0 && (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                    <p className='text-gray-500'>Không có xe nào được gợi ý cho ngày này.</p>
                </div>
            )}

            {/* Unassigned Products Modal */}
            <UnassignedProductsModal
                open={showUnassignedModal}
                onClose={() => setShowUnassignedModal(false)}
                products={unassignedProducts}
                loading={unassignedProductsLoading}
                totalPages={Math.ceil((unassignedProductsData?.total || 0) / 10)}
                currentPage={unassignedPage}
                onPageChange={handleUnassignedPageChange}
                totalCount={unassignedProductsData?.total || 0}
            />
        </div>
    );
};

export default AssignDayStep;
