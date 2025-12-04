import React from 'react';

const ProductSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100'>
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='flex flex-col gap-1'>
                <div className='h-3 bg-gray-200 rounded w-20 animate-pulse' />
                <div className='h-3 bg-gray-200 rounded w-20 animate-pulse' />
            </div>
        </td>
        <td className='py-3 px-4'>
            <div className='flex flex-col gap-1'>
                <div className='h-3 bg-gray-200 rounded w-16 animate-pulse' />
                <div className='h-3 bg-gray-200 rounded w-12 animate-pulse' />
            </div>
        </td>
    </tr>
);

export default ProductSkeleton;
