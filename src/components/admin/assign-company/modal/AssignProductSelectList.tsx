import React from 'react';

interface Product {
    productId: string;
    postId?: string;
    productName: string;
    userName: string;
    address: string;
}

interface AssignProductSelectListProps {
    products: Product[];
    selectedProductIds: string[];
    loading: boolean;
    onToggleProduct: (productId: string) => void;
    onToggleAllCurrentPage: () => void;
    page: number;
    pageSize: number;
}

const AssignProductSelectList: React.FC<AssignProductSelectListProps> = ({
    products,
    selectedProductIds,
    loading,
    page,
    pageSize
}) => {
    // Kiểm tra tất cả sản phẩm trên trang hiện tại đã được chọn chưa
    const allCurrentPageSelected = products.length > 0 && products.every(p => selectedProductIds.includes(p.productId));
    const disableCheckbox = true;
    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                        <tr>
                            <th className='py-3 px-4 text-left'>
                                <input
                                    type='checkbox'
                                    checked={allCurrentPageSelected}
                                    disabled={disableCheckbox}
                                    className='w-4 h-4 text-primary-600 rounded cursor-not-allowed bg-gray-100'
                                    aria-label='Chọn/Bỏ chọn tất cả trang này'
                                />
                            </th>
                            <th className='py-3 px-4 text-left'>STT</th>
                            <th className='py-3 px-4 text-left'>Tên sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Khách hàng</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <tr key={idx} className='border-b border-gray-100'>
                                    <td className='py-3 px-4'>
                                        <div className='w-4 h-4 bg-gray-200 rounded animate-pulse' />
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='w-6 h-6 rounded-full bg-gray-200 animate-pulse mx-auto' />
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                                    </td>
                                </tr>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product, index) => {
                                const isSelected = selectedProductIds.includes(product.productId);
                                const isLast = index === products.length - 1;
                                return (
                                    <tr
                                        key={product.productId}
                                        className={`${!isLast ? 'border-b border-primary-100' : ''} ${isSelected ? 'bg-primary-50' : ''}`}
                                    >
                                        <td className='py-3 px-4'>
                                            <input
                                                type='checkbox'
                                                checked={isSelected}
                                                disabled={disableCheckbox}
                                                className='w-4 h-4 text-primary-600 rounded cursor-not-allowed bg-gray-100'
                                            />
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span className='w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-semibold'>
                                                {(page - 1) * pageSize + index + 1}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 font-medium text-gray-900'>
                                            {product.productName || <span className='text-gray-400'>Chưa có tên</span>}
                                        </td>
                                        <td className='py-3 px-4 text-gray-700'>
                                            {product.userName}
                                        </td>
                                        <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                            <div className='line-clamp-2'>
                                                {product.address}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-400'>
                                    Không có sản phẩm nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignProductSelectList;
