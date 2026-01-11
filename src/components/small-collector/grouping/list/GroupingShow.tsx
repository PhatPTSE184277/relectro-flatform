import React from 'react';
import { Eye, UserCog } from 'lucide-react';

interface GroupingShowProps {
    grouping: any;
    onViewDetail: (grouping: any) => void;
    onReassignDriver: (grouping: any) => void;
}

const GroupingShow: React.FC<GroupingShowProps & { isLast?: boolean; stt?: number }> = ({ grouping, onViewDetail, onReassignDriver, isLast = false, stt }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`} style={{ tableLayout: 'fixed' }}>
            <td className='py-3 px-4 text-left w-16'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-56'>
                <div className='text-gray-900'>{grouping.groupCode}</div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-40'>
                {new Date(grouping.groupDate).toLocaleDateString('vi-VN')}
            </td>
            <td className='py-3 px-4 text-gray-700 w-48'>
                <div className='flex items-center gap-2'>
                    <span>{grouping.vehicle?.replace(/\s*\(.*\)/, '')}</span>
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-48'>
                {grouping.collector}
            </td>
            <td className='py-3 px-4 text-gray-700 w-32'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {grouping.totalPosts} sản phẩm
                </span>
            </td>
            <td className='py-3 px-4 text-gray-700 text-right w-48'>
                <div className='flex flex-col gap-1 items-end'>
                    <span className='text-xs'>
                        <span className='font-medium'>{grouping.totalWeightKg}</span>
                    </span>
                    <span className='text-xs text-gray-500'>
                        {grouping.totalVolumeM3}
                    </span>
                </div>
            </td>
            <td className='py-3 px-4 w-32'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => onViewDetail(grouping)}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onReassignDriver(grouping)}
                        className='text-orange-600 hover:text-orange-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Phân lại tài xế'
                    >
                        <UserCog size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default GroupingShow;
