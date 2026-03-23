import React from 'react';

const TrackingProductSkeleton: React.FC = () => (
    <tr className='animate-pulse border-b border-primary-100'>
        <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto' />
        </td>
        <td className='py-3 px-4' style={{ width: '220px' }}>
            <div className='h-4 bg-gray-200 rounded w-24 mb-1' />
            <div className='h-3 bg-gray-200 rounded w-16' />
        </td>
        <td className='py-3 px-4' style={{ width: '240px' }}>
            <div className='h-4 bg-gray-200 rounded w-20 mb-1' />
            <div className='h-3 bg-gray-200 rounded w-32' />
        </td>
        <td className='py-3 px-4' style={{ width: '130px' }}>
            <div className='h-4 bg-gray-200 rounded w-16 ml-auto' />
        </td>
        <td className='py-3 px-4' style={{ width: '150px' }}>
            <div className='h-4 bg-gray-200 rounded w-24 mx-auto' />
        </td>
        <td className='py-3 px-4 text-center' style={{ width: '80px' }}>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto' />
        </td>
    </tr>
);

export default TrackingProductSkeleton;
