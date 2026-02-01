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
    return (
        <tr
            className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors cursor-pointer`}
            onClick={onSelect}
        >
            <td className='py-3 px-4 text-center w-[6vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index + 1}
                </span>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div className='text-gray-900 font-medium'>{company.companyName || 'N/A'}</div>
            </td>
            <td className='py-3 pr-4 text-right w-auto'>
                <div className='text-gray-900 font-medium'>
                    {company.totalProducts ?? company.totalOrders ?? 0}
                </div>
            </td>
        </tr>
    );
};

export default CompanyShow;
