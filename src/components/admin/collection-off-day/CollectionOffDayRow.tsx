'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import { formatDate } from '@/utils/FormatDate';
import type { CollectionOffDayItem } from './CollectionOffDayList';

interface Props {
  item: CollectionOffDayItem;
  index: number;
  isLast: boolean;
  onCancel: () => void;
}

const CollectionOffDayRow: React.FC<Props> = ({ item, index, isLast, onCancel }) => {
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';
  const border = !isLast ? 'border-b border-primary-100' : '';

  return (
    <tr className={`${border} ${rowBg}`}> 
      <td className='py-3 px-4 text-center'>
        <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
          {item.stt}
        </span>
      </td>
      <td className='py-3 px-4 font-medium text-gray-900 truncate' title={item.companyName}>
        {item.companyName || 'N/A'}
      </td>
      <td className='py-3 px-4 truncate' title={item.pointName}>
        {item.pointName || 'N/A'}
      </td>
      <td className='py-3 px-4 text-center whitespace-nowrap'>
        {formatDate(item.date) || item.date || ''}
      </td>
      <td className='py-3 px-4 truncate' title={item.reason || ''}>
        {item.reason || ''}
      </td>
      <td className='py-3 px-4 text-center'>
        <div className='flex justify-center gap-2'>
          <button
            onClick={onCancel}
            className='text-red-600 hover:text-red-800 flex items-center gap-1 font-medium transition cursor-pointer'
            title='Hủy lịch nghỉ'
          >
            <XCircle size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CollectionOffDayRow;
