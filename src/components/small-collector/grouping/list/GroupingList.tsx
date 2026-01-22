import React from 'react';
import GroupingShow from './GroupingShow';
import GroupingTableSkeleton from './GroupingTableSkeleton';

interface GroupingListProps {
    groupings: any[];
    loading: boolean;
    onViewDetail: (grouping: any) => void;
    onReassignDriver: (grouping: any) => void;
}

const GroupingList: React.FC<GroupingListProps> = ({
    groupings,
    loading,
    onViewDetail,
    onReassignDriver
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto max-h-110 overflow-y-auto'>
                <table className='min-w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                        <tr>
                            <th className='py-3 px-4 text-left w-16'>STT</th>
                            <th className='py-3 px-4 text-left w-48'>Mã nhóm</th>
                            <th className='py-3 px-4 text-center w-48'>Ngày thu gom</th>
                            <th className='py-3 px-4 text-center w-48'>Phương tiện</th>
                            <th className='py-3 px-4 text-left w-48'>Người thu gom</th>
                            <th className='py-3 px-4 text-left w-32'>Số sản phẩm</th>
                            <th className='py-3 px-4 text-right w-48'>Khối lượng (kg)</th>
                            <th className='py-3 px-4 text-center w-32'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <GroupingTableSkeleton key={idx} />
                            ))
                        ) : groupings.length > 0 ? (
                            groupings.map((group, idx) => (
                                <GroupingShow
                                    key={group.groupId}
                                    grouping={{ ...group, groupDate: group.date, totalPosts: group.totalOrders }}
                                    onViewDetail={onViewDetail}
                                    onReassignDriver={onReassignDriver}
                                    isLast={idx === groupings.length - 1}
                                    stt={idx + 1}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className='text-center py-8 text-gray-400'>
                                    Không có nhóm thu gom nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GroupingList;
