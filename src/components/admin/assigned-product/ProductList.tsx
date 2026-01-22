import React from 'react';
import ProductShow from './ProductShow';
import CompanySkeleton from './CompanySkeleton';

interface ProductListProps {
    products: any[];
    loading: boolean;
    page?: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page = 1 }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='max-h-108 overflow-y-auto'>
                        <table className='w-full text-sm text-gray-800 table-fixed'>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                <tr>
                                    <th className='py-3 px-4 text-center w-16'>STT</th>
                                    <th className='py-3 px-4 text-left w-64'>Người gửi</th>
                                    <th className='py-3 px-4 text-left'>Địa chỉ</th>
                                    <th className='py-3 px-4 text-right w-64'>Khối lượng / Kích thước</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <CompanySkeleton key={idx} />
                                    ))
                                ) : products.length > 0 ? (
                                    products.map((product, idx) => (
                                        <ProductShow
                                            key={product.productId}
                                            product={product}
                                            stt={(page - 1) * 10 + idx + 1}
                                            isLast={idx === products.length - 1}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='text-center py-8 text-gray-400'>
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
};

export default ProductList;
