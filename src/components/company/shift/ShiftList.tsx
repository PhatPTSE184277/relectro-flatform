import React from 'react';
import ShiftShow from './ShiftShow';
import ShiftTableSkeleton from './ShiftTableSkeleton';

interface ShiftListProps {
    shifts: any[];
    loading: boolean;
    onViewDetail: (shift: any) => void;
}

const ShiftList: React.FC<ShiftListProps> = ({
    shifts,
    loading,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='overflow-x-auto max-h-[44vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[45vh] xl:max-h-[44vh] overflow-y-auto w-full'>
                            <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[5vw] min-w-10'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw] min-w-60'>Nhân viên</th>
                                        <th className='py-3 px-4 text-left w-[10vw] min-w-36'>Biển số xe</th>
                                        <th className='py-3 px-4 text-left w-[9vw] min-w-32'>Bắt đầu</th>
                                        <th className='py-3 px-4 text-left w-[9vw] min-w-32'>Kết thúc</th>
                                        <th className='py-3 px-4 text-center w-[7vw] min-w-24'>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <ShiftTableSkeleton key={idx} />
                                        ))
                                    ) : shifts.length > 0 ? (
                                        shifts.map((shift, idx) => (
                                            <ShiftShow
                                                key={shift.shiftId}
                                                shift={shift}
                                                onView={() => onViewDetail(shift)}
                                                isLast={idx === shifts.length - 1}
                                                index={idx}
                                                showSplitTime
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-8 text-gray-400'>
                                                Không có ca làm việc nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftList;
