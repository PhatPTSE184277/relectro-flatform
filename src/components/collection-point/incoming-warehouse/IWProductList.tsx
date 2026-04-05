import IWProductShow from './IWProductShow';
import IWProductTableSkeleton from './IWProductTableSkeleton';

import React, { forwardRef } from 'react';
interface IWProductListProps {
    products: any[];
    loading: boolean;
    onViewDetail: (product: any) => void;
    status?: string;
    currentPage?: number;
    pageSize?: number;
}

const IWProductList = forwardRef<HTMLDivElement, IWProductListProps>(
    (
        {
            products,
            loading,
            onViewDetail,
            status,
            currentPage = 1,
            pageSize = 10
        }
        , ref
    ) => {
        const startIndex = (currentPage - 1) * pageSize;
        return (
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
                <div ref={ref} className='overflow-x-auto max-h-[44vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[45vh] xl:max-h-[44vh] overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                            <tr>
                                <th className='py-3 px-4 text-center w-[5vw] min-w-10'>
                                    STT
                                </th>
                                <th className='py-3 px-4 text-left w-[14vw] min-w-20'>
                                    Loại sản phẩm
                                </th>
                                {/* QR column removed */}
                                <th className='py-3 px-4 text-left w-[12vw] min-w-20'>
                                    Thương hiệu
                                </th>
                                <th className='py-3 px-4 text-left w-[18vw] min-w-30'>
                                    Mô tả
                                </th>
                                <th className='py-3 px-4 text-center w-[7vw] min-w-12'>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <IWProductTableSkeleton key={idx} />
                                ))
                            ) : products.length > 0 ? (
                                products.map((product, idx) => (
                                    <IWProductShow
                                        key={product.productId}
                                        product={product}
                                        onView={() => onViewDetail(product)}
                                        status={status}
                                        isLast={idx === products.length - 1}
                                        stt={startIndex + idx + 1}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className='text-center py-8 text-gray-400'
                                    >
                                        Không có sản phẩm nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
);

IWProductList.displayName = 'IWProductList';

export default IWProductList;
