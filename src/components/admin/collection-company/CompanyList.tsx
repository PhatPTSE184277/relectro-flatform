import React from 'react';
import CompanyShow from './CompanyShow';
import CompanyTableSkeleton from './CompanyTableSkeleton';

interface CompanyListProps {
    companies: any[];
    loading: boolean;
    onViewDetail: (company: any) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
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
                                    <th className='py-3 px-4 text-left' style={{ width: '180px' }}>Tên công ty</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '200px' }}>Email</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '150px' }}>Số điện thoại</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '200px' }}>Thành phố</th>
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
                                        <CompanyTableSkeleton key={idx} />
                                    ))
                                ) : companies.length > 0 ? (
                                    companies.map((company, idx) => (
                                        <CompanyShow
                                            key={company.id}
                                            company={company}
                                            onView={() => onViewDetail(company)}
                                            isLast={idx === companies.length - 1}
                                            index={idx}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className='text-center py-8 text-gray-400'>
                                            Không có công ty nào.
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

export default CompanyList;
