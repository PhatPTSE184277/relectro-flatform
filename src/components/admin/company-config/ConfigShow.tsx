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

    return (
        <tr
            className={`${
                !isLast ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/40 transition-colors`}
        >
            <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-base flex items-center justify-center font-bold mx-auto shadow-sm'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium' style={{ width: '180px' }}>
                <div className='text-gray-900'>
                    {company.companyName || `Company ${company.companyId}`}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 text-center' style={{ width: '120px' }}>
                <span className='font-medium'>{company.ratioPercent}</span>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '250px' }}>
                <div className='flex flex-wrap gap-1'>
                    {company.smallPoints.slice(0, 3).map((sp: any, idx: number) => (
                        <span
                            key={idx}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sp.active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {sp.name || `Point ${sp.smallPointId}`}
                        </span>
                    ))}
                    {company.smallPoints.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">+{company.smallPoints.length - 3}</span>
                    )}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 text-center' style={{ width: '120px' }}>
                <span className='text-xs font-medium text-gray-900'>
                    {activePoints}
                </span>
            </td>
            <td className='py-3 px-4 text-center' style={{ width: '140px' }}>
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
