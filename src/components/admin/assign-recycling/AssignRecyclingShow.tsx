import React from 'react';
import { Eye } from 'lucide-react';

interface AssignedRecyclingShowProps {
    company: any;
    isLast?: boolean;
    index?: number;
    onViewTasks: (companyId: string) => void;
    onViewDetail: (companyId: string) => void;
}

const AssignRecyclingShow: React.FC<AssignedRecyclingShowProps> = ({
    company,
    isLast = false,
    index,
    onViewDetail,
}) => {
    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-16'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900 align-middle w-48'>
                {company.name || 'Không rõ'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-48'>
                {company.companyEmail || 'Chưa có email'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-36'>
                {company.phone || 'Chưa có SĐT'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-60'>
                {company.city || 'Chưa có địa chỉ'}
            </td>
            <td className='py-3 px-4 w-36'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => onViewDetail(company.id)}
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

export default AssignRecyclingShow;
