import React from 'react';

const SeedQRProductTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100'>
        <td className='py-3 px-4 text-center'>
            <div className='w-4 h-4 bg-gray-200 rounded animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4 text-center'>
            <span className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mx-auto animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-36 animate-pulse mb-1' />
            <div className='h-3 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-16 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='h-5 bg-gray-200 rounded-full w-20 animate-pulse mx-auto' />
        </td>
    </tr>
);

export default SeedQRProductTableSkeleton;
