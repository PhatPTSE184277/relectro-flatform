import React from 'react';
import { Eye } from 'lucide-react';

interface CompanyShowProps {
    company: any;
    onView: () => void;
}

const CompanyShow: React.FC<CompanyShowProps & { isLast?: boolean }> = ({
    company,
    onView,
    isLast = false
}) => {
    const getStatusBadgeClass = (status: string) => {
        const normalized = status?.toLowerCase() || '';
        if (normalized === 'active') return 'bg-green-100 text-green-700';
        if (normalized === 'inactive') return 'bg-gray-100 text-gray-600';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{company.name || 'Không rõ'}</div>
                <div className='text-xs text-gray-500'>ID: {company.id}</div>
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

            <td className='py-3 px-4 text-center'>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(company.status)}`}>
                    {company.status || 'Không rõ'}
                </span>
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
