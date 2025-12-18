'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Package } from 'lucide-react';
import { formatDate } from '@/utils/FormateDate';
import ProductList from './ProductList';

interface EditGroupingModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }) => void;
    day: any;
    vehicles: any[];
    allProducts: any[];
    loading: boolean;
}

const EditGroupingModal: React.FC<EditGroupingModalProps> = ({
    open,
    onClose,
    onConfirm,
    day,
    vehicles,
    allProducts = [],
    loading
}) => {
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    useEffect(() => {
        if (open && day) {
            if (day.suggestedVehicle.id !== selectedVehicleId) {
                setSelectedVehicleId(day.suggestedVehicle.id);
            }
            const newProductIds = day.products.map((p: any) => p.productId);
            if (JSON.stringify(newProductIds) !== JSON.stringify(selectedProductIds)) {
                setSelectedProductIds(newProductIds);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, day]);

    const handleToggleProduct = (productId: string) => {
        setSelectedProductIds((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const handleToggleAll = () => {
        const allProductIds = allProducts.map((p: any) => p.productId);
        if (selectedProductIds.length === allProducts.length) {
            // Bỏ hết
            setSelectedProductIds([]);
        } else {
            // Chọn hết
            setSelectedProductIds(allProductIds);
        }
    };

    const handleConfirm = () => {
        if (selectedVehicleId && selectedProductIds.length > 0) {
            onConfirm({
                workDate: day.workDate,
                vehicleId: selectedVehicleId,
                productIds: selectedProductIds
            });
        }
    };

    const handleClose = () => {
        setSelectedVehicleId(null);
        setSelectedProductIds([]);
        onClose();
    };

    if (!open || !day || !Array.isArray(allProducts)) return null;

    const selectedVehicle = vehicles.find((v) => v.vehicleId === selectedVehicleId);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-purple-50'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Chỉnh sửa thông tin nhóm thu gom
                            </h2>
                            <p className='text-sm text-gray-500 mt-1'>
                                Ngày: {formatDate(day.workDate)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50'>
                    {/* Vehicle Selection */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>
                            Chọn phương tiện
                        </label>
                        <div className='flex flex-col gap-3'>
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.vehicleId}
                                    onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedVehicleId === vehicle.vehicleId
                                            ? 'border-primary-500 bg-primary-50 shadow-md'
                                            : 'border-gray-200 hover:border-primary-300'
                                    }`}
                                >
                                    <div className='flex items-center gap-6'>
                                        <Truck
                                            className={
                                                selectedVehicleId === vehicle.vehicleId
                                                    ? 'text-primary-600'
                                                    : 'text-gray-400'
                                            }
                                            size={20}
                                        />
                                        <span className='font-medium text-gray-900'>
                                            {vehicle.vehicle_Type}
                                        </span>
                                        <span className='text-sm text-gray-600'>
                                            {vehicle.plate_Number}
                                        </span>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <span className='text-xs text-gray-500'>Tải trọng</span>
                                            <span className='font-medium text-gray-900'>{vehicle.capacity_Kg} kg</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <span className='text-xs text-gray-500'>Thể tích</span>
                                            <span className='font-medium text-gray-900'>{vehicle.capacity_M3} m³</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Products Selection */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                <Package size={20} className='text-primary-500' />
                            </span>
                            Chọn sản phẩm ({selectedProductIds.length}/{allProducts.length})
                        </h3>
                        <p className='text-xs text-gray-500 mb-4 ml-10'>
                            Các sản phẩm được gợi ý đã được chọn sẵn. Bạn có thể thêm hoặc bỏ chọn.
                        </p>
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                            <div className='overflow-x-auto'>
                                <ProductList
                                    products={allProducts}
                                    selectedProductIds={selectedProductIds}
                                    onToggleProduct={handleToggleProduct}
                                    onToggleAll={handleToggleAll}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className='bg-primary-50 border border-primary-200 rounded-lg p-4'>
                        <p className='text-sm text-primary-800'>
                            <span className='font-semibold'>Tổng kết:</span> Bạn đã chọn{' '}
                            <span className='font-bold'>{selectedProductIds.length}</span> sản phẩm
                            {selectedVehicle && (
                                <>
                                    {' '}
                                    cho phương tiện{' '}
                                    <span className='font-bold'>
                                        {selectedVehicle.vehicle_Type} ({selectedVehicle.plate_Number})
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t border-gray-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !selectedVehicleId || selectedProductIds.length === 0}
                        className='px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium cursor-pointer flex items-center gap-2'
                    >
                        {loading ? 'Đang cập nhật...' : 'Xác nhận'}
                    </button>
                </div>
            </div>

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default EditGroupingModal;
