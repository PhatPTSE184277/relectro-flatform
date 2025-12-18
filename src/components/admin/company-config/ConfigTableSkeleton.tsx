import React from 'react';

const ConfigTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-primary-50/40'>
        {/* STT */}
        <td className='py-3 px-4 text-center w-12'>
            <div className='h-4 bg-gray-200 rounded w-7 mx-auto animate-pulse' />
        </td>
        {/* Công ty */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        {/* Tỷ lệ (%) */}
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse' />
        </td>
        {/* Điểm thu gom */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        {/* Số điểm thu gom */}
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse' />
        </td>
        {/* Hành động */}
        <td className='py-3 px-4 text-center'>
            <div className='h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse' />
        </td>
    </tr>
);

export default ConfigTableSkeleton;
