import React from 'react';
import { Edit } from 'lucide-react';

interface ConfigShowProps {
    company: any;
    onEdit: (company: any) => void;
    index?: number;
}

const ConfigShow: React.FC<ConfigShowProps & { isLast?: boolean }> = ({
    company,
    onEdit,
    isLast = false,
    index
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
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-base flex items-center justify-center font-bold mx-auto shadow-sm'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>
                    {company.companyName || `Company ${company.companyId}`}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <span className='font-medium'>{company.ratioPercent}%</span>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <div className='flex flex-wrap gap-1'>
                    {company.smallPoints.map((sp: any, idx: number) => {
                        return (
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
                        );
                    })}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700 text-center'>
                <span className='text-xs font-medium text-gray-900'>
                    {activePoints}
                </span>
            </td>

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => onEdit(company)}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Chỉnh sửa'
                    >
                        <Edit size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ConfigShow;
