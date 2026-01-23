import React, { forwardRef } from 'react';
import AssignedProductShow from './AssignProductShow';
import AssignedProductSkeleton from './AssignProductSkeleton';
import { useAssignProductContext } from '@/contexts/admin/AssignProductContext';

interface AssignedProductListProps {
    products: any[];
    loading: boolean;
}


const AssignProductList = forwardRef<HTMLDivElement, AssignedProductListProps & { page: number; pageSize: number }>(
    ({ products, loading, page, pageSize }, ref) => {
        return (
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
                <div className='overflow-x-auto'>
                    <div className='inline-block min-w-full align-middle'>
                        <div className='max-h-100 overflow-y-auto' ref={ref}>
                            <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-50'>Sản phẩm</th>
                                        <th className='py-3 px-4 text-left w-45'>Khách hàng</th>
                                        <th className='py-3 px-4 text-left w-[420px]'>Địa chỉ</th>
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
                </div>
            </div>
        );
    }
);

AssignProductList.displayName = "AssignProductList";

const AssignProductListWrapper = forwardRef<HTMLDivElement, AssignedProductListProps>((props, ref) => {
    const { page, pageSize } = useAssignProductContext();
    return <AssignProductList {...props} page={page} pageSize={pageSize} ref={ref} />;
});

AssignProductListWrapper.displayName = "AssignProductList";

export default AssignProductListWrapper;
