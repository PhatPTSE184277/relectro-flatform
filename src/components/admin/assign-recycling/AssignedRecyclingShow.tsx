import React from 'react';
import { Eye } from 'lucide-react';

interface AssignedRecyclingShowProps {
    company: any;
    isLast?: boolean;
    index?: number;
    onViewTasks: (companyId: string) => void;
}

const AssignedRecyclingShow: React.FC<AssignedRecyclingShowProps> = ({
    company,
    isLast = false,
    index,
    onViewTasks
}) => {
    return (
            <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
                <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                        {index !== undefined ? index + 1 : ''}
                    </span>
                </td>
                <td className='py-3 px-4 font-medium' style={{ width: '180px' }}>
                    <div className='text-gray-900'>
                        {company.companyName || company.name || 'Không rõ'}
                    </div>
                </td>
                    <td className='py-3 px-4 text-gray-700' style={{ width: '200px' }}>
                        {company.address || 'Chưa có địa chỉ'}
                    </td>
                <td className='py-3 px-4' style={{ width: '140px' }}>
                    <div className='flex justify-center gap-2'>
                        <button
                            onClick={() => onViewTasks(company.companyId)}
                            className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                            title='Xem nhiệm vụ'
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                </td>
            </tr>
    );
};

export default AssignedRecyclingShow;
