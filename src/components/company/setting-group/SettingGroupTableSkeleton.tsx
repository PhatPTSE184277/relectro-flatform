import React from 'react';

const SettingGroupTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100 hover:bg-primary-50/40 transition-colors'>
        {/* STT */}
        <td className='py-3 px-4 text-center'>
            <div className='w-7 h-7 rounded-full bg-gray-200 mx-auto animate-pulse' />
        </td>

        {/* Tên điểm thu gom */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-36 mb-2 animate-pulse' />
        </td>

        {/* Thời gian phục vụ */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
        </td>

        {/* Thời gian di chuyển */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
        </td>

        {/* Trạng thái */}
        <td className='py-3 px-4'>
            <div className='h-6 bg-gray-200 rounded-full w-20 mx-auto animate-pulse' />
        </td>

        {/* Hành động */}
        <td className='py-3 px-4'>
            <div className='flex justify-center'>
                <div className='h-8 w-16 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default SettingGroupTableSkeleton;
