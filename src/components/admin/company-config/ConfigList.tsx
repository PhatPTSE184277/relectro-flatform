import React from 'react';
import ConfigShow from './ConfigShow';
import ConfigTableSkeleton from './ConfigTableSkeleton';

interface ConfigListProps {
    companies: any[];
    loading: boolean;
    onViewDetail?: (company: any) => void;
}

const ConfigList: React.FC<ConfigListProps> = ({
    companies,
    loading,
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
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Công ty</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '120px' }}>Tỷ lệ (%)</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '250px' }}>Điểm thu gom</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '120px' }}>Số điểm thu gom</th>
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
                                        <ConfigTableSkeleton key={idx} />
                                    ))
                                ) : companies.length > 0 ? (
                                    companies.map((company, idx) => (
                                        <ConfigShow
                                            key={company.companyId}
                                            company={company}
                                            isLast={idx === companies.length - 1}
                                            index={idx}
                                            onView={onViewDetail}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className='text-center py-8 text-gray-400'>
                                            Không có cấu hình nào.
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

export default ConfigList;
