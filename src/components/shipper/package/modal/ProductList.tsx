'use client';

import React from 'react';
import { PackageType } from '@/types/Package';

interface ProductListProps {
    products: PackageType['products'];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className='bg-white rounded-xl shadow-sm border border-primary-100'>
            <div className='overflow-y-auto max-h-64'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-primary-50 text-gray-700 uppercase text-xs font-semibold border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-left'>STT</th>
                            <th className='py-3 px-4 text-left'>Danh mục</th>
                            <th className='py-3 px-4 text-left'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left'>Ghi chú</th>
                            <th className='py-3 px-4 text-left'>QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => {
                            const isLast = index === products.length - 1;
                            return (
                                <tr
                                    key={product.productId}
                                    className={`${
                                        !isLast ? 'border-b border-primary-100' : ''
                                    } hover:bg-primary-50/40 transition-colors`}
                                >
                                    <td className='py-3 px-4 font-medium'>
                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 font-medium'>
                                        <div className='text-gray-900'>
                                            {product.categoryName}
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 text-gray-700'>
                                        {product.brandName}
                                    </td>
                                    <td className='py-3 px-4 text-gray-600 text-xs max-w-xs truncate'>
                                        {product.description || '-'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-400 font-mono text-xs'>
                                        {product.qrCode || '-'}
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
