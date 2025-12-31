import React from 'react';
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

const IWProductList: React.FC<IWProductListProps> = ({
    products,
    loading,
    onViewDetail,
    status,
    currentPage = 1,
    pageSize = 10
}) => {
    const isReceived = status === 'Nhập kho';
    const startIndex = (currentPage - 1) * pageSize;
    
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Loại sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Mã QR</th>
                            <th className='py-3 px-4 text-left'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left'>Mô tả</th>
                            <th className='py-3 px-4 text-left'>{isReceived ? 'Điểm' : 'Điểm ước tính'}</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
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
                                <td colSpan={7} className='text-center py-8 text-gray-400'>
                                    Không có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IWProductList;