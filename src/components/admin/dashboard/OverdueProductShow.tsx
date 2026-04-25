import React from 'react';
import { formatDate } from '@/utils/FormatDate';
import { formatNumber } from '@/utils/formatNumber';

interface OverdueProductShowProps {
  product: any;
  stt: number;
  isLast?: boolean;
}

const OverdueProductShow: React.FC<OverdueProductShowProps> = ({ product, stt, isLast = false }) => {
  const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

  return (
    <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
      <td className='py-3 px-4 text-center w-[5vw]'>
        <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
          {formatNumber(stt)}
        </span>
      </td>
      <td className='py-3 px-4 w-[12vw]'>
        <div className='text-gray-900 font-medium truncate' title={product.userName || 'N/A'}>
          {product.userName || 'N/A'}
        </div>
      </td>
      <td className='py-3 px-4 w-[10vw]'>
        <div className='text-gray-700 truncate' title={product.phoneNumber || '-'}>
          {product.phoneNumber || '-'}
        </div>
      </td>
      <td className='py-3 px-4 w-[12vw]'>
        <div className='text-gray-700 truncate' title={product.brandName || '-'}>
          {product.brandName || '-'}
        </div>
      </td>
      <td className='py-3 px-4 w-[12vw]'>
        <div className='text-gray-700 truncate' title={product.categoryName || '-'}>
          {product.categoryName || '-'}
        </div>
      </td>
      <td className='py-3 px-4 w-[8vw]'>
        <div className='text-gray-700 whitespace-nowrap'>{formatDate(product.deadlineDate)}</div>
      </td>
      <td className='py-3 px-4 w-[7vw] text-right text-red-600 font-semibold'>
        {formatNumber(product.daysDelayed)}
      </td>
    </tr>
  );
};

export default OverdueProductShow;
