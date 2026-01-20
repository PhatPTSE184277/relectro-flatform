import React from 'react';
import SmallCollectionShow from './SmallCollectionShow';
import SmallCollectionTableSkeleton from './SmallCollectionTableSkeleton';
import { SmallCollectionPoint } from '@/types';

interface SmallCollectionListProps {
    collections: SmallCollectionPoint[];
    loading: boolean;
    onViewDetail: (point: SmallCollectionPoint) => void;
}

const SmallCollectionList: React.FC<SmallCollectionListProps> = ({
    collections,
    loading,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-96 overflow-y-auto w-full min-w-full'>
                            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-60'>Tên điểm</th>
                                        <th className='py-3 px-4 text-left w-80'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-center w-40'>Giờ mở cửa</th>
                                        <th className='py-3 px-4 text-center w-24'>Hành động</th>
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
                </div>
            </div>
        </div>
    );
};

export default SmallCollectionList;
