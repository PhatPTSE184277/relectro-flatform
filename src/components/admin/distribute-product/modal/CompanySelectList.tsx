import React from 'react';

interface CompanySelectListProps {
    company: any;
    stt: number;
    isSelected: boolean;
    onToggleSelect: () => void;
    isLast?: boolean;
}

const CompanySelectList: React.FC<CompanySelectListProps> = ({
    company,
    stt,
    isSelected,
    onToggleSelect,
    isLast = false
}) => {
    return (
        <tr 
            className={`${!isLast ? 'border-b border-primary-100' : ''} ${isSelected ? 'bg-primary-50' : ''} hover:bg-primary-50/40 transition-colors cursor-pointer`}
            onClick={onToggleSelect}
        >
            <td className='py-3 px-4 text-center w-16'>
                <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={onToggleSelect}
                    onClick={(e) => e.stopPropagation()}
                    className='w-4 h-4 text-primary-600 bg-white rounded focus:ring-2 focus:ring-primary-500 cursor-pointer'
                />
            </td>
            <td className='py-3 px-4 text-center w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div className='text-gray-900 font-medium'>{company.name || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>{company.companyEmail || ''}</div>
            </td>
            <td className='py-3 px-4 w-[15vw]'>
                <div className='text-gray-700'>{company.phone || 'N/A'}</div>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div className='text-gray-700 line-clamp-2'>{company.city || 'N/A'}</div>
            </td>
        </tr>
    );
};

export default CompanySelectList;
