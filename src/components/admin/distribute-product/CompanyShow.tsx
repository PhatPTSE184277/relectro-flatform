import React from 'react';

interface CompanyShowProps {
    company: any;
    onSelect: () => void;
    isLast?: boolean;
    index: number;
}

const CompanyShow: React.FC<CompanyShowProps> = ({
    company,
    onSelect,
    isLast,
    index
}) => {
    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    const total = company.totalProducts ?? company.totalOrders ?? 0;
    const isCustomer = !!company.isCustomer || /ute/i.test(company.companyName ?? '');

    return (
        <tr
            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} cursor-pointer`}
            onClick={onSelect}
        >
            <td className='py-3 px-4 text-center w-[6vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index + 1}
                </span>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div className='flex items-center gap-2'>
                    <div className='text-gray-900 font-medium'>{company.companyName || 'N/A'}</div>
                    {isCustomer ? (
                        <span className='text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full'>
                            Công ty khách
                        </span>
                    ) : null}
                </div>
            </td>
            <td className='py-3 pr-4 text-right w-auto'>
                <div className='text-gray-900 font-medium'>
                    {total}
                </div>
            </td>
        </tr>
    );
};

export default CompanyShow;
