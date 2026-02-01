import React from 'react';
import { formatDimensionText } from '@/utils/formatNumber';

interface ProductShowProps {
    product: any;
    stt?: number;
    showCheckbox?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

const ProductShow: React.FC<ProductShowProps & { isLast?: boolean }> = ({ product, isLast = false, stt, showCheckbox, isSelected, onToggleSelect }) => {
    // Ưu tiên dùng dimensionText từ API nếu có
    let dimensionDisplay = '';
    if (product.dimensionText && product.dimensionText !== 'Chưa cập nhật') {
        dimensionDisplay = product.dimensionText;
    } else if (!product.dimensions || product.dimensions === 'Chưa cập nhật') {
        dimensionDisplay = '0 x 0 x 0';
    } else {
        const l = product.length ?? 0;
        const w = product.width ?? 0;
        const h = product.height ?? 0;
        if (l > 0 || w > 0 || h > 0) {
            dimensionDisplay = `${Number(l).toFixed(2).replace(/\.00$/, '')} x ${Number(w).toFixed(2).replace(/\.00$/, '')} x ${Number(h).toFixed(2).replace(/\.00$/, '')}`;
        } else {
            dimensionDisplay = formatDimensionText(product.dimensions);
        }
    }
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            {showCheckbox && (
                <td className='py-3 px-4 text-center w-[5vw]'>
                    <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                    />
                </td>
            )}
            <td className='py-3 px-4 w-[5vw]'>
                <div className='flex items-center justify-center h-full'>
                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold'>
                        {stt}
                    </span>
                </div>
            </td>
            <td className='py-3 px-4 text-left w-[14vw]'>
                <div>{product.userName || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>
                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-left w-[22vw]'>
                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
            </td>
            <td className='py-3 px-4 text-right w-[18vw]'>
                <div className='flex flex-col gap-1 items-end'>
                    <span className='text-xs'>
                        <span className='font-medium'>{product.weight || product.weightKg || 0}</span>
                    </span>
                    <span className='text-xs text-gray-500'>
                        {dimensionDisplay}
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default ProductShow;
