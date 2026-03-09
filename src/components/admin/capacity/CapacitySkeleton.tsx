import React from 'react';

const CapacityWarehouseSkeleton: React.FC = () => (
    <tr className='animate-pulse border-b border-primary-100'>
        <td className='py-3 px-4 text-center'>
            <div className='h-7 w-7 bg-gray-200 rounded-full mx-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 ml-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-16 ml-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 ml-auto' />
        </td>
    </tr>
);

export default CapacityWarehouseSkeleton;
