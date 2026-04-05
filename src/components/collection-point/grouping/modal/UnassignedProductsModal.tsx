import React, { useState } from 'react';
import { X, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import ProductList from '../ProductList';
import Pagination from '@/components/ui/Pagination';
import UnassignedProductsFilter, { UnassignedProductsReasonOption } from './UnassignedProductsFilter';
import ConfirmCloseModal from './ConfirmCloseModal';

interface UnassignedProductsModalProps {
    open: boolean;
    onClose: () => void;
    products: any[];
    loading: boolean;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    totalCount: number;
    reasonOptions: UnassignedProductsReasonOption[];
    selectedReason: string;
    onReasonChange: (reason: string) => void;
    deadlineUnassignedCount?: number;
    summaryMessage?: string;
    onAddRemainingVehicles: () => void;
    addVehiclesLoading?: boolean;
}

const UnassignedProductsModal: React.FC<UnassignedProductsModalProps> = ({
    open,
    onClose,
    products,
    loading,
    totalPages,
    currentPage,
    onPageChange,
    totalCount,
    reasonOptions,
    selectedReason,
    onReasonChange,
    deadlineUnassignedCount = 0,
    summaryMessage,
    onAddRemainingVehicles,
    addVehiclesLoading = false
}) => {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const handleRequestClose = () => {
        if (deadlineUnassignedCount > 0) {
            setShowCloseConfirm(true);
            return;
        }

        onClose();
    };

    const handleConfirmClose = () => {
        setShowCloseConfirm(false);
        onClose();
    };

    const handleCancelClose = () => {
        setShowCloseConfirm(false);
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={handleRequestClose}></div>

            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <AlertTriangle className='text-white' size={20} />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>Sản phẩm chưa được phân chia</h2>
                        </div>
                    </div>
                    <button
                        onClick={handleRequestClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Summary */}
                <div className='px-6 py-4 bg-primary-50 border-b border-primary-100 space-y-3'>
                    <div className='flex items-center justify-between gap-2 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <AlertTriangle size={16} className='text-primary-600' />
                            <span className='text-sm font-medium text-gray-700'>
                                {summaryMessage || (
                                    <>
                                        Tổng cộng: <span className='font-bold text-primary-600'>{totalCount}</span> sản phẩm chưa được phân chia
                                    </>
                                )}
                            </span>
                        </div>
                        <button
                            onClick={onAddRemainingVehicles}
                            disabled={addVehiclesLoading}
                            className={`px-4 py-2 rounded-lg border border-primary-200 bg-white text-primary-700 text-sm font-medium transition flex items-center gap-2 cursor-pointer ${addVehiclesLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-50'}`}
                        >
                            {addVehiclesLoading ? (
                                <Loader2 size={16} className='animate-spin' />
                            ) : (
                                <Plus size={16} />
                            )}
                            Thêm xe còn lại
                        </button>
                    </div>
                    <div>
                        <UnassignedProductsFilter
                            options={reasonOptions}
                            selectedReason={selectedReason}
                            onChangeReason={onReasonChange}
                        />
                    </div>
                </div>

                {/* Product List */}
                <div className='flex-1 overflow-hidden p-6'>
                    <ProductList 
                        products={products}
                        loading={loading}
                        page={currentPage}
                        itemsPerPage={10}
                        showCheckbox={false}
                        maxHeight={50}
                    />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='px-6 pb-6'>
                        <Pagination
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}

            </div>
            <ConfirmCloseModal
                open={showCloseConfirm}
                deadlineUnassignedCount={deadlineUnassignedCount}
                onConfirm={handleConfirmClose}
                onClose={handleCancelClose}
            />
        </div>
    );
};

export default UnassignedProductsModal;
