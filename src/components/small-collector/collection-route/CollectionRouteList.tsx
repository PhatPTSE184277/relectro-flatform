import CollectionRouteShow from './CollectionRouteShow';
import CollectionRouteTableSkeleton from './CollectionRouteTableSkeleton';
import type { CollectionRoute } from '@/types/CollectionRoute';


interface CollectionRouteListProps {
    routes: CollectionRoute[];
    loading: boolean;
    onViewDetail: (id: string) => void;
    tableRef?: React.Ref<HTMLDivElement>;
}


const CollectionRouteList: React.FC<CollectionRouteListProps> = ({
    routes,
    loading,
    onViewDetail,
    tableRef
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-96 overflow-y-auto' ref={tableRef}>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center' style={{ width: '60px' }}>STT</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Thương hiệu</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '160px' }}>Người gửi</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '160px' }}>Người thu gom</th>
                                        <th className='py-3 px-4 text-left' style={{ width: '250px' }}>Địa chỉ</th>
                                        <th className='py-3 px-4 text-center' style={{ width: '140px' }}>Thời gian dự kiến</th>
                                        <th className='py-3 px-4 text-center' style={{ width: '100px' }}>Hành động</th>
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
                </div>
            </div>
        </div>
    );
};

export default CollectionRouteList;