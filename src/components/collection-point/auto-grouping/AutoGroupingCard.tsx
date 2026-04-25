'use client';

import React from 'react';
import { AutoGroupingSettings } from '@/services/collection-point/AutoGroupingService';

interface Props {
  settings: AutoGroupingSettings | null;
  loading?: boolean;
  saving?: boolean;
  onEdit: () => void;
}

const AutoGroupingCard: React.FC<Props> = ({ settings, loading = false}) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>

      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm text-gray-800 table-fixed'>
          <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
            <tr>
              <th className='py-3 px-4 text-left w-72'>Tên cấu hình</th>
              <th className='py-3 px-4 text-center'>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx} className='border-b border-gray-100'>
                <td className='py-3 px-4'><div className='h-4 w-48 bg-gray-200 rounded animate-pulse' /></td>
                <td className='py-3 px-4 text-center'><div className='h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto' /></td>
              </tr>
            )) : (
              <>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 px-4 text-gray-700'>Kích hoạt</td>
                  <td className='py-3 px-4 text-center font-medium text-gray-900'>{settings?.isEnabled ? 'Bật' : 'Tắt'}</td>
                </tr>
                <tr className='border-b border-gray-100 bg-primary-50'>
                  <td className='py-3 px-4 text-gray-700'>Giờ chạy</td>
                  <td className='py-3 px-4 text-center font-medium text-gray-900'>{settings?.scheduleTime || '-'}</td>
                </tr>
                <tr>
                  <td className='py-3 px-4 text-gray-700'>Ngưỡng tải (%)</td>
                  <td className='py-3 px-4 text-center font-medium text-gray-900'>{settings?.loadThresholdPercent ?? '-'}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutoGroupingCard;
