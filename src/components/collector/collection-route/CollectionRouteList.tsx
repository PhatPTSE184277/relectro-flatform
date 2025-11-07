/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Eye } from 'lucide-react';
import { formatTime } from '@/utils/FormatTime';
import CollectionRouteListSkeleton from './CollectionRouteListSkeleton';

interface CollectionRouteListProps {
    routes: any[];
    loading: boolean;
    selectedRoute: string | null;
    onSelectRoute: (id: string) => void;
    onViewDetail: (id: string) => void;
}

const CollectionRouteList: React.FC<CollectionRouteListProps> = ({
    routes,
    loading,
    selectedRoute,
    onSelectRoute,
    onViewDetail,
}) => (
    <div>
        <h2 className='text-lg font-bold text-gray-900 mb-4'>
            Danh sách tuyến ({routes.length})
        </h2>
        {loading ? (
            <CollectionRouteListSkeleton />
        ) : routes.length > 0 ? (
            <div className='space-y-3'>
                {routes.map((route) => (
                    <div
                        key={route.collectionRouteId}
                        className={`p-4 border-2 rounded-xl flex gap-3 items-center transition cursor-pointer ${
                            selectedRoute === route.collectionRouteId
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => onSelectRoute(route.collectionRouteId)}
                    >
                        <img
                            src={route.pickUpItemImages?.[0] || '/placeholder.png'}
                            alt={route.itemName}
                            className='w-20 h-20 rounded-lg object-cover flex-shrink-0'
                        />
                        <div className='flex-1 min-w-0'>
                            <h3 className='font-semibold text-gray-900 mb-1 truncate'>
                                {route.itemName}
                            </h3>
                            <p className='text-sm text-gray-600 mb-1 truncate'>
                                {route.sender?.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                                {formatTime(route.estimatedTime)}
                            </p>
                        </div>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                onViewDetail(route.collectionRouteId);
                            }}
                            className='text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer flex-shrink-0'
                            title='Xem chi tiết'
                        >
                            <Eye size={20} />
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className='text-center py-8 text-gray-400'>
                Không có tuyến thu gom nào.
            </div>
        )}
    </div>
);

export default CollectionRouteList;