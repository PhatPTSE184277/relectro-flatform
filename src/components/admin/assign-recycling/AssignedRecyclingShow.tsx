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
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>
                    {company.companyName || 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700'>
                {company.smallPoints?.length || 0}
            </td>
            <td className='py-3 px-4 text-gray-700'>
                <div className='max-w-md'>
                    {company.smallPoints && company.smallPoints.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                            {company.smallPoints.slice(0, 3).map((point: any, idx: number) => (
                                <span key={idx} className='text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full'>
                                    {point.name}
                                </span>
                            ))}
                            {company.smallPoints.length > 3 && (
                                <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                                    +{company.smallPoints.length - 3} khác
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className='text-gray-400'>Chưa có</span>
                    )}
                </div>
            </td>
            <td className='py-3 px-4'>
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
