'use client';

import React, { useState, useEffect } from 'react';
// CustomNumberInput intentionally removed — render read-only value when disabled
import ProductList from './ProductList';
import VehicleSelectionModal from './modal/VehicleSelectionModal';
import DeadlineProductUpdateModal from './modal/DeadlineProductUpdateModal';
import { useGroupingContext } from '@/contexts/collection-point/GroupingContext';
import { Vehicle } from '@/services/collection-point/GroupingService';
import { Loader2 } from 'lucide-react';
import Toast from '@/components/ui/Toast';

interface PreAssignStepProps {
    loading: boolean;
    suggestionLoading?: boolean;
    products: any[];
    totalItems?: number;
    allProductIds?: string[]; // All product IDs from API
    loadThreshold: number;
    setLoadThreshold: (value: number) => void;
    onGetSuggestion: (workDate: string, vehicleIds: string[], selectedProductIds: string[]) => void;
    onReject?: () => void;
    rejectLoading?: boolean;
    onSkip?: () => void;
    page?: number;
    itemsPerPage?: number;
    workDate: string;
    onRefreshData?: () => Promise<void>;
}

const PreAssignStep: React.FC<PreAssignStepProps> = ({
    loading,
    suggestionLoading = false,
    products,
    allProductIds,
    loadThreshold,
    onGetSuggestion,
    // onReject,
    // rejectLoading = false,
    page = 1,
    itemsPerPage = 10,
    workDate,
    onRefreshData
}) => {
    const {
        availableVehicles,
        vehiclesLoading,
        fetchAvailableVehicles,
        preAssignResult,
        getPreAssignSuggestion,
        forceReceiveOverdue
    } = useGroupingContext();
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
    const [confirming, setConfirming] = useState(false);
    const [selectedDeadlineProduct, setSelectedDeadlineProduct] = useState<any | null>(null);
    const [showDeadlineEditModal, setShowDeadlineEditModal] = useState(false);
    const [confirmingDeadlineEdit, setConfirmingDeadlineEdit] = useState(false);
    const [editingDeadlineProductId, setEditingDeadlineProductId] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        open: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        open: false,
        type: 'success',
        message: ''
    });

    const hasNoVehicle = !vehiclesLoading && availableVehicles.length === 0;

    useEffect(() => {
        setSelectedProductIds([]);
        setSelectedVehicleIds([]);
        setShowVehicleModal(false);
    }, [workDate]);

    useEffect(() => {
        fetchAvailableVehicles(workDate);
    }, [fetchAvailableVehicles, workDate]);

    useEffect(() => {
        if (products.length === 0 || availableVehicles.length === 0) return;

        const suggestedVehicleIds = (preAssignResult?.days || [])
            .map((day: any) => String(day?.suggestedVehicle?.id || ''))
            .filter(Boolean);

        if (suggestedVehicleIds.length > 0) {
            setSelectedVehicleIds(suggestedVehicleIds);
            return;
        }

        // Auto select all vehicles when loaded
        setSelectedVehicleIds(availableVehicles.map((v: Vehicle) => v.vehicleId));
    }, [availableVehicles, preAssignResult, products.length]);

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

    const handleShowModal = async () => {
        if (selectedProductIds.length === 0 || hasNoVehicle) return;

        try {
            await getPreAssignSuggestion(
                workDate,
                availableVehicles.map((vehicle: Vehicle) => vehicle.vehicleId),
                loadThreshold,
                selectedProductIds
            );
            setShowVehicleModal(true);
        } catch (error) {
            console.error('Error getting preassign suggestion before opening modal:', error);
        }
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
                selectedProductIds
            );
            setShowVehicleModal(false);
        } catch (error) {
            console.error('Error getting suggestion:', error);
        } finally {
            setConfirming(false);
        }
    };

    const handleOpenDeadlineEditModal = (product: any) => {
        const productId = String(product?.productId || product?.id || '');
        setEditingDeadlineProductId(productId || null);
        setSelectedDeadlineProduct(product);
        setShowDeadlineEditModal(true);
    };

    const handleCloseDeadlineEditModal = () => {
        setShowDeadlineEditModal(false);
        setSelectedDeadlineProduct(null);
        setEditingDeadlineProductId(null);
    };

    const handleConfirmDeadlineEdit = async (payload: {
        productId: string;
        qrCode: string;
        description: string;
    }) => {
        setConfirmingDeadlineEdit(true);
        try {
            await forceReceiveOverdue(payload);
            if (onRefreshData) {
                await onRefreshData();
            }
            setToast({
                open: true,
                type: 'success',
                message: 'Cập nhật sản phẩm thành công.'
            });
            handleCloseDeadlineEditModal();
        } catch (error: any) {
            console.error('Error force receiving overdue product from pre-assign step:', error);
            setToast({
                open: true,
                type: 'error',
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Không thể cập nhật sản phẩm. Vui lòng thử lại.'
            });
        } finally {
            setConfirmingDeadlineEdit(false);
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
                    <label className='text-sm font-bold text-gray-700 whitespace-nowrap'>Ngưỡng tải:</label>
                    <div className='w-16 px-2 py-1 border border-primary-200 rounded-md text-primary-600 font-bold bg-white opacity-50 cursor-not-allowed flex items-center justify-center'>
                        {loadThreshold}
                    </div>
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
                        disabled={loading || selectedProductIds.length === 0 || hasNoVehicle}
                        className='py-2 px-4 text-base bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap'
                    >
                        {suggestionLoading ? <Loader2 size={16} className="animate-spin" /> : `Phân chia${selectedProductIds.length > 0 ? ` (${selectedProductIds.length})` : ''}`}
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
                showAction={hasNoVehicle}
                actionLoadingProductId={editingDeadlineProductId}
                onAction={handleOpenDeadlineEditModal}
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
                suggestedPlateNumbers={(preAssignResult?.days || [])
                    .map((day: any) => day?.suggestedVehicle?.plate_Number)
                    .filter(Boolean)}
                suggestionMessage={
                    (preAssignResult?.days || []).length > 0
                        ? `Gợi ý: Hệ thống đề xuất ${(preAssignResult?.days || []).length} xe dựa trên số sản phẩm`
                        : undefined
                }
            />

            {showDeadlineEditModal && selectedDeadlineProduct && (
                <DeadlineProductUpdateModal
                    key={String(selectedDeadlineProduct?.productId || selectedDeadlineProduct?.id || 'deadline-edit')}
                    open={showDeadlineEditModal}
                    product={selectedDeadlineProduct}
                    loading={confirmingDeadlineEdit}
                    onClose={handleCloseDeadlineEditModal}
                    onConfirm={handleConfirmDeadlineEdit}
                />
            )}

            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            />
        </div>
    );
};

export default PreAssignStep;
