import React from 'react';
import CollectionRouteShow from './CollectionRouteShow';
import CollectionRouteTableSkeleton from './CollectionRouteTableSkeleton';
import type { CollectionRoute } from '@/types/CollectionRoute';

interface CollectionRouteListProps {
    routes: CollectionRoute[];
    loading: boolean;
    onViewDetail: (id: string) => void;
}

const CollectionRouteList: React.FC<CollectionRouteListProps> = ({
    routes,
    loading,
    onViewDetail,
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left'>Người gửi</th>
                            <th className='py-3 px-4 text-left'>Người thu gom</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                            <th className='py-3 px-4 text-center'>Thời gian dự kiến</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <CollectionRouteTableSkeleton key={idx} />
                            ))
                        ) : routes.length > 0 ? (
                            routes.map((route, idx) => (
                                <CollectionRouteShow
                                    key={route.collectionRouteId}
                                    route={route}
                                    onView={() => onViewDetail(route.collectionRouteId)}
                                    isLast={idx === routes.length - 1}
                                    stt={idx + 1}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='text-center py-8 text-gray-400'>
                                    Không có tuyến thu gom nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CollectionRouteList;