import React from 'react';
import CollectorShow from './CollectorShow';
import CollectorTableSkeleton from './CollectorTableSkeleton';

interface CollectorListProps {
    collectors: any[];
    loading: boolean;
    onViewDetail: (collector: any) => void;
}

const CollectorList: React.FC<CollectorListProps> = ({
    collectors,
    loading,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='overflow-x-auto max-h-[44vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[60] xl:max-h-[63vh] overflow-y-auto'>
                            <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[5vw] min-w-10'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw] min-w-48'>Nhân viên</th>
                                        <th className='py-3 px-4 text-left w-[14vw] min-w-48'>Email</th>
                                        <th className='py-3 px-4 text-left w-[12vw] min-w-36'>Số điện thoại</th>
                                        <th className='py-3 px-4 text-left w-[12vw] min-w-36'>Điểm thu gom</th>
                                        <th className='py-3 px-4 text-center w-[7vw] min-w-24'>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <CollectorTableSkeleton key={idx} />
                                        ))
                                    ) : collectors.length > 0 ? (
                                        collectors.map((collector, idx) => (
                                            <CollectorShow
                                                key={collector.collectorId}
                                                collector={collector}
                                                onView={() => onViewDetail(collector)}
                                                isLast={idx === collectors.length - 1}
                                                index={idx}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-8 text-gray-400'>
                                                Không có nhân viên thu gom nào.
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

export default CollectorList;
