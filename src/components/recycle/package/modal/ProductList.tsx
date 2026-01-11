'use client';

import React from 'react';
import { PackageType } from '@/types/Package';

interface ProductListProps {
    products: PackageType['products'];
    showStatus?: boolean;
    checkedProducts?: Set<string>;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    showStatus = false,
    checkedProducts
}) => {
    return (
       <div className='bg-white rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>STT</th>
                            <th className='py-3 px-4 text-left'>Danh mục</th>
                            <th className='py-3 px-4 text-left'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left'>Ghi chú</th>
                            {showStatus && (
                                <th className='py-3 px-4 text-center'>Trạng thái</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => {
                            const isLast = index === products.length - 1;
                            const isAlreadyChecked = product.isChecked;
                            const isNewlyScanned = checkedProducts && product.qrCode && checkedProducts.has(product.qrCode);
                            const isChecked = isAlreadyChecked || isNewlyScanned;

                            return (
                                <tr
                                    key={product.productId}
                                    className={`${!isLast ? 'border-b border-primary-100' : ''} transition-colors ${
                                        showStatus && checkedProducts && isChecked
                                            ? 'bg-green-50'
                                            : 'hover:bg-primary-50/40'
                                    }`}
                                >
                                    <td className='py-3 px-4 font-medium'>
                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 font-medium'>
                                        <div className='text-gray-900'>{product.categoryName}</div>
                                    </td>
                                    <td className='py-3 px-4 text-gray-700'>{product.brandName}</td>
                                    <td className='py-3 px-4 text-gray-600 text-xs max-w-xs truncate'>
                                        {product.description || '-'}
                                    </td>
                                    {showStatus && (
                                        <td className='py-3 px-4 text-center'>
                                            {isChecked ? (
                                                <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700'>
                                                    ✓ Đã quét
                                                </span>
                                            ) : (
                                                <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700'>
                                                    Chưa quét
                                                </span>
                                            )}
                                        </td>
                                    )}
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
