import React from 'react';
import { Edit } from 'lucide-react';
import { WarehouseLoadThresholdConfig } from '@/services/admin/SystemConfigService';

interface LoadThresholdRowProps {
  config: WarehouseLoadThresholdConfig;
  index: number;
  isLast?: boolean;
  onEdit: (config: WarehouseLoadThresholdConfig) => void;
  disabled?: boolean;
}

const toPercent = (raw: string): string => {
  const num = Number(raw);
  if (!Number.isFinite(num)) return '-';
  const percent = num <= 1 ? num * 100 : num;
  return `${percent.toFixed(percent % 1 === 0 ? 0 : 2)}%`;
};

const LoadThresholdRow: React.FC<LoadThresholdRowProps> = ({
  config,
  index,
  isLast = false,
  onEdit,
  disabled = false
}) => {
  return (
    <tr
      className={`w-full ${!isLast ? 'border-b border-primary-100' : ''} ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50'}`}
    >
      <td className='py-3 px-4 text-center w-16'>
        <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
          {index + 1}
        </span>
      </td>
      <td className='py-3 px-4 text-left text-gray-800 font-medium'>{config.companyName || 'N/A'}</td>
      <td className='py-3 px-4 text-left text-gray-700'>{config.scpName || 'N/A'}</td>
      <td className='py-3 px-4 text-center'>
        <span className='inline-flex px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold'>
          {toPercent(String(config.value || '0'))}
        </span>
      </td>
      <td className='py-3 px-4 text-center w-40'>
        <button
          type='button'
          onClick={() => onEdit(config)}
          disabled={disabled}
          className={`inline-flex w-full items-center justify-center text-primary-600 hover:text-primary-800 font-medium transition ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title='Cập nhật'
        >
          <Edit size={16} />
        </button>
      </td>
    </tr>
  );
};

export default LoadThresholdRow;
