'use client';

import React, { useState } from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import ProductList from './ProductList';

interface PreAssignStepProps {
    loading: boolean;
    products: any[];
    totalItems?: number;
    allProductIds?: string[]; // All product IDs from API
    loadThreshold: number;
    setLoadThreshold: (value: number) => void;
    onGetSuggestion: (selectedProductIds?: string[]) => void;
    onSkip?: () => void;
    page?: number;
    itemsPerPage?: number;
}

const PreAssignStep: React.FC<PreAssignStepProps> = ({
    loading,
    products,
    allProductIds,
    loadThreshold,
    setLoadThreshold,
    onGetSuggestion,
    page = 1,
    itemsPerPage = 10
}) => {
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

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

    const handleGetSuggestion = () => {
        onGetSuggestion(selectedProductIds.length > 0 ? selectedProductIds : undefined);
    };
    return (
        <div className='space-y-4'>
            {/* Top controls: label, threshold, button all in one row */}
            <div className='flex flex-col md:flex-row md:items-center md:gap-4 gap-2 bg-gray-50 rounded-lg px-4 py-3 mb-2'>
                <h2 className='text-lg font-bold text-gray-900 mb-0 md:mb-0 md:mr-4 whitespace-nowrap'>
                    Bước 1: Hệ thống sẽ tự động gom nhóm
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
                    onClick={handleGetSuggestion}
                    disabled={loading || selectedProductIds.length === 0}
                    className='py-2 px-4 text-base bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer ml-0 md:ml-4 whitespace-nowrap'
                >
                    {loading ? 'Đang xử lý...' : `Gom nhóm${selectedProductIds.length > 0 ? ` (${selectedProductIds.length})` : ''}`}
                </button>
            </div>

            {/* Pending Products List */}
            <ProductList 
                products={products} 
                loading={loading} 
                page={page} 
                itemsPerPage={itemsPerPage}
                showCheckbox={true}
                selectedProductIds={selectedProductIds}
                onToggleSelect={handleToggleSelect}
                onToggleAll={handleToggleAll}
                maxHeight={54}
            />
        </div>
    );
};

export default PreAssignStep;
