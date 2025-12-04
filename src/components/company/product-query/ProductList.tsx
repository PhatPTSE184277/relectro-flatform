import React from 'react';
import ProductShow from './ProductShow';
import ProductSkeleton from './ProductSkeleton';

interface ProductListProps {
    products: any[];
    loading: boolean;
    page?: number;
    itemsPerPage?: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page = 1, itemsPerPage = 10 }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-16'>STT</th>
                            <th className='py-3 px-4 text-left'>Người gửi</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                            <th className='py-3 px-4 text-left'>Khoảng cách</th>
                            <th className='py-3 px-4 text-left'>Khối lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <ProductSkeleton key={idx} />
                            ))
                        ) : products?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-400'>
                                    Không có sản phẩm nào.
                                </td>
                            </tr>
                        ) : (
                            products?.map((product, idx) => (
                                <ProductShow 
                                    key={product.productId} 
                                    product={product} 
                                    isLast={idx === products.length - 1}
                                    stt={(page - 1) * itemsPerPage + idx + 1}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
