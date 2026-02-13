import React from 'react';

const TrackingProductSkeleton: React.FC = () => (
    <tr className='animate-pulse border-b border-primary-100'>
        <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto' />
        </td>
        <td className='py-3 px-4' style={{ width: '200px' }}>
            <div className='h-4 bg-gray-200 rounded w-24 mb-1' />
            <div className='h-3 bg-gray-200 rounded w-16' />
        </td>
        <td className='py-3 px-4' style={{ width: '180px' }}>
            <div className='h-4 bg-gray-200 rounded w-20' />
        </td>
        <td className='py-3 px-4' style={{ width: '160px' }}>
            <div className='h-4 bg-gray-200 rounded w-24' />
        </td>
        <td className='py-3 px-4' style={{ width: '120px' }}>
            <div className='h-4 bg-gray-200 rounded w-16 ml-auto' />
        </td>
        <td className='py-3 px-4 text-center' style={{ width: '120px' }}>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto' />
        </td>
    </tr>
);

export default TrackingProductSkeleton;
