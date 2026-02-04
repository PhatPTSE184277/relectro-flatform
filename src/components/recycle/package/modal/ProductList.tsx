'use client';

import React from 'react';
import { PackageType } from '@/types/Package';
import Pagination from '@/components/ui/Pagination';

interface ProductListProps {
    products: PackageType['products'];
    showStatus?: boolean;
    checkedProducts?: Set<string>;
    showPagination?: boolean;
    onPageChange?: (page: number) => void;
    maxHeight?: number;
    striped?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    showStatus = false,
    checkedProducts,
    showPagination = false,
    onPageChange,
    maxHeight = 330
    , striped = true
}) => {
    const productsData = Array.isArray(products) ? products : products.data;
    const currentPage = !Array.isArray(products) ? products.page : 1;
    const totalPages = !Array.isArray(products) ? products.totalPages : 1;
    const startIndex = !Array.isArray(products) ? (products.page - 1) * products.limit : 0;

     return (
          <>
              <div
                  className='relative w-full overflow-y-auto'
                  style={{ maxHeight }}
              >
                <table className='w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-center w-[4vw]'>STT</th>
                            <th className='py-3 px-4 text-left w-[14vw]'>Danh mục</th>
                            <th className='py-3 px-4 text-left w-[12vw]'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left w-[22vw]'>Ghi chú</th>
                            {showStatus && (
                                <th className='py-3 px-4 text-center w-[8vw]'>Trạng thái</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {productsData.map((product, index) => {
                            const isLast = index === productsData.length - 1;
                            const isAlreadyChecked = product.isChecked;
                            const isNewlyScanned = checkedProducts && product.qrCode && checkedProducts.has(product.qrCode);
                            const isChecked = isAlreadyChecked || isNewlyScanned;
                            const rowBg = striped ? (index % 2 === 0 ? 'bg-white' : 'bg-primary-50') : 'bg-white';

                            return (
                                <tr
                                    key={product.productId}
                                    className={`${!isLast ? 'border-b border-primary-100' : ''} ${
                                            showStatus && checkedProducts && isChecked ? 'bg-green-50' : rowBg
                                        } transition-colors`}
                                        style={{ tableLayout: 'fixed' }}
                                    >
                                        <td className='py-3 px-4 text-center w-[4vw]'>
                                            <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold mx-auto'>
                                                {startIndex + index + 1}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 font-medium w-[14vw] min-w-0 truncate'>
                                            <div className='text-gray-900 truncate'>{product.categoryName}</div>
                                        </td>
                                        <td className='py-3 px-4 text-left text-gray-700 w-[12vw] min-w-0 truncate'>
                                            {product.brandName}
                                        </td>
                                        <td className='py-3 px-4 text-gray-600 text-xs w-[22vw] min-w-0'>
                                            <div className='line-clamp-2 wrap-break-word overflow-hidden'>
                                                {product.description || '-'}
                                            </div>
                                        </td>
                                    {showStatus && (
                                        <td className='py-3 px-4 text-center w-[8vw] min-w-0'>
                                            {isChecked ? (
                                                <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700'>
                                                    ✓ Đã quét
                                                </span>
                                            ) : (
                                                <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700'>
                                                    Chưa quét
                                                </span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {showPagination && onPageChange && totalPages > 1 && (
                <div className='px-4 pb-4 border-t'>
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </>
    );
};

export default ProductList;
