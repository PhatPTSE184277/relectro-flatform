import React from 'react';
import ConfigShow from './ConfigShow';
import ConfigTableSkeleton from './ConfigTableSkeleton';

interface ConfigListProps {
    companies: any[];
    loading: boolean;
    onEdit: (company: any) => void;
}

const ConfigList: React.FC<ConfigListProps> = ({
    companies,
    loading,
    onEdit
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>Công ty</th>
                            <th className='py-3 px-4 text-left'>Tỷ lệ (%)</th>
                            <th className='py-3 px-4 text-left'>Điểm thu gom</th>
                            <th className='py-3 px-4 text-left'>Số điểm thu gom</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <ConfigTableSkeleton key={idx} />
                            ))
                        ) : companies.length > 0 ? (
                            companies.map((company, idx) => (
                                <ConfigShow
                                    key={company.companyId}
                                    company={company}
                                    onEdit={onEdit}
                                    isLast={idx === companies.length - 1}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-400'>
                                    Không có cấu hình nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConfigList;
