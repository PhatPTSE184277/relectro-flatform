import React from 'react';
import { Eye } from 'lucide-react';
import { formatTimeWithDate } from '@/utils/FormatTime';
import RenderTimeCell from '@/utils/RenderTimeCell';

interface ShiftShowProps {
    shift: any;
    onView: () => void;
    isLast?: boolean;
    index?: number;
    showSplitTime?: boolean;
}

const ShiftShow: React.FC<ShiftShowProps> = ({
    shift,
    onView,
    index,
    showSplitTime = false
}) => {


    return (
        <tr
            className={`$
                !isLast ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/40 transition-colors`}
        >
            <td className='py-3 px-4 text-center w-16'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 w-60'>
                <div className='text-gray-900 font-medium'>
                    {shift.collectorName || 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-36'>
                {shift.plate_Number || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>
            {showSplitTime ? (
                <>
                    <td className='py-3 px-4 text-gray-700 w-32'>
                        <div className='flex flex-col items-start'>
                            {RenderTimeCell(shift.shift_Start_Time)}
                        </div>
                    </td>
                    <td className='py-3 px-4 text-gray-700 w-32'>
                        <div className='flex flex-col items-start'>
                            {RenderTimeCell(shift.shift_End_Time)}
                        </div>
                    </td>
                </>
            ) : (
                <td className='py-3 px-4 text-gray-700 w-[272px]' colSpan={2}>
                    {shift.shift_Start_Time && shift.shift_End_Time ? (
                        `${formatTimeWithDate(shift.shift_Start_Time)} - ${formatTimeWithDate(shift.shift_End_Time)}`
                    ) : (
                        <span className='text-gray-400'>Chưa có</span>
                    )}
                </td>
            )}
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

export default ShiftShow;
