import React from 'react';
import { formatDimensionText } from '@/utils/formatNumber';

interface DistributedProductShowProps {
    product: any;
    stt: number;
    isLast?: boolean;
}

const DistributedProductShow: React.FC<DistributedProductShowProps> = ({ product, stt, isLast = false }) => {
    let dimensionDisplay = '';
    if (!product.dimensions || product.dimensions === 'Chưa cập nhật') {
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
            <td className='py-3 px-4 text-center w-16'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 w-64'>
                <div>{product.userName || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>
                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4'>
                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
            </td>
            <td className='py-3 px-4 text-right w-64'>
                <div className='flex flex-col gap-1 items-end'>
                    <span className='text-xs'>
                        <span className='font-medium'>{product.weight || product.weightKg || 0}</span> kg
                    </span>
                    <span className='text-xs text-gray-500'>
                        {dimensionDisplay} cm
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default DistributedProductShow;
