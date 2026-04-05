import React from 'react';

const GroupingTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-primary-50/40'>
        <td className='py-3 px-4'>
            <div className='h-7 w-7 rounded-full bg-gray-200 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 w-40 bg-gray-200 rounded animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
        </td>
        <td className='py-3 px-4 text-right'>
            <div className='h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default GroupingTableSkeleton;
