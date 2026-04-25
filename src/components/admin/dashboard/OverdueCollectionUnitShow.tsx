import React from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
import type { OverdueSummaryItem } from '@/services/admin/DashboardService';

interface OverdueCollectionUnitShowProps {
  item: OverdueSummaryItem;
  index: number;
  isLast?: boolean;
  isIncreased?: boolean;
  onSelect: () => void;
}

const OverdueCollectionUnitShow: React.FC<OverdueCollectionUnitShowProps> = ({
  item,
  index,
  isLast = false,
  isIncreased = false,
  onSelect,
}) => {
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';

  return (
    <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
      <td className='py-3 px-4 text-center w-[6vw]'>
        <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
          {formatNumber(index + 1)}
        </span>
      </td>
      <td className='py-3 px-4 w-[20vw]'>
        <div className='text-gray-900 font-medium'>{item.scpName || 'N/A'}</div>
      </td>
      <td className='py-3 pr-4 text-right w-auto'>
        <div className='flex items-center justify-end gap-2'>
          {isIncreased && (
            <span title='Số lượng đã tăng'>
              <TrendingUp size={18} className='text-green-600 animate-pulse' />
            </span>
          )}
          <span className='text-gray-900 font-medium'>{formatNumber(item.totalOverdueCount)}</span>
        </div>
      </td>
      <td className='py-3 px-4 w-[10vw]'>
        <div className='flex items-center justify-center'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
            title='Xem chi tiết đơn quá hạn'
            aria-label='Xem chi tiết đơn quá hạn'
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OverdueCollectionUnitShow;
