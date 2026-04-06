import React from 'react';
import { Edit, Download } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
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
    index,
    isLast
}) => {
    const isUrl = config.value?.startsWith('http://') || config.value?.startsWith('https://');
    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    const displayNameLower = String(config.displayName || '').toLowerCase();
    const isRadiusConfig = displayNameLower.includes('bán kính') && displayNameLower.includes('qr');
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
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {index !== undefined ? formatNumber(index + 1) : ''}
                </span>
            </td>

            <td className='py-3 px-4 text-gray-700' style={{ width: '220px' }}>
                <div>{config.displayName || 'N/A'}</div>
            </td>

            <td className='py-3 px-2 text-right' style={{ width: '220px' }}>
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
                    <span className='font-medium'>
                        {config.value ? (isRadiusConfig ? `${config.value} m` : config.value) : ''}
                    </span>
                )}
            </td>

            <td className='py-3 px-4 text-center' style={{ width: '140px' }}>
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
