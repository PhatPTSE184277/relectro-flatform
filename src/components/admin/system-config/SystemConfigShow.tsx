import React from 'react';
import { Edit, Download } from 'lucide-react';
import { SystemConfig } from '@/services/admin/SystemConfigService';

interface SystemConfigShowProps {
    config: SystemConfig;
    onEdit: (config: SystemConfig) => void;
    onViewFile?: (config: SystemConfig) => void;
    index?: number;
    isLast?: boolean;
}

const SystemConfigShow: React.FC<SystemConfigShowProps> = ({
    config,
    onEdit,
    index
}) => {
    const isUrl = config.value?.startsWith('http://') || config.value?.startsWith('https://');
    
    const handleDownload = () => {
        if (config.value) {
            const link = document.createElement('a');
            link.href = config.value;
            link.download = config.displayName + '.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    return (
        <tr
            className={`$
                !isLast ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/40 transition-colors`}
        >
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-base flex items-center justify-center font-bold mx-auto shadow-sm'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <div>{config.displayName || 'N/A'}</div>
            </td>

            <td className='py-3 px-2 text-right'>
                {isUrl ? (
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-medium transition cursor-pointer"
                        title="Tải file về máy"
                    >
                        <Download size={14} />
                        <span className="underline">Tải file</span>
                    </button>
                ) : (
                    <span className='font-medium'>{config.value}</span>
                )}
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
