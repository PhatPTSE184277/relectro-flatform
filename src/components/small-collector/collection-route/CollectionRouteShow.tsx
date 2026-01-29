import React from 'react';
import { Eye } from 'lucide-react';
import { formatTime } from '@/utils/FormatTime';
import type { CollectionRoute } from '@/types/CollectionRoute';

interface CollectionRouteShowProps {
    route: CollectionRoute;
    onView: () => void;
}

const CollectionRouteShow: React.FC<CollectionRouteShowProps & { isLast?: boolean; stt?: number }> = ({
    route,
    onView,
    isLast = false,
    stt
}) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-2 text-center w-[4vw] min-w-10'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-2 font-medium w-[10vw] min-w-20'>
                <div className='text-gray-900 line-clamp-2'>{route.brandName || 'Không rõ'}</div>
            </td>
            <td className='py-3 px-2 text-gray-700 w-[12vw] min-w-[90px]'>
                {route.sender?.name || 'Không rõ'}
            </td>
            <td className='py-3 px-2 text-gray-700 w-[12vw] min-w-[90px]'>
                {route.collector?.name || 'Không rõ'}
            </td>
            <td className='py-3 px-2 text-gray-700 w-[18vw] min-w-[120px]'>
                <div className='line-clamp-2'>{route.address}</div>
            </td>
            <td className='py-3 px-2 text-sm text-gray-600 text-center w-[8vw] min-w-[60px]'>
                {formatTime(route.estimatedTime)}
            </td>
            <td className='py-3 px-2 w-[5vw] min-w-12'>
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

export default CollectionRouteShow;