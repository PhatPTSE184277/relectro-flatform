import React from 'react';
import { Eye } from 'lucide-react';
import { SmallCollectionPoint } from '@/types';

interface SmallCollectionShowProps {
    point: SmallCollectionPoint;
    onView: () => void;
    isLast?: boolean;
    index?: number;
}

const SmallCollectionShow: React.FC<SmallCollectionShowProps> = ({ point, onView, isLast = false, index }) => {
    const stt = (index ?? 0) + 1;
    const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-[5vw] min-w-10'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 w-[14vw] min-w-60'>
                <div className='text-gray-900 font-medium'>
                    {point.name || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700 w-[18vw] min-w-80'>
                {point.address || <span className='text-gray-400'>Chưa có</span>}
            </td>

            <td className='py-3 px-4 text-center text-gray-700 w-[7vw] min-w-40'>
                {point.openTime || <span className='text-gray-400'>Chưa có</span>}
            </td>

            <td className='py-3 px-4 w-[7vw] min-w-24'>
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

export default SmallCollectionShow;
