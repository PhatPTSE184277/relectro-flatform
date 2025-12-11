import React from 'react';

const ShiftTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100 hover:bg-primary-50/40 transition-colors'>
        {/* STT */}
        <td className='py-3 px-4 text-center'>
            <div className='w-7 h-7 rounded-full bg-gray-200 mx-auto animate-pulse' />
        </td>

        {/* Nhân viên */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-36 mb-2 animate-pulse' />
        </td>

        {/* Biển số xe */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-28 animate-pulse' />
        </td>

        {/* Ngày làm việc */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>

        {/* Giờ làm việc */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>

        {/* Hành động */}
        <td className='py-3 px-4'>
            <div className='flex justify-center'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default ShiftTableSkeleton;
