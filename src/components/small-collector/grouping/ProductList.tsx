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
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page = 1, itemsPerPage = 10, showCheckbox, selectedProductIds = [], onToggleSelect, onToggleProduct, onToggleAll, maxHeight }) => {
    // Check if all products on current page are selected
    const allSelected = showCheckbox && products.length > 0 && products.every(p => selectedProductIds.includes(p.productId));
    // Determine maxHeight style
    let maxHeightStyle: React.CSSProperties | undefined = undefined;
    if (maxHeight !== undefined) {
        if (typeof maxHeight === 'number') {
            maxHeightStyle = { maxHeight: `${maxHeight}vh`, overflowY: 'auto' };
        } else if (typeof maxHeight === 'string') {
            maxHeightStyle = { maxHeight: maxHeight, overflowY: 'auto' };
        }
    }
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div
                            className={maxHeight === undefined ? 'max-h-[59vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[53vh] xl:max-h-[59vh] overflow-y-auto' : 'overflow-y-auto'}
                            style={maxHeightStyle}
                        >
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        {showCheckbox && (
                                            <th className='py-3 px-4 text-center w-[5vw]'>
                                                <input
                                                    type='checkbox'
                                                    checked={allSelected}
                                                    onChange={onToggleAll}
                                                    className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                                />
                                            </th>
                                        )}
                                        <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw]'>Người gửi</th>
                                        <th className='py-3 px-4 text-left w-[22vw]'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-right w-[18vw]'>Khối lượng / Kích thước (kg, cm)</th>
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