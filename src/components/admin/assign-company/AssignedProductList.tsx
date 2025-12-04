import React from 'react';
import AssignedProductShow from './AssignedProductShow';
import AssignedProductSkeleton from './AssignedProductSkeleton';
import { useAssignProductContext } from '@/contexts/admin/AssignProductContext';

interface AssignedProductListProps {
    products: any[];
    loading: boolean;
}

const EnhancedAssignedProductList: React.FC<AssignedProductListProps> = (props) => {
    const { page, pageSize } = useAssignProductContext();
    return <AssignedProductListInner {...props} page={page} pageSize={pageSize} />;
};

const AssignedProductListInner: React.FC<AssignedProductListProps & { page: number; pageSize: number }> = ({ products, loading, page, pageSize }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Khách hàng</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <AssignedProductSkeleton key={idx} />
                            ))
                        ) : products.length > 0 ? (
                            products.map((product, idx) => (
                                <AssignedProductShow
                                    key={product.productId}
                                    product={product}
                                    isLast={idx === products.length - 1}
                                    index={(page - 1) * pageSize + idx}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='text-center py-8 text-gray-400'>
                                    Không có sản phẩm nào được phân công cho ngày này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnhancedAssignedProductList;
