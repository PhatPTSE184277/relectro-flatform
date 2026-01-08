import React from 'react';

import ProductShow from './ProductShow';
import ProductSkeleton from './ProductSkeleton';

interface ProductListProps {
    products: any[];
    loading: boolean;
    page?: number;
    itemsPerPage?: number;
    showCheckbox?: boolean;
    selectedProductIds?: string[];
    onToggleSelect?: (productId: string) => void;
    onToggleAll?: () => void;
    maxHeight?: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page = 1, itemsPerPage = 10, showCheckbox, selectedProductIds = [], onToggleSelect, onToggleAll, maxHeight = 330 }) => {
    const allSelected = showCheckbox && products.length > 0 && products.every(p => selectedProductIds.includes(p.productId));
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='w-full overflow-x-auto'>
                <table className='min-w-[700px] text-sm text-gray-800' style={{ tableLayout: 'fixed', width: '100%' }}>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            {showCheckbox && (
                                <th className='py-3 px-4 text-center' style={{ width: '50px' }}>
                                    <input
                                        type='checkbox'
                                        checked={allSelected}
                                        onChange={onToggleAll}
                                        className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                    />
                                </th>
                            )}
                            <th className='py-3 px-4 text-center' style={{ width: '70px' }}>STT</th>
                            <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Người gửi</th>
                            <th className='py-3 px-4 text-left' style={{ width: '320px' }}>Địa chỉ</th>
                            <th className='py-3 pl-4 pr-16 text-right' style={{ width: '180px' }}>Khối lượng(kg/m³)</th>
                        </tr>
                    </thead>
                </table>
                <div style={{ maxHeight, overflowY: 'auto' }}>
                    <table className='min-w-[700px] text-sm text-gray-800' style={{ tableLayout: 'fixed', width: '100%' }}>
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
                                        onToggleSelect={() => onToggleSelect?.(product.productId)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;