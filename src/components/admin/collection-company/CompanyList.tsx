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
                <div className='max-h-90 overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                            <tr>
                                <th className='py-3 px-4 text-center w-16'>STT</th>
                                <th className='py-3 px-4 text-left w-44'>Tên công ty</th>
                                <th className='py-3 px-4 text-left w-52'>Email</th>
                                <th className='py-3 px-4 text-left w-36'>Số điện thoại</th>
                                <th className='py-3 px-4 text-left w-52'>Thành phố</th>
                                <th className='py-3 px-4 text-center w-36'>Hành động</th>
                            </tr>
                        </thead>
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
    );
};

export default CompanyList;
