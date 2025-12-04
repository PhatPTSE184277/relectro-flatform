import React from 'react';

interface ProductShowProps {
    product: any;
    stt?: number;
}

const ProductShow: React.FC<ProductShowProps & { isLast?: boolean }> = ({ product, isLast = false, stt }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 text-gray-700'>
                <div>{product.userName || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>
                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 max-w-xs'>
                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
            </td>
            <td className='py-3 px-4 text-gray-700'>
                <div className='flex flex-col gap-1'>
                    <span className='text-xs'>
                        <span className='font-medium'>{product.weight || product.weightKg || 0}</span> kg
                    </span>
                    <span className='text-xs text-gray-500'>
                        {product.volume || product.volumeM3 || 0} m³
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default ProductShow;
