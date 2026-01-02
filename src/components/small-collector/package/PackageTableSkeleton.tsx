import React from 'react';

const PackageTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-gray-50'>
        <td className='py-3 px-4 text-center'>
            <span className='w-7 h-7 rounded-full bg-gray-200 animate-pulse block mx-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default PackageTableSkeleton;
