import React from 'react';
import IWProductShow from './IWProductShow';
import IWProductTableSkeleton from './IWProductTableSkeleton';

interface IWProductListProps {
    products: any[];
    loading: boolean;
    onViewDetail: (product: any) => void;
    onReceive: (qrCode: string) => void;
}

const IWProductList: React.FC<IWProductListProps> = ({
    products,
    loading,
    onViewDetail,
    onReceive
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>Ảnh</th>
                            <th className='py-3 px-4 text-left'>Tên sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Mã QR</th>
                            <th className='py-3 px-4 text-left'>Điểm thu gom</th>
                            <th className='py-3 px-4 text-left'>Ngày thu gom</th>
                            <th className='py-3 px-4 text-left'>Trạng thái</th>
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
                                    key={product.id || idx}
                                    product={product}
                                    onView={() => onViewDetail(product)}
                                    onReceive={() => onReceive(product.qrCode)}
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