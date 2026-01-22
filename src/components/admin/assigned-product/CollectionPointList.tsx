import React from 'react';
import CollectionPointShow from './CollectionPointShow';
import CompanySkeleton from './CompanySkeleton';

interface CollectionPointListProps {
    points: any[];
    loading: boolean;
    onViewProducts: (point: any) => void;
}

const CollectionPointList: React.FC<CollectionPointListProps> = ({ points, loading, onViewProducts }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='max-h-108 overflow-y-auto'>
                        <table className='w-full text-sm text-gray-800 table-fixed'>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                <tr>
                                    <th className='py-3 px-4 text-center w-16'>STT</th>
                                    <th className='py-3 px-4 text-left'>Điểm thu gom</th>
                                    <th className='py-3 px-4 text-left w-40'>Số sản phẩm</th>
                                    <th className='py-3 px-4 text-center w-32'>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <CompanySkeleton key={idx} />
                                    ))
                                ) : points.length > 0 ? (
                                    points.map((point, idx) => (
                                        <CollectionPointShow
                                            key={point.smallCollectionId}
                                            point={point}
                                            stt={idx + 1}
                                            onViewProducts={() => onViewProducts(point)}
                                            isLast={idx === points.length - 1}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='text-center py-8 text-gray-400'>
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
    );
};

export default CollectionPointList;
