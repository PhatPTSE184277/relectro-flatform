import React from 'react';

interface ProductShowProps {
    product: any;
    stt?: number;
    showCheckbox?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

const ProductShow: React.FC<ProductShowProps & { isLast?: boolean }> = ({ product, isLast = false, stt, showCheckbox, isSelected, onToggleSelect }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            {showCheckbox && (
                <td className='py-3 px-4 text-center' style={{ width: '50px' }}>
                    <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                    />
                </td>
            )}
            <td className='py-3 px-4 text-center' style={{ width: '70px' }}>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '180px' }}>
                <div>{product.userName || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>
                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '320px' }}>
                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
            </td>
            <td className='py-3 pl-4 pr-16 text-gray-700 text-right' style={{ width: '180px' }}>
                <div className='flex flex-col gap-1 items-end'>
                    <span className='text-xs'>
                        <span className='font-medium'>{product.weight || product.weightKg || 0}</span>
                    </span>
                    <span className='text-xs text-gray-500'>
                        {product.volume || product.volumeM3 || 0}
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default ProductShow;
