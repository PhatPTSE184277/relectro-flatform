import React from 'react';

interface ProductShowProps {
    product: any;
    stt: number;
    isLast?: boolean;
}

const ProductShow: React.FC<ProductShowProps> = ({ product, stt, isLast = false }) => {

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center w-[6vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 w-[15vw]'>
                <div>{product.userName || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>
                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
            </td>
        </tr>
    );
};

export default ProductShow;
