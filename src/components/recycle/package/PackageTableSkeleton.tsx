import React from 'react';


const PackageTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100 hover:bg-primary-50/40'>
        {/* Mã Package */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-28 animate-pulse' />
        </td>
        {/* Số sản phẩm */}
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
        </td>
        {/* Hành động */}
        <td className='py-3 px-4'>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default PackageTableSkeleton;
