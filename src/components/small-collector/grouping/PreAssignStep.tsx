'use client';

import React from 'react';
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
        <div className='space-y-6'>
            <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Bước 1: Gợi ý gom nhóm
                </h2>
                <p className='text-gray-600'>
                    Hệ thống sẽ tự động gợi ý cách gom nhóm các bưu phẩm dựa
                    trên khả năng tải của phương tiện
                </p>
            </div>

            {/* Load Threshold Setting - Compact */}
            <div className='bg-gray-50 rounded-lg px-4 py-3 mb-4 flex items-center gap-4'>
                <label className='text-sm font-medium text-gray-700 whitespace-nowrap mr-2'>Ngưỡng tải:</label>
                <input
                    type='range'
                    min='50'
                    max='100'
                    value={loadThreshold}
                    onChange={(e) => setLoadThreshold(Number(e.target.value))}
                    className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500 mx-2'
                />
                <span className='text-xl font-bold text-primary-600'>{loadThreshold}%</span>
            </div>

            {/* Action Button */}
            <div className='flex justify-center mb-4'>
                <button
                    onClick={onGetSuggestion}
                    disabled={loading || (products?.length || 0) === 0}
                    className='py-2 px-6 text-base bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer'
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
