'use client';

import React from 'react';
import { PackageType } from '@/types/Package';

interface ProductListProps {
    products: PackageType['products'];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0'>
            <table className='w-full text-sm text-gray-800'>
                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                    <tr>
                        <th className='py-3 px-4 text-left' style={{ width: '60px' }}>STT</th>
                        <th className='py-3 px-4 text-left' style={{ width: '200px' }}>Danh mục</th>
                        <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Thương hiệu</th>
                        <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Ghi chú</th>
                    </tr>
                </thead>
            </table>
            <div className='max-h-64 overflow-y-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <tbody>
                        {products.map((product, index) => {
                            const isLast = index === products.length - 1;
                            return (
                                <tr
                                    key={product.productId}
                                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}
                                    style={{ tableLayout: 'fixed' }} // Ensure fixed layout for body rows
                                >
                                    <td className='py-3 px-4 font-medium' style={{ width: '60px' }}>
                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 font-medium' style={{ width: '200px' }}>
                                        <div className='text-gray-900'>
                                            {product.categoryName}
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 text-gray-700' style={{ width: '180px' }}>
                                        {product.brandName}
                                    </td>
                                    <td className='py-3 px-4 text-gray-600 text-xs max-w-xs truncate' style={{ width: '180px' }}>
                                        {product.description || '-'}
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
