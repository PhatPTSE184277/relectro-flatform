'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { filterProducts } from '@/services/admin/TrackingService';
import { formatDate } from '@/utils/FormateDate';
import SearchBox from '@/components/ui/SearchBox';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import Pagination from '@/components/ui/Pagination';

interface ProductListProps {
    companyId: string;
    onProductClick: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ companyId, onProductClick }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null,
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [companyId, dateRange, page]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
                collectionCompanyId: companyId,
            };

            if (dateRange.from) {
                params.fromDate = dateRange.from.toISOString().split('T')[0];
            }
            if (dateRange.to) {
                params.toDate = dateRange.to.toISOString().split('T')[0];
            }

            const data = await filterProducts(params);
            setProducts(data.data || data || []);
            if (data.totalPages) setTotalPages(data.totalPages);
            else setTotalPages(1);
        } catch (err) {
            console.error('Error fetching products:', err);
            setProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchSearch =
            product.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
            product.brandName?.toLowerCase().includes(search.toLowerCase()) ||
            product.sender?.name?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                Danh sách sản phẩm ({filteredProducts.length})
            </h2>

            {/* Filters */}
            <div className='mb-4 space-y-3'>
                <SearchBox
                    value={search}
                    onChange={setSearch}
                    placeholder='Tìm kiếm sản phẩm...'
                />
                <CustomDateRangePicker
                    fromDate={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
                    toDate={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
                    onFromDateChange={(dateStr) => {
                        setDateRange((prev) => ({ ...prev, from: dateStr ? new Date(dateStr) : null }));
                    }}
                    onToDateChange={(dateStr) => {
                        setDateRange((prev) => ({ ...prev, to: dateStr ? new Date(dateStr) : null }));
                    }}
                />
            </div>

            {/* Product List */}
            {loading ? (
                <div className='text-center py-12 text-gray-500'>Đang tải...</div>
            ) : filteredProducts.length === 0 ? (
                <div className='text-center py-12 text-gray-500'>Không có sản phẩm nào</div>
            ) : (
                <>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                <tr>
                                    <th className='py-3 px-4 text-left'>STT</th>
                                    <th className='py-3 px-4 text-left'>Danh mục</th>
                                    <th className='py-3 px-4 text-left'>Thương hiệu</th>
                                    <th className='py-3 px-4 text-left'>Người gửi</th>
                                    <th className='py-3 px-4 text-left'>Ngày thu gom</th>
                                    <th className='py-3 px-4 text-left'>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => {
                                    const isLast = index === filteredProducts.length - 1;
                                    return (
                                        <tr
                                            key={product.productId}
                                            onClick={() => onProductClick(product)}
                                            className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors cursor-pointer`}
                                        >
                                            <td className='py-3 px-4'>
                                                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold'>
                                                    {index + 1 + (page - 1) * 20}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-2'>
                                                    <Tag size={16} className='text-primary-500' />
                                                    <span className='font-medium text-gray-900'>
                                                        {product.categoryName || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700'>
                                                {product.brandName || 'N/A'}
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-2'>
                                                    <User size={16} className='text-gray-400' />
                                                    <span className='text-gray-700'>
                                                        {product.sender?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-2'>
                                                    <Calendar size={16} className='text-gray-400' />
                                                    <span className='text-gray-700'>
                                                        {product.pickUpDate ? formatDate(product.pickUpDate) : 'N/A'}
                                                    </span>
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
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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

export default ProductList;
