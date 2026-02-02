'use client';

import React from 'react';
import Pagination from '@/components/ui/Pagination';
import { PackageType } from '@/types/Package';

interface ProductListProps {
    products: PackageType['products'];
    showPagination?: boolean;
    onPageChange?: (page: number) => void;
    maxHeight?: number;
}

const ProductList: React.FC<ProductListProps> = ({ 
    products,
    showPagination = false,
    onPageChange,
    maxHeight = 300
}) => {
    // Support both array and paginated object
    const productsArray = Array.isArray(products) ? products : products.data;
    const currentPage = !Array.isArray(products) ? products.page : 1;
    const totalPages = !Array.isArray(products) ? products.totalPages : 1;
    const startIndex = !Array.isArray(products) ? (products.page - 1) * products.limit : 0;
    
    return (
        <>
            <div
                className='relative w-full overflow-y-auto'
                style={{ maxHeight }}
            >
                <table className='w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-center w-[5vw] min-w-[5vw]'>STT</th>
                            <th className='py-3 px-4 text-left w-[20vw] min-w-[10vw]'>Danh mục</th>
                            <th className='py-3 px-4 text-left w-[16vw] min-w-[8vw]'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left w-[30vw] min-w-[14vw]'>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsArray.map((product: any, index: number) => {
                            const isLast = index === productsArray.length - 1;
                            const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';

                            return (
                                <tr
                                    key={product.productId}
                                    className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`}
                                    style={{ tableLayout: 'fixed' }}
                                >
                                    <td className='py-3 px-4 text-center w-[5vw] min-w-[5vw]'>
                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold mx-auto'>
                                            {startIndex + index + 1}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 font-medium w-[20vw] min-w-[10vw]'>
                                        <div className='text-gray-900'>
                                            {product.categoryName}
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 text-left text-gray-700 w-[16vw] min-w-[8vw]'>
                                        {product.brandName}
                                    </td>
                                    <td className='py-3 px-4 text-gray-600 text-xs w-[30vw] min-w-[14vw]'>
                                        <div className='line-clamp-2 break-all'>
                                            {product.description || '-'}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {showPagination && onPageChange && totalPages > 1 && (
                <div className='px-4 pb-4 border-t'>
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </>
    );
};

export default ProductList;
