import React from 'react';
import type { CollectionRoute } from '@/types/CollectionRoute';
import SeedQRProductShow from './SeedQRProductShow';
import SeedQRProductTableSkeleton from './SeedQRProductTableSkeleton';

interface SeedQRProductListProps {
    routes: CollectionRoute[];
    loading: boolean;
    selectedIds: Set<string>;
    onToggle: (routeId: string) => void;
    onToggleAll: () => void;
}

const SeedQRProductList: React.FC<SeedQRProductListProps> = ({
    routes,
    loading,
    selectedIds,
    onToggle,
    onToggleAll
}) => {
    const allSelected = routes.length > 0 && routes.every(r => selectedIds.has(r.collectionRouteId));
    const someSelected = routes.some(r => selectedIds.has(r.collectionRouteId));

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto max-h-[65vh] overflow-y-auto'>
                <table className='min-w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-center w-[5vw] min-w-10'>
                                <input
                                    type='checkbox'
                                    checked={allSelected}
                                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                                    onChange={onToggleAll}
                                    className='w-4 h-4 cursor-pointer accent-primary-600'
                                />
                            </th>
                            <th className='py-3 px-4 text-center w-[5vw] min-w-10'>STT</th>
                            <th className='py-3 px-4 text-left w-[18vw] min-w-24'>Người gửi</th>
                            <th className='py-3 px-4 text-left w-[14vw] min-w-20'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left w-[22vw] min-w-32'>Địa chỉ</th>
                            <th className='py-3 px-4 text-center w-[10vw] min-w-16'>Giờ ước tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <SeedQRProductTableSkeleton key={idx} />
                            ))
                        ) : routes.length > 0 ? (
                            routes.map((route, idx) => (
                                <SeedQRProductShow
                                    key={route.collectionRouteId}
                                    route={route}
                                    stt={idx + 1}
                                    isLast={idx === routes.length - 1}
                                    checked={selectedIds.has(route.collectionRouteId)}
                                    onToggle={() => onToggle(route.collectionRouteId)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className='text-center py-10 text-gray-400'>
                                    Không có tuyến thu gom nào cho ngày này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeedQRProductList;
