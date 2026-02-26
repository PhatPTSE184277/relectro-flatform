'use client';

import React, { useState, useEffect } from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import ProductList from './ProductList';
import VehicleSelectionModal from './modal/VehicleSelectionModal';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import { Vehicle } from '@/services/small-collector/GroupingService';
import { Loader2 } from 'lucide-react';

interface PreAssignStepProps {
    loading: boolean;
    products: any[];
    totalItems?: number;
    allProductIds?: string[]; // All product IDs from API
    loadThreshold: number;
    setLoadThreshold: (value: number) => void;
    onGetSuggestion: (workDate: string, vehicleIds: string[], selectedProductIds?: string[]) => void;
    onReject?: () => void;
    rejectLoading?: boolean;
    onSkip?: () => void;
    page?: number;
    itemsPerPage?: number;
    workDate: string;
}

const PreAssignStep: React.FC<PreAssignStepProps> = ({
    loading,
    products,
    allProductIds,
    loadThreshold,
    setLoadThreshold,
    onGetSuggestion,
    // onReject,
    // rejectLoading = false,
    page = 1,
    itemsPerPage = 10,
    workDate
}) => {
    const { availableVehicles, vehiclesLoading, fetchAvailableVehicles } = useGroupingContext();
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        fetchAvailableVehicles();
    }, [fetchAvailableVehicles]);

    useEffect(() => {
        // Auto select all vehicles when loaded
        if (availableVehicles && availableVehicles.length > 0) {
            setSelectedVehicleIds(availableVehicles.map((v: Vehicle) => v.vehicleId));
        }
    }, [availableVehicles]);

    const handleToggleSelect = (productId: string) => {
        setSelectedProductIds(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleToggleAll = () => {
        // Select all products from API (all pages)
        const targetIds = allProductIds && allProductIds.length > 0 
            ? allProductIds 
            : products.map(p => p.productId);
        
        // Check if all are already selected
        const allSelected = targetIds.every(id => selectedProductIds.includes(id));
        
        if (allSelected) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(targetIds);
        }
    };

    const handleShowModal = () => {
        if (selectedProductIds.length === 0) return;
        setShowVehicleModal(true);
    };

    const handleToggleVehicle = (vehicleId: string) => {
        setSelectedVehicleIds(prev => 
            prev.includes(vehicleId) 
                ? prev.filter(id => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const handleToggleAllVehicles = () => {
        const allSelected = availableVehicles.every((v: Vehicle) => selectedVehicleIds.includes(v.vehicleId));
        if (allSelected) {
            setSelectedVehicleIds([]);
        } else {
            setSelectedVehicleIds(availableVehicles.map((v: Vehicle) => v.vehicleId));
        }
    };

    const handleConfirmVehicles = async (vehicleIds: string[]) => {
        setConfirming(true);
        try {
            await onGetSuggestion(
                workDate,
                vehicleIds,
                selectedProductIds.length > 0 ? selectedProductIds : undefined
            );
            setShowVehicleModal(false);
        } catch (error) {
            console.error('Error getting suggestion:', error);
        } finally {
            setConfirming(false);
        }
    };

    return (
        <div className='space-y-4'>
            {/* Top controls: label, threshold, button all in one row */}
            <div className='flex flex-col md:flex-row md:items-center md:gap-4 gap-2 bg-gray-50 rounded-lg px-4 py-3 mb-2'>
                <h2 className='text-lg font-bold text-gray-900 mb-0 md:mb-0 md:mr-4 whitespace-nowrap'>
                    Bước 1: Hệ thống sẽ tự động phân chia sản phẩm cho xe
                </h2>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Ngưỡng tải:</label>
                    <CustomNumberInput
                        value={loadThreshold}
                        onChange={setLoadThreshold}
                        min={0}
                        max={100}
                        className='w-16 px-2 py-1 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-600 font-bold bg-white'
                    />
                    <span className='text-primary-600 font-semibold'>%</span>
                </div>
                <div className='flex items-center gap-2 ml-auto'>
                    {/* {products.length > 0 && onReject && (
                        <button
                            onClick={onReject}
                            disabled={rejectLoading}
                            className='py-2 px-4 text-base bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2'
                        >
                            <AlertTriangle size={18} />
                            {rejectLoading ? <Loader2 size={16} className="animate-spin" /> : 'Từ chối nhận hàng'}
                        </button>
                    )} */}
                    <button
                        onClick={handleShowModal}
                        disabled={loading || selectedProductIds.length === 0}
                        className='py-2 px-4 text-base bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap'
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : `Phân chia${selectedProductIds.length > 0 ? ` (${selectedProductIds.length})` : ''}`}
                    </button>
                </div>
            </div>

            {/* Pending Products List */}
            <ProductList 
                products={products} 
                loading={loading} 
                page={page} 
                itemsPerPage={itemsPerPage}
                showCheckbox={true}
                selectedProductIds={selectedProductIds}
                allProductIds={allProductIds}
                onToggleSelect={handleToggleSelect}
                onToggleAll={handleToggleAll}
                maxHeight={54}
            />

            {/* Vehicle Selection Modal */}
            <VehicleSelectionModal
                open={showVehicleModal}
                onClose={() => setShowVehicleModal(false)}
                onConfirm={handleConfirmVehicles}
                vehicles={availableVehicles}
                loading={vehiclesLoading}
                selectedVehicleIds={selectedVehicleIds}
                onToggleSelect={handleToggleVehicle}
                onToggleSelectAll={handleToggleAllVehicles}
                loadThreshold={loadThreshold}
                confirming={confirming}
            />
        </div>
    );
};

export default PreAssignStep;
