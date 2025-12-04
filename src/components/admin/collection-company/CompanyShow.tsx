import React from 'react';
import { Eye } from 'lucide-react';

interface CompanyShowProps {
    company: any;
    onView: () => void;
    index?: number;
}

const CompanyShow: React.FC<CompanyShowProps & { isLast?: boolean }> = ({
    company,
    onView,
    isLast = false,
    index
}) => {

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-base flex items-center justify-center font-bold mx-auto shadow-sm'>
                    {typeof index === 'number' ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{company.name || 'Không rõ'}</div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {company.companyEmail || <span className='text-gray-400'>Chưa có</span>}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {company.phone || <span className='text-gray-400'>Chưa có</span>}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {company.city || <span className='text-gray-400'>Chưa có</span>}
            </td>

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CompanyShow;
