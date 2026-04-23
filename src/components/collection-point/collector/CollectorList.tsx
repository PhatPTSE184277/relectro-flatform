import React from 'react';
import CollectorShow from './CollectorShow';
import CollectorTableSkeleton from './CollectorTableSkeleton';
import type { CollectorStatusFilter } from '@/contexts/collection-point/CollectorContext';

interface CollectorListProps {
    collectors: any[];
    loading: boolean;
    filterStatus: CollectorStatusFilter;
    onBlock: (collector: any) => void;
    onActivate: (collector: any) => void;
    actionLoading: boolean;
    page?: number;
    limit?: number;
}

const CollectorList: React.FC<CollectorListProps> = ({
    collectors,
    loading,
    filterStatus,
    onBlock,
    onActivate,
    actionLoading,
    page = 1,
    limit = 10,
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='overflow-x-auto max-h-[44vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[55] xl:max-h-[53vh] overflow-y-auto'>
                            <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[5vw] min-w-10'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw] min-w-48'>Nhân viên</th>
                                        <th className='py-3 px-4 text-left w-[14vw] min-w-48'>Email</th>
                                        <th className='py-3 px-4 text-left w-[12vw] min-w-36'>Số điện thoại</th>
                                        <th className='py-3 px-4 text-center w-[10vw] min-w-28'>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <CollectorTableSkeleton key={idx} />
                                        ))
                                    ) : collectors.length > 0 ? (
                                        collectors.map((collector, idx) => {
                                            const globalIndex = (page - 1) * limit + idx;
                                            return (
                                                <CollectorShow
                                                    key={collector.collectorId}
                                                    collector={collector}
                                                    filterStatus={filterStatus}
                                                    onBlock={() => onBlock(collector)}
                                                    onActivate={() => onActivate(collector)}
                                                    actionLoading={actionLoading}
                                                    isLast={idx === collectors.length - 1}
                                                    index={globalIndex}
                                                />
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className='text-center py-8 text-gray-400'>
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
