'use client';

import React from 'react';
import TrackingProductSkeleton from './TrackingProductSkeleton';
import { formatDate } from '@/utils/FormatDate';
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
                <div className='max-h-[59vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[53vh] xl:max-h-[59vh] overflow-y-auto' ref={tableRef}>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                            <tr>
                                <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                <th className='py-3 px-4 text-left w-[18vw]'>Sản phẩm</th>
                                <th className='py-3 px-4 text-left w-[14vw]'>Người gửi</th>
                                <th className='py-3 px-4 text-left w-[14vw]'>Ngày thu gom</th>
                                <th className='py-3 px-4 text-center w-[10vw]'>Hành động</th>
                            </tr>
                        </thead>
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
                                    const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                    return (
                                        <tr
                                            key={product.productId}
                                            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                                        >
                                            <td className='py-3 px-4 text-center w-[5vw]'>
                                                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                    {product.stt}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[18vw]'>
                                                <div className='flex items-center gap-2'>
                                                    <div>
                                                        <div className='font-medium'>{product.categoryName || 'N/A'}</div>
                                                        <div className='text-xs text-gray-500'>
                                                            {product.brandName || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[14vw]'>
                                                <div className='flex items-center gap-2'>
                                                    <span>{product.sender?.name || product.userName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[14vw]'>
                                                <div className='flex items-center gap-2'>
                                                    <span>{formatDate(product.pickUpDate) || 'Chưa có'}</span>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 text-center align-middle w-[10vw]'>
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
    );
};

export default TrackingProductList;