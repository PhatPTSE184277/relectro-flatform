import React from 'react';
import AssignedRecyclingShow from './AssignedRecyclingShow';
import AssignedRecyclingSkeleton from './AssignedRecyclingSkeleton';

interface AssignedRecyclingListProps {
    companies: any[];
    loading: boolean;
    onViewTasks: (companyId: string) => void;
}

const AssignedRecyclingList: React.FC<AssignedRecyclingListProps> = ({ 
    companies, 
    loading,
    onViewTasks
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
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Công ty tái chế</th>
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
                                            key={company.companyId}
                                            company={company}
                                            isLast={idx === companies.length - 1}
                                            index={idx}
                                            onViewTasks={onViewTasks}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='text-center py-8 text-gray-400'>
                                            Không có công ty tái chế nào.
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
