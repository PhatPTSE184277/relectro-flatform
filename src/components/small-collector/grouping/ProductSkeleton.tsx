import React from 'react';

interface ProductSkeletonProps {
    showCheckbox?: boolean;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ showCheckbox = false }) => (
    <tr className='border-b border-primary-100'>
        {showCheckbox && (
            <td className='py-3 px-4 text-center w-[5vw]'>
                <div className='h-4 w-4 bg-gray-200 rounded mx-auto animate-pulse' />
            </td>
        )}
        {/* STT */}
        <td className='py-3 px-4 text-center w-[5vw]'>
            <div className='h-4 w-7 bg-gray-200 rounded mx-auto animate-pulse' />
        </td>
        {/* Sản phẩm */}
        <td className='py-3 px-4 text-left w-[14vw]'>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
        </td>
        {/* Địa chỉ */}
        <td className='py-3 px-4 text-left w-[22vw]'>
            <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
        </td>
        {/* Khối lượng / Kích thước */}
        <td className='py-3 px-4 text-right w-[18vw]'>
            <div className='h-4 w-20 bg-gray-200 rounded ml-auto animate-pulse' />
        </td>
    </tr>
);

export default ProductSkeleton;
