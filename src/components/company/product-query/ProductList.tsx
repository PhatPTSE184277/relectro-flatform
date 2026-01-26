import React, { useRef, useEffect } from 'react';
import ProductShow from './ProductShow';
import ProductSkeleton from './ProductSkeleton';

interface ProductListProps {
    products: any[];
    loading: boolean;
    page?: number;
    itemsPerPage?: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page = 1, itemsPerPage = 10 }) => {
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]);

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-115 overflow-y-auto' ref={bodyRef}>
                            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-60'>Sản phẩm</th>
                                        <th className='py-3 px-4 text-left w-60'>Người gửi</th>
                                        <th className='py-3 px-4 text-left w-88'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-right w-40'>Khoảng cách(KM)</th>
                                        <th className='py-3 px-4 text-right w-32'>Khối lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <ProductSkeleton key={idx} />
                                        ))
                                    ) : products?.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className='text-center py-8 text-gray-400'>
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
                </div>
            </div>
        </div>
    );
};

export default ProductList;
