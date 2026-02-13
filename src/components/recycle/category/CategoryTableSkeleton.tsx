import React from 'react';

const CategoryTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100'>
        {/* STT */}
        <td className='py-3 px-4 text-center'>
            <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mx-auto animate-pulse" />
        </td>
        {/* Tên danh mục */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-56 animate-pulse' />
        </td>
        {/* Hành động */}
        <td className='py-3 px-4'>
            <div className='flex justify-center'>
                <div className='h-4 w-4 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default CategoryTableSkeleton;
