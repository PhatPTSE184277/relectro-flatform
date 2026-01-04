import React from 'react';
import AssignedRecyclingShow from './AssignedRecyclingShow';
import AssignedRecyclingSkeleton from './AssignedRecyclingSkeleton';

interface AssignedRecyclingListProps {
    companies: any[];
    loading: boolean;
    onViewTasks: (companyId: string) => void;
    onViewDetail: (companyId: string) => void;
}

const AssignedRecyclingList: React.FC<AssignedRecyclingListProps> = ({ 
    companies, 
    loading,
    onViewTasks,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                <tr>
                                    <th className='py-3 px-4 text-center' style={{ width: '60px' }}>STT</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Tên công ty</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Email</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '140px' }}>SĐT</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '200px' }}>Địa chỉ</th>
                                    <th className='py-3 px-4 text-center' style={{ width: '140px' }}>Hành động</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='max-h-90 overflow-y-auto'>
                        <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
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
        </div>
    );
};

export default AssignedRecyclingList;
