import React from 'react';
import CollectorShow from './CollectorShow';
import CollectorTableSkeleton from './CollectorTableSkeleton';
import { Collector } from '@/types';

interface CollectorListProps {
    collectors: Collector[];
    loading: boolean;
    onViewDetail: (collector: Collector) => void;
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
                        <div className='max-h-96 overflow-y-auto w-full min-w-full'>
                            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-60'>Nhân viên</th>
                                        <th className='py-3 px-4 text-left w-60'>Email</th>
                                        <th className='py-3 px-4 text-left w-40'>Số điện thoại</th>
                                        <th className='py-3 px-4 text-center w-40'>Điểm thu gom</th>
                                        <th className='py-3 px-4 text-center w-24'>Hành động</th>
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
