import React from 'react';

const DistributedCompanySkeleton: React.FC = () => (
    <tr className='border-b border-primary-100'>
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='h-8 w-20 bg-gray-200 rounded mx-auto animate-pulse' />
        </td>
    </tr>
);

export default DistributedCompanySkeleton;
