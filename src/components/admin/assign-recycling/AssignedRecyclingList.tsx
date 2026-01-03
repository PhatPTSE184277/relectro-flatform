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
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Công ty tái chế</th>
                            <th className='py-3 px-4 text-left'>Số điểm thu gom</th>
                            <th className='py-3 px-4 text-left'>Điểm thu gom</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
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
                                    key={company.companyId}
                                    company={company}
                                    isLast={idx === companies.length - 1}
                                    index={idx}
                                    onViewTasks={onViewTasks}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-400'>
                                    Không có công ty tái chế nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedRecyclingList;
