import React from 'react';

interface AssignedProductShowProps {
    product: any;
    isLast?: boolean;
    index?: number;
}

const AssignedProductShow: React.FC<AssignedProductShowProps> = ({
    product,
    isLast = false,
    index
}) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{product.productName || 'Không rõ'}</div>
            </td>
            <td className='py-3 px-4 text-gray-700'>
                {product.userName || <span className='text-gray-400'>Chưa có</span>}
            </td>
            <td className='py-3 px-4 text-gray-700'>
                {product.address || <span className='text-gray-400'>Chưa có</span>}
            </td>
        </tr>
    );
};

export default AssignedProductShow;
