import React from 'react';
import { Edit } from 'lucide-react';
import { SystemConfig } from '@/services/admin/SystemConfigService';

interface SystemConfigShowProps {
    config: SystemConfig;
    onEdit: (config: SystemConfig) => void;
    index?: number;
    isLast?: boolean;
}

const SystemConfigShow: React.FC<SystemConfigShowProps> = ({
    config,
    onEdit,
    isLast = false,
    index
}) => {
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
                <div className='text-gray-900'>{config.key}</div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <div>{config.displayName || 'N/A'}</div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <span className='font-medium'>{config.value}</span>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <span className='px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                    {config.groupName}
                </span>
            </td>

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => onEdit(config)}
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

export default SystemConfigShow;
