import React from 'react';
import { Eye } from 'lucide-react';
import { SmallCollectionPoint } from '@/types';

interface SmallCollectionShowProps {
    point: SmallCollectionPoint;
    onView: () => void;
    isLast?: boolean;
    index?: number;
    isSelected?: boolean;
    onSelect?: () => void;
}

const SmallCollectionShow: React.FC<SmallCollectionShowProps> = ({
    point,
    onView,
    isLast = false,
    index,
    isSelected = false,
    onSelect
}) => {
    return (
        <tr
            className={`${
                !isLast ? 'border-b border-primary-100' : ''
            } ${
                isSelected ? 'bg-primary-100' : 'hover:bg-primary-50/40'
            } transition-colors cursor-pointer`}
            onClick={onSelect}
        >
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4'>
                <div className='text-gray-900 font-medium'>
                    {point.name || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {point.address || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-center text-gray-700'>
                {point.openTime || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            {/* Xoá cell trạng thái */}

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView();
                        }}
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
