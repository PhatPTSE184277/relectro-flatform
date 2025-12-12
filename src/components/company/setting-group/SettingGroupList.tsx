import React from 'react';
import SettingGroupShow from './SettingGroupShow';
import SettingGroupTableSkeleton from './SettingGroupTableSkeleton';

interface SettingGroupListProps {
    points: any[];
    loading: boolean;
    onEdit: (point: any) => void;
}

const SettingGroupList: React.FC<SettingGroupListProps> = ({
    points,
    loading,
    onEdit
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Tên điểm thu gom</th>
                            <th className='py-3 px-4 text-center'>Thời gian phục vụ (phút)</th>
                            <th className='py-3 px-4 text-center'>Thời gian di chuyển (phút)</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <SettingGroupTableSkeleton key={idx} />
                            ))
                        ) : points.length > 0 ? (
                            points.map((point, idx) => (
                                <SettingGroupShow
                                    key={point.smallPointId}
                                    point={point}
                                    onEdit={() => onEdit(point)}
                                    isLast={idx === points.length - 1}
                                    index={idx}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className='text-center py-8 text-gray-400'>
                                    Không có điểm thu gom nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SettingGroupList;
