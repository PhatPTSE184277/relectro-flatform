import React, { useRef, useEffect } from 'react';
import CompanyShow from './CompanyShow';
import CompanySkeleton from './CompanySkeleton';

interface CompanyListProps {
    companies: any[];
    loading: boolean;
    onViewPoints: (company: any) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, loading, onViewPoints }) => {
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [companies]);

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='max-h-108 overflow-y-auto' ref={bodyRef}>
                        <table className='w-full text-sm text-gray-800 table-fixed'>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                <tr>
                                    <th className='py-3 px-4 text-center w-16'>STT</th>
                                    <th className='py-3 px-4 text-left'>Công ty thu gom</th>
                                    <th className='py-3 px-4 text-left w-40'>Tổng sản phẩm</th>
                                    <th className='py-3 px-4 text-center w-32'>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <CompanySkeleton key={idx} />
                                    ))
                                ) : companies.length > 0 ? (
                                    companies.map((company, idx) => (
                                        <CompanyShow
                                            key={company.companyId}
                                            company={company}
                                            stt={idx + 1}
                                            onViewPoints={() => onViewPoints(company)}
                                            isLast={idx === companies.length - 1}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='text-center py-8 text-gray-400'>
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

export default CompanyList;
