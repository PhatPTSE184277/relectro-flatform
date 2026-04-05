import React from 'react';
import GroupingShow from './GroupingShow';
import GroupingTableSkeleton from './GroupingTableSkeleton';


interface GroupingListProps {
    groupings: any[];
    loading: boolean;
    onViewDetail: (grouping: any) => void;
    onReassignDriver: (grouping: any) => void;
    startIndex?: number;
}

const GroupingList: React.FC<GroupingListProps> = ({
    groupings,
    loading,
    onViewDetail,
    onReassignDriver,
    startIndex = 0
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto max-h-[62vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[55vh] xl:max-h-[62vh] overflow-y-auto'>
                <table className='min-w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-left w-[5vw] min-w-[5vw]'>STT</th>
                            <th className='py-3 px-4 text-left w-[14vw] min-w-[10vw]'>Mã nhóm</th>
                            <th className='py-3 px-4 text-center w-[12vw] min-w-[8vw]'>Ngày thu gom</th>
                            <th className='py-3 px-4 text-center w-[14vw] min-w-[10vw]'>Phương tiện</th>
                            <th className='py-3 px-4 text-left w-[14vw] min-w-[10vw]'>Người thu gom</th>
                            <th className='py-3 px-4 text-right w-[10vw] min-w-[8vw]'>Số sản phẩm</th>
                            <th className='py-3 px-4 text-right w-[14vw] min-w-[10vw]'>Khối lượng (kg)</th>
                            <th className='py-3 px-4 text-center w-[8vw] min-w-[6vw]'>Hành động</th>
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
                                    stt={startIndex + idx + 1}
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
