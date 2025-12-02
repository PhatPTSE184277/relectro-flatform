import React from 'react';

const PostSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-gray-50'>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-16 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-16 animate-pulse' />
        </td>
    </tr>
);

export default PostSkeleton;