import React from 'react';

const VehicleTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100 hover:bg-primary-50/40 transition-colors'>
        {/* STT */}
        <td className='py-3 px-4 text-center'>
            <div className='w-7 h-7 rounded-full bg-gray-200 mx-auto animate-pulse' />
        </td>

        {/* Biển số xe */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-28 animate-pulse' />
        </td>

        {/* Loại xe */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>

        {/* Điểm thu gom */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>

        {/* Tải trọng */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
        </td>

        {/* Bán kính */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-16 animate-pulse' />
        </td>

        {/* Hành động */}
        <td className='py-3 px-4'>
            <div className='flex justify-center'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default VehicleTableSkeleton;
