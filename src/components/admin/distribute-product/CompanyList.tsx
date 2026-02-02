import React from 'react';
import CompanyShow from './CompanyShow';

interface CompanyListProps {
    companies: any[];
    loading: boolean;
    onSelectCompany: (company: any) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    loading,
    onSelectCompany
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[56vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[48vh] xl:max-h-[56vh] overflow-y-auto w-full'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[20vw]'>Công ty</th>
                                        <th className='py-3 pr-4 text-right w-auto'>Tổng sản phẩm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-gray-100'>
                                                <td className='py-3 px-4 text-center'>
                                                    <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                                                </td>
                                                <td className='py-3 pr-4 text-right'>
                                                    <div className='h-6 bg-gray-200 rounded w-10 animate-pulse ml-auto' />
                                                </td>
                                            </tr>
                                        ))
                                    ) : companies.length > 0 ? (
                                        companies.map((company, idx) => (
                                            <CompanyShow
                                                key={company.companyId}
                                                company={company}
                                                onSelect={() => onSelectCompany(company)}
                                                isLast={idx === companies.length - 1}
                                                index={idx}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className='text-center py-8 text-gray-400'>
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
        </div>
    );
};

export default CompanyList;
