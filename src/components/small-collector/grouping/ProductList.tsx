import React from 'react';

import ProductShow from './ProductShow';
import ProductSkeleton from './ProductSkeleton';

export interface ProductListProps {
    products: any[];
    loading: boolean;
    page?: number;
    itemsPerPage?: number;
    showCheckbox?: boolean;
    selectedProductIds?: string[];
    onToggleSelect?: (productId: string) => void;
    onToggleProduct?: (productId: string) => void;
    onToggleAll?: () => void;
    maxHeight?: number;
    allProducts?: any[]; // Tất cả products (không phân trang) để select all
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page = 1, itemsPerPage = 10, showCheckbox, selectedProductIds = [], onToggleSelect, onToggleProduct, onToggleAll, allProducts, maxHeight = 330 }) => {
    // Nếu có allProducts thì check xem tất cả products có được chọn không
    // Nếu không có allProducts thì chỉ check products của trang hiện tại
    const productsToCheck = allProducts && allProducts.length > 0 ? allProducts : products;
    const allSelected = showCheckbox && productsToCheck.length > 0 && productsToCheck.every(p => selectedProductIds.includes(p.productId));
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div style={{ maxHeight, overflowY: 'auto' }}>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        {showCheckbox && (
                                            <th className='py-3 px-4 text-center w-13'>
                                                <input
                                                    type='checkbox'
                                                    checked={allSelected}
                                                    onChange={onToggleAll}
                                                    className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                                />
                                            </th>
                                        )}
                                        <th className='py-3 px-4 text-left w-18'>STT</th>
                                        <th className='py-3 px-4 text-left w-64'>Người gửi</th>
                                        <th className='py-3 px-4 text-left'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-right w-64'>Khối lượng / Kích thước (kg, cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <ProductSkeleton key={idx} />
                                        ))
                                    ) : products?.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Không có sản phẩm nào chưa gom nhóm.
                                            </td>
                                        </tr>
                                    ) : (
                                        products?.map((product, idx) => (
                                            <ProductShow 
                                                key={product.productId} 
                                                product={product} 
                                                isLast={idx === products.length - 1}
                                                stt={(page - 1) * itemsPerPage + idx + 1}
                                                showCheckbox={showCheckbox}
                                                isSelected={selectedProductIds.includes(product.productId)}
                                                onToggleSelect={() => (onToggleProduct ? onToggleProduct(product.productId) : onToggleSelect?.(product.productId))}
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
}

export default ProductList;