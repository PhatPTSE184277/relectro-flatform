'use client';

import React, { useState } from 'react';
import TrackingProductSkeleton from './TrackingProductSkeleton';
import { formatDate } from '@/utils/FormatDate';
import Pagination from '@/components/ui/Pagination';
import { Eye } from 'lucide-react';

interface TrackingProductListProps {
    products: any[];
    loading: boolean;
    onProductClick: (product: any) => void;
}

const TrackingProductList: React.FC<TrackingProductListProps & { tableRef?: React.Ref<HTMLDivElement> }> = ({ products, loading, onProductClick, tableRef }) => {
    // Remove local page state, expect parent to handle pagination and pass correct products
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                <tr>
                                    <th className='py-3 px-4 text-center' style={{ width: '60px' }}>STT</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '200px' }}>Sản phẩm</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Người gửi</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Ngày thu gom</th>
                                    <th className='py-3 px-4 text-center' style={{ width: '120px' }}>Hành động</th>
                                </tr>
                            </thead>
                        </table>
                        <div className='max-h-78     overflow-y-auto' ref={tableRef}>
                            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <TrackingProductSkeleton key={idx} />
                                        ))
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className='py-8 text-center text-gray-400'>
                                                Không có sản phẩm nào
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product, index) => {
                                            const isLast = index === products.length - 1;
                                            return (
                                                <tr
                                                    key={product.productId}
                                                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}
                                                >
                                                    <td className='py-3 px-4 text-center'>
                                                        <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                            {product.stt}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700'>
                                                        <div className='flex items-center gap-2'>   
                                                            <div>
                                                                <div className='font-medium'>{product.categoryName || 'N/A'}</div>
                                                                <div className='text-xs text-gray-500'>
                                                                    {product.brandName || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700'>
                                                        <div className='flex items-center gap-2'>
                                                            <span>{product.sender?.name || product.userName || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700'>
                                                        <div className='flex items-center gap-2'>
                                                            <span>{formatDate(product.pickUpDate) || 'Chưa có'}</span>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-center align-middle'>
                                                        <div className='flex items-center justify-center h-full'>
                                                            <button
                                                                onClick={() => onProductClick(product)}
                                                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs'
                                                                title='Xem chi tiết'
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingProductList;