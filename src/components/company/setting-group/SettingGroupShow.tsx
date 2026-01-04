import React from 'react';
import { Edit2 } from 'lucide-react';

interface SettingGroupShowProps {
    point: any;
    onEdit: () => void;
    isLast?: boolean;
    index?: number;
}

const SettingGroupShow: React.FC<SettingGroupShowProps> = ({
    point,
    onEdit,
    isLast = false,
    index
}) => {
    return (
        <tr
            className={`${
                !isLast ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/40 transition-colors`}
        >
            <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4' style={{ width: '240px' }}>
                <div className='text-gray-900 font-medium'>
                    {point.smallPointName || 'Không rõ'}
                </div>
                {point.isDefault && (
                    <span className='inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded'>
                        Mặc định
                    </span>
                )}
            </td>

            <td className='py-3 px-4 text-gray-900 text-center' style={{ width: '180px' }}>
                <span className='font-semibold'>
                    {point.serviceTimeMinutes || 0}
                </span>
            </td>

            <td className='py-3 px-4 text-gray-900 text-center' style={{ width: '200px' }}>
                <span className='font-semibold'>
                    {point.avgTravelTimeMinutes || 0}
                </span>
            </td>

            <td className='py-3 px-4' style={{ width: '120px' }}>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onEdit}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-sm'
                        title='Chỉnh sửa'
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default SettingGroupShow;
