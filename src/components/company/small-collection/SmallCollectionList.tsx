import React from 'react';
import SmallCollectionShow from './SmallCollectionShow';
import SmallCollectionTableSkeleton from './SmallCollectionTableSkeleton';
import { SmallCollectionPoint } from '@/types';

interface SmallCollectionListProps {
    collections: SmallCollectionPoint[];
    loading: boolean;
    onViewDetail: (point: SmallCollectionPoint) => void;
    selectedId: number | null;
    onSelectPoint: (id: number | null) => void;
}

const SmallCollectionList: React.FC<SmallCollectionListProps> = ({
    collections,
    loading,
    onViewDetail,
    selectedId,
    onSelectPoint
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Tên điểm</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                            <th className='py-3 px-4 text-center'>Giờ mở cửa</th>
                            {/* Xoá cột trạng thái */}
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <SmallCollectionTableSkeleton key={idx} />
                            ))
                        ) : collections.length > 0 ? (
                            collections.map((point, idx) => (
                                <SmallCollectionShow
                                    key={point.id}
                                    point={point}
                                    onView={() => onViewDetail(point)}
                                    isLast={idx === collections.length - 1}
                                    index={idx}
                                    isSelected={selectedId === point.id}
                                    onSelect={() => onSelectPoint(point.id)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className='text-center py-8 text-gray-400'
                                >
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

export default SmallCollectionList;
