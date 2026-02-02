import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import ProductList from '../ProductList';
import Pagination from '@/components/ui/Pagination';

interface UnassignedProductsModalProps {
    open: boolean;
    onClose: () => void;
    products: any[];
    loading: boolean;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    totalCount: number;
}

const UnassignedProductsModal: React.FC<UnassignedProductsModalProps> = ({
    open,
    onClose,
    products,
    loading,
    totalPages,
    currentPage,
    onPageChange,
    totalCount
}) => {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose}></div>

            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <AlertTriangle className='text-white' size={20} />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-gray-900'>Sản phẩm chưa được phân chia</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-white/50 rounded-full transition-colors'
                    >
                        <X size={24} className='text-gray-600' />
                    </button>
                </div>

                {/* Summary */}
                <div className='px-6 py-4 bg-primary-50 border-b border-primary-100'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle size={16} className='text-primary-600' />
                        <span className='text-sm font-medium text-gray-700'>
                            Tổng cộng: <span className='font-bold text-primary-600'>{totalCount}</span> sản phẩm chưa được gom nhóm
                        </span>
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
        </div>
    );
};

export default UnassignedProductsModal;
