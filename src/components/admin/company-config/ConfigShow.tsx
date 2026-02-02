import React from 'react';
import { Eye } from 'lucide-react';

interface ConfigShowProps {
    company: any;
    index?: number;
    onView?: (company: any) => void;
}

const ConfigShow: React.FC<ConfigShowProps & { isLast?: boolean }> = ({
    company,
    isLast = false,
    index,
    onView
}) => {
    const activePoints = company.smallPoints.filter(
        (sp: any) => sp.active
    ).length;

    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-base flex items-center justify-center font-bold mx-auto shadow-sm'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-[28vw] text-left'>
                <div className='text-gray-900'>
                    {company.companyName || `Company ${company.companyId}`}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 text-right w-[12vw]'>
                <span className='font-medium'>{company.ratioPercent}</span>
            </td>
            <td className='py-3 px-4 text-gray-700 text-right w-[12vw]'>
                <span className='text-xs font-medium text-gray-900'>
                    {activePoints}
                </span>
            </td>
            <td className='py-3 px-4 text-center w-[10vw]'>
                <button
                    onClick={() => onView?.(company)}
                    className='text-primary-600 hover:text-primary-800 flex items-center justify-center transition cursor-pointer mx-auto'
                    title='Xem chi tiết'
                >
                    <Eye size={16} />
                </button>
            </td>
        </tr>
    );
};

export default ConfigShow;
