'use client';

import React from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import ProductList from './ProductList';

interface PreAssignStepProps {
    loading: boolean;
    products: any[];
    loadThreshold: number;
    setLoadThreshold: (value: number) => void;
    onGetSuggestion: () => void;
    page?: number;
    itemsPerPage?: number;
}

const PreAssignStep: React.FC<PreAssignStepProps> = ({
    loading,
    products,
    loadThreshold,
    setLoadThreshold,
    onGetSuggestion,
    page = 1,
    itemsPerPage = 10
}) => {
    return (
        <div className='space-y-4'>
            {/* Top controls: label, threshold, button all in one row */}
            <div className='flex flex-col md:flex-row md:items-center md:gap-4 gap-2 bg-gray-50 rounded-lg px-4 py-3 mb-2'>
                <h2 className='text-lg font-bold text-gray-900 mb-0 md:mb-0 md:mr-4 whitespace-nowrap'>
                    Bước 1: Hệ thống sẽ tự động gợi ý cách gom nhóm
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
                <button
                    onClick={onGetSuggestion}
                    disabled={loading || (products?.length || 0) === 0}
                    className='py-2 px-4 text-base bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer ml-0 md:ml-4'
                >
                    {loading ? 'Đang xử lý...' : 'Lấy gợi ý gom nhóm'}
                </button>
            </div>

            {/* Pending Products List */}
            <ProductList products={products} loading={loading} page={page} itemsPerPage={itemsPerPage} />
        </div>
    );
};

export default PreAssignStep;
