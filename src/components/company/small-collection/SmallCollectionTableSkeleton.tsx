import React from 'react';

const SmallCollectionTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-gray-50'>
        <td className='py-3 px-4 text-center'>
            <div className='w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse' />
        </td>
        {/* Xoá skeleton trạng thái */}
        <td className='py-3 px-4'>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default SmallCollectionTableSkeleton;
