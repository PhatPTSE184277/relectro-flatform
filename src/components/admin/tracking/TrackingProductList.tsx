'use client';

import React, { useState } from 'react';
import { formatDate } from '@/utils/FormateDate';
import Pagination from '@/components/ui/Pagination';
import { Eye } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';

interface TrackingProductListProps {
    products: any[];
    loading: boolean;
    onProductClick: (product: any) => void;
}

const TrackingProductList: React.FC<TrackingProductListProps> = ({ products, loading, onProductClick }) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const filteredProducts = products.filter((product) => {
        const matchSearch =
            product.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
            product.brandName?.toLowerCase().includes(search.toLowerCase()) ||
            product.sender?.name?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div>
            {/* Search */}
            <div className='mb-4'>
                <SearchBox
                    value={search}
                    onChange={setSearch}
                    placeholder='Tìm kiếm sản phẩm...'
                />
            </div>

            {/* Product Table */}
            {loading ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                    <div className='animate-pulse'>Đang tải sản phẩm...</div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Không có sản phẩm nào
                </div>
            ) : (
                <>
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm text-gray-800'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left'>Sản phẩm</th>
                                        <th className='py-3 px-4 text-left'>Người gửi</th>
                                        <th className='py-3 px-4 text-left'>Ngày thu gom</th>
                                        <th className='py-3 px-4 text-left'>Trạng thái</th>
                                        <th className='py-3 px-4 text-center'>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product, index) => {
                                        const isLast = index === paginatedProducts.length - 1;
                                        const stt = (page - 1) * itemsPerPage + index + 1;
                                        return (
                                            <tr
                                                key={product.productId}
                                                className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}
                                            >
                                                <td className='py-3 px-4 text-center'>
                                                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                        {stt}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <div className='flex items-center gap-2'>   
                                                        <div>
                                                            <div className='font-medium'>{product.categoryName || 'N/A'}</div>
                                                            <div className='text-xs text-gray-500'>
                                                                {product.brandName || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <div className='flex items-center gap-2'>
                                                        <span>{product.sender?.name || product.userName || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <div className='flex items-center gap-2'>
                                                        <span>{formatDate(product.pickUpDate) || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                                        product.status === 'Đã thu gom'
                                                            ? 'bg-green-100 text-green-700'
                                                            : product.status === 'Đang vận chuyển'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : product.status === 'Chờ thu gom'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : product.status === 'Hủy bỏ'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 text-center align-middle'>
                                                    <div className='flex items-center justify-center h-full'>
                                                        <button
                                                            onClick={() => onProductClick(product)}
                                                            className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs'
                                                            title='Xem chi tiết'
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination UI */}
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
};

export default TrackingProductList;