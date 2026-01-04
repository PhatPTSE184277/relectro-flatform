import React from 'react';

interface ProductShowProps {
    product: any;
    stt?: number;
    isLast?: boolean;
}

const ProductShow: React.FC<ProductShowProps> = ({ product, isLast = false, stt }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '180px' }}>
                <div className='flex items-center gap-2'>
                    <div>
                        <div className='font-medium'>{product.categoryName || 'N/A'}</div>
                        <div className='text-xs text-gray-500'>
                            {product.brandName || 'N/A'}
                        </div>
                    </div>
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '160px' }}>
                <div className='flex items-center gap-2'>
                    <span>{product.userName || 'N/A'}</span>
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 max-w-xs' style={{ width: '220px' }}>
                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '140px' }}>
                <div className='flex flex-col gap-1'>
                    <span className='text-xs'>
                        <span className='font-medium'>Bán kính:</span> {product.radiusKm || 'N/A'}
                    </span>
                    <span className='text-xs text-gray-500'>
                        <span className='font-medium'>Đường đi:</span> {product.roadKm || 'N/A'}
                    </span>
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '120px' }}>
                <div className='flex flex-col gap-1'>
                    <span className='text-xs'>
                        <span className='font-medium'>{product.weightKg || 0}</span> kg
                    </span>
                    <span className='text-xs text-gray-500'>
                        {product.volumeM3 || 0} m³
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default ProductShow;
