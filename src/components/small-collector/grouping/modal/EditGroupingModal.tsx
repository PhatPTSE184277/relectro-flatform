'use client';

import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { formatDate } from '@/utils/FormatDate';
import ProductList from './ProductList';
import VehicleSelectTable from './VehicleSelectTable';

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
    const [activeTab, setActiveTab] = useState<'vehicle' | 'product'>('vehicle');

    useEffect(() => {
        if (open && day) {
            setActiveTab('vehicle');
            // Always reset when day changes
            setSelectedVehicleId(day.suggestedVehicle?.id || null);
            const newProductIds = day.products?.map((p: any) => p.productId) || [];
            setSelectedProductIds(newProductIds);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, day?.workDate]);

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

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            {/* Modal container */}
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-purple-50'>
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

                {/* Tabs */}
                <div className='flex border-b border-gray-200 bg-gray-50 px-6'>
                    <button
                        onClick={() => setActiveTab('vehicle')}
                        className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                            activeTab === 'vehicle'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Chọn phương tiện
                    </button>
                    <button
                        onClick={() => setActiveTab('product')}
                        className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                            activeTab === 'product'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Chọn sản phẩm
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50'>
                    {activeTab === 'vehicle' && (
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-3'>
                                Chọn phương tiện
                            </label>
                            <VehicleSelectTable
                                vehicles={vehicles}
                                selectedVehicleId={selectedVehicleId}
                                setSelectedVehicleId={setSelectedVehicleId}
                            />
                        </div>
                    )}
                    {activeTab === 'product' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                    <Package size={20} className='text-primary-500' />
                                </span>
                                Chọn sản phẩm ({selectedProductIds.length}/{allProducts.length})
                            </h3>

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
                    )}
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t bg-white'>
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
