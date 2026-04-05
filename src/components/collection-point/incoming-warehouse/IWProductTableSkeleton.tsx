import React from 'react';

const IWProductTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100'>
        <td className='py-3 px-4 text-center w-[5vw] min-w-10'>
            <div className='w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4 font-medium w-[14vw] min-w-20'>
            <div className='h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-gray-700 w-[12vw] min-w-[70px]'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-gray-700 w-[18vw] min-w-[120px]'>
            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
        </td>
        <td className='py-3 px-4 w-[7vw] min-w-12'>
            <div className='flex justify-center'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default IWProductTableSkeleton;