import React from 'react';
import ProductShow from './ProductShow';

interface ProductListProps {
    products: any[];
    loading: boolean;
    scpName: string;
    page: number;
    itemsPerPage: number;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    loading,
    page,
    itemsPerPage
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[56vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[48vh] xl:max-h-[56vh] overflow-y-auto w-full'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[15vw]'>Danh mục - Thương hiệu</th>
                                        <th className='py-3 px-4 text-left w-[20vw]'>Địa chỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-primary-100'>
                                                <td className='py-3 px-4 text-center w-[6vw]'>
                                                    <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                                                </td>
                                                <td className='py-3 px-4 w-[15vw]'>
                                                    <div className='h-4 bg-gray-200 rounded w-32 animate-pulse mb-2' />
                                                    <div className='h-3 bg-gray-200 rounded w-24 animate-pulse' />
                                                </td>
                                                <td className='py-3 px-4 w-[20vw]'>
                                                    <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                                                </td>
                                            </tr>
                                        ))
                                    ) : products.length > 0 ? (
                                        products.map((product, idx) => (
                                            <ProductShow
                                                key={product.productId}
                                                product={product}
                                                stt={(page - 1) * itemsPerPage + idx + 1}
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
        </div>
    );
};

export default ProductList;
