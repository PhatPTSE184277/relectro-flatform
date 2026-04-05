import React from 'react';

const CollectionRouteTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-gray-50'>
        <td className='py-3 px-2 text-center w-[4vw]'>
            <div className='w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-2 font-medium w-[10vw]'>
            <div className='h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse' />
        </td>
        <td className='py-3 px-2 w-[12vw]'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        <td className='py-3 px-2 w-[18vw]'>
            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
        </td>
        <td className='py-3 px-2 text-center w-[8vw]'>
            <div className='h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse' />
        </td>
        <td className='py-3 px-2 text-center w-[5vw]'>
            <div className='flex justify-center'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default CollectionRouteTableSkeleton;
