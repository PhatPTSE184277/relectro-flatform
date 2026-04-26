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
    allProductIds?: string[]; // All product IDs (all pages)
    onToggleSelect?: (productId: string) => void;
    onToggleProduct?: (productId: string) => void;
    onToggleAll?: () => void;
    maxHeight?: number;
    showAction?: boolean;
    actionLoadingProductId?: string | null;
    onAction?: (product: any) => void;
    showPhone?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    loading,
    page = 1,
    itemsPerPage = 10,
    showCheckbox,
    selectedProductIds = [],
    allProductIds,
    onToggleSelect,
    onToggleProduct,
    onToggleAll,
    maxHeight,
    showAction = false,
    actionLoadingProductId,
    onAction,
    showPhone = false
}) => {
    // Check if all products (from allProductIds or current page) are selected
    const targetIds = allProductIds && allProductIds.length > 0 
        ? allProductIds 
        : products.map(p => p.productId);
    const allSelected = showCheckbox && targetIds.length > 0 && targetIds.every(id => selectedProductIds.includes(id));
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
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        {showCheckbox && (
                                            <th className='py-3 px-4 text-center w-[5vw]'>
                                                <input
                                                    type='checkbox'
                                                    checked={allSelected}
                                                    onChange={onToggleAll}
                                                    className='w-4 h-4 cursor-pointer accent-primary-600'
                                                />
                                            </th>
                                        )}
                                        <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw]'>Sản phẩm</th>
                                        <th className='py-3 px-4 text-left w-[22vw]'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-right w-[18vw]'>Khối lượng / Kích thước (kg, cm)</th>
                                        {showAction && (
                                            <th className='py-3 px-4 text-center w-[10vw]'>Thao tác</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <ProductSkeleton key={idx} showCheckbox={showCheckbox} showAction={showAction} />
                                        ))
                                    ) : products?.length === 0 ? (
                                        <tr>
                                            <td colSpan={(showCheckbox ? 5 : 4) + (showAction ? 1 : 0)} className='text-center py-8 text-gray-400'>
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
                                                showAction={showAction}
                                                actionLoading={actionLoadingProductId === String(product.productId || product.id || '')}
                                                onAction={() => onAction?.(product)}
                                                showPhone={showPhone}
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