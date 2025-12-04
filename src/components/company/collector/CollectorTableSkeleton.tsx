import React from 'react';

const CollectorTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-gray-50'>
        <td className='py-3 px-4'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse' />
                <div>
                    <div className='h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse' />
                    <div className='h-3 bg-gray-200 rounded w-24 animate-pulse' />
                </div>
            </div>
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-28 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='h-6 bg-gray-200 rounded w-20 mx-auto animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default CollectorTableSkeleton;
