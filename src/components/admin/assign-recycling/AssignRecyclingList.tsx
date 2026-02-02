import React from 'react';
import AssignedRecyclingShow from './AssignRecyclingShow';
import AssignedRecyclingSkeleton from './AssignRecyclingSkeleton';

interface AssignRecyclingListProps {
    companies: any[];
    loading: boolean;
    onViewTasks: (companyId: string) => void;
    onViewDetail: (companyId: string) => void;
}

const AssignRecyclingList: React.FC<AssignRecyclingListProps> = ({ 
    companies, 
    loading,
    onViewTasks,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <div className='max-h-105 overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                            <tr>
                                <th className='py-3 px-4 text-center w-16'>STT</th>
                                <th className='py-3 px-4 text-left w-48'>Tên công ty</th>
                                <th className='py-3 px-4 text-left w-48'>Email</th>
                                <th className='py-3 px-4 text-left w-36'>SĐT</th>
                                <th className='py-3 px-4 text-left w-60'>Địa chỉ</th>
                                <th className='py-3 px-4 text-center w-36'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <AssignedRecyclingSkeleton key={idx} />
                                ))
                            ) : companies.length > 0 ? (
                                companies.map((company, idx) => (
                                    <AssignedRecyclingShow
                                        key={company.id ? company.id : `company-${idx}`}
                                        company={company}
                                        isLast={idx === companies.length - 1}
                                        index={idx}
                                        onViewTasks={onViewTasks}
                                        onViewDetail={onViewDetail}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center py-8 text-gray-400'>
                                        Không có công ty thu gom nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignRecyclingList;
