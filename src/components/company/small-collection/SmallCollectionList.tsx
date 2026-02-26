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
                        <div className='overflow-x-auto max-h-[44vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[45vh] xl:max-h-[44vh] overflow-y-auto w-full'>
                            <table className='min-w-full text-sm text-gray-800 table-fixed' style={{ tableLayout: 'fixed' }}>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[5vw] min-w-10'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw] min-w-60'>Tên điểm</th>
                                        <th className='py-3 px-4 text-left w-[18vw] min-w-80'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-center w-[7vw] min-w-40'>Giờ mở cửa</th>
                                        <th className='py-3 px-4 text-center w-[7vw] min-w-24'>Hành động</th>
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
