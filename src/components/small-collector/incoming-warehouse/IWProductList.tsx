
import IWProductShow from './IWProductShow';
import IWProductTableSkeleton from './IWProductTableSkeleton';

interface IWProductListProps {
    products: any[];
    loading: boolean;
    onViewDetail: (product: any) => void;
    status?: string;
    currentPage?: number;
    pageSize?: number;
}


import React, { forwardRef } from 'react';

const IWProductList = forwardRef<HTMLDivElement, IWProductListProps>(
    ({
        products,
        loading,
        onViewDetail,
        status,
        currentPage = 1,
        pageSize = 10
    }, ref) => {
        const isReceived = status === 'Nhập kho';
        const startIndex = (currentPage - 1) * pageSize;
        return (
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
                <div className='overflow-x-auto'>
                    <div className='inline-block min-w-full align-middle'>
                        <div className='overflow-hidden'>
                            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                    <tr>
                                        <th className='py-3 px-4 text-center' style={{ width: '60px' }}>STT</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Loại sản phẩm</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '160px' }}>Mã QR</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '140px' }}>Thương hiệu</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '200px' }}>Mô tả</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '120px' }}>{isReceived ? 'Điểm' : 'Điểm ước tính'}</th>
                                        <th className='py-3 px-4 text-center' style={{ width: '100px' }}>Hành động</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className='max-h-55 overflow-y-auto' ref={ref}>
                            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
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
                                            <td colSpan={7} className='text-center py-8 text-gray-400'>
                                                Không có sản phẩm nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

IWProductList.displayName = 'IWProductList';

export default IWProductList;