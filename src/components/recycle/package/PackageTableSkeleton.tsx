import React from 'react';


const PackageTableSkeleton: React.FC = () => (
    <tr className='border-b border-primary-100 hover:bg-primary-50/40'>
        {/* STT */}
        <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
            <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mx-auto animate-pulse" />
        </td>
        {/* Mã Package */}
        <td className='py-3 px-4' style={{ width: '180px' }}>
            <div className='h-4 bg-gray-200 rounded w-28 animate-pulse' />
        </td>
        {/* Số sản phẩm */}
        <td className='py-3 px-4' style={{ width: '160px' }}>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
        </td>
        {/* Hành động */}
        <td className='py-3 px-4' style={{ width: '120px' }}>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default PackageTableSkeleton;
