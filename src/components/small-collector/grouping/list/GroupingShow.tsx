import React from 'react';
import { Eye, Truck } from 'lucide-react';

interface GroupingShowProps {
    grouping: any;
    onViewDetail: (grouping: any) => void;
}

const GroupingShow: React.FC<GroupingShowProps & { isLast?: boolean }> = ({ grouping, onViewDetail, isLast = false }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{grouping.groupCode}</div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {new Date(grouping.groupDate).toLocaleDateString('vi-VN')}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <div className='flex items-center gap-2'>
                    <Truck size={16} className='text-primary-600' />
                    <span>{grouping.vehicle}</span>
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {grouping.collector}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {grouping.totalPosts} sản phẩm
                </span>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <div className='flex flex-col gap-1'>
                    <span className='text-xs'>
                        <span className='font-medium'>{grouping.totalWeightKg}</span> kg
                    </span>
                    <span className='text-xs text-gray-500'>
                        {grouping.totalVolumeM3} m³
                    </span>
                </div>
            </td>

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => onViewDetail(grouping)}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default GroupingShow;
