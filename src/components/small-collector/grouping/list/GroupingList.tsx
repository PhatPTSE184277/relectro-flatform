import React from 'react';
import GroupingShow from './GroupingShow';
import GroupingTableSkeleton from './GroupingTableSkeleton';

interface GroupingListProps {
    groupings: any[];
    loading: boolean;
    onViewDetail: (grouping: any) => void;
}

const GroupingList: React.FC<GroupingListProps> = ({
    groupings,
    loading,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>Mã nhóm</th>
                            <th className='py-3 px-4 text-left'>Ngày thu gom</th>
                            <th className='py-3 px-4 text-left'>Phương tiện</th>
                            <th className='py-3 px-4 text-left'>Người thu gom</th>
                            <th className='py-3 px-4 text-left'>Số bưu phẩm</th>
                            <th className='py-3 px-4 text-left'>Khối lượng</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <GroupingTableSkeleton key={idx} />
                            ))
                        ) : groupings.length > 0 ? (
                            groupings.map((group) => (
                                <GroupingShow
                                    key={group.groupId}
                                    grouping={group}
                                    onViewDetail={onViewDetail}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='text-center py-8 text-gray-400'>
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
