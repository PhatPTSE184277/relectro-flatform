'use client';

import React from 'react';
import ProductListSkeleton from './ProductListSkeleton';
import { Trash2, Package } from 'lucide-react';

interface ProductListProps {
    products: Array<{
        qrCode?: string;
        productId?: string;
        categoryName: string;
        brandName: string;
        description: string;
        productImage?: string;
    }>;
    mode?: 'view' | 'edit';
    onRemoveProduct?: (qrCode: string) => void;
    selectedIndex?: number | null;
    lastProductRef?: React.RefObject<HTMLTableRowElement | null>;
    loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    mode = 'view',
    onRemoveProduct,
    selectedIndex,
    lastProductRef,
    loading = false
}) => {
    if (loading) {
        return <ProductListSkeleton />;
    } else if (products.length === 0) {
        return (
            <div className='text-center py-8 text-gray-400'>
                <Package
                    size={48}
                    className='mx-auto mb-2 opacity-50'
                />
                <p>Chưa có sản phẩm nào</p>
                {mode === 'edit' && (
                    <p className='text-sm'>
                        Quét QR code để thêm sản phẩm
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full max-h-[40vh] overflow-y-auto">
            <table className="w-full text-sm text-gray-800 table-fixed">
                <thead className="bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100">
                    <tr>
                        <th className="py-3 px-4 text-center w-[5vw] min-w-[5vw]">STT</th>
                        <th className="py-3 px-4 text-left w-[20vw] min-w-[10vw]">Danh mục</th>
                        <th className="py-3 px-4 text-left w-[16vw] min-w-[8vw]">Thương hiệu</th>
                        <th className="py-3 px-4 text-left w-[30vw] min-w-[14vw]">Ghi chú</th>
                        {mode === 'edit' && (
                            <th className="py-3 px-4 text-center w-[12vw] min-w-[8vw]">Hành động</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        const isLast = index === products.length - 1;
                        const isSelected = selectedIndex === index;
                        const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';

                        return (
                            <tr
                                key={product.qrCode || product.productId || index}
                                ref={isSelected ? lastProductRef : null}
                                className={`${
                                    !isLast ? 'border-b border-primary-100' : ''
                                } ${rowBg} transition-colors`}
                                style={{ tableLayout: 'fixed' }}
                            >
                                <td className="py-3 px-4 font-medium text-center">
                                    <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold mx-auto">
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="py-3 px-4 font-medium text-gray-900">
                                    {product.categoryName}
                                </td>
                                <td className="py-3 px-4 text-gray-700">
                                    {product.brandName}
                                </td>
                                <td className="py-3 px-4 text-gray-700">
                                    <div className="line-clamp-2 break-all">
                                        {product.description || '-'}
                                    </div>
                                </td>
                                {mode === 'edit' && (
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => onRemoveProduct?.(product.qrCode!)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                            title="Xóa sản phẩm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
