import React from 'react';
import { Eye } from 'lucide-react';
import { Collector } from '@/types';

interface CollectorShowProps {
    collector: Collector;
    onView: () => void;
    isLast?: boolean;
    index?: number;
}

const CollectorShow: React.FC<CollectorShowProps> = ({
    collector,
    onView,
    isLast = false,
    index
}) => {
    return (
        <tr
            className={`${
                !isLast ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/40 transition-colors`}
        >
            <td className='py-3 px-4 text-center w-16'>
               <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 w-60'>
                <div className='text-gray-900 font-medium'>
                    {collector.name || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700 w-60'>
                {collector.email || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-gray-700 w-40'>
                {collector.phone || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-center w-40'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                    Điểm {collector.smallCollectionPointId}
                </span>
            </td>

            <td className='py-3 px-4 w-24'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
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

export default CollectorShow;
