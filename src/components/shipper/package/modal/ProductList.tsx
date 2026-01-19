'use client';

import React from 'react';
import { PackageType } from '@/types/Package';

interface ProductListProps {
    products: PackageType['products'];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0'>
            <div className='relative w-full max-h-64 overflow-y-auto'>
                <table className='w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                        <tr>
                            <th className='py-3 px-4 text-center w-16'>STT</th>
                            <th className='py-3 px-4 text-left w-40'>Danh mục</th>
                            <th className='py-3 px-4 text-left w-32'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left w-56'>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => {
                            const isLast = index === products.length - 1;
                            return (
                                <tr
                                    key={product.productId}
                                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}
                                >
                                    <td className='py-3 px-4 text-center w-16'>
                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold mx-auto'>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 font-medium w-40'>
                                        <div className='text-gray-900'>
                                            {product.categoryName}
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 text-left text-gray-700 w-32'>
                                        {product.brandName}
                                    </td>
                                    <td className='py-3 px-4 text-gray-600 text-xs w-56'>
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
        </div>
    );
};

export default ProductList;
