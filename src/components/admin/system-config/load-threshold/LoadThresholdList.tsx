import React from 'react';
import { WarehouseLoadThresholdConfig } from '@/services/admin/SystemConfigService';
import LoadThresholdRow from './LoadThresholdRow';

interface LoadThresholdListProps {
  configs: WarehouseLoadThresholdConfig[];
  loading: boolean;
  onEdit: (config: WarehouseLoadThresholdConfig) => void;
}

const LoadThresholdList: React.FC<LoadThresholdListProps> = ({ configs, loading, onEdit }) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
      <div className='overflow-x-auto'>
        <div className='max-h-105 overflow-y-auto'>
          <table className='min-w-full text-sm text-gray-800 table-fixed'>
            <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
              <tr>
                <th className='py-3 px-4 text-center w-16'>STT</th>
                <th className='py-3 px-4 text-left w-64'>Công ty</th>
                <th className='py-3 px-4 text-left w-72'>Kho</th>
                <th className='py-3 px-4 text-center w-44'>Ngưỡng tải</th>
                <th className='py-3 px-4 text-center w-40'>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className='border-b border-gray-100'>
                    <td className='py-3 px-4 text-center'>
                      <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                    </td>
                    <td className='py-3 px-4'>
                      <div className='h-4 bg-gray-200 rounded w-44 animate-pulse' />
                    </td>
                    <td className='py-3 px-4'>
                      <div className='h-4 bg-gray-200 rounded w-56 animate-pulse' />
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <div className='inline-block h-6 bg-gray-200 rounded-full w-20 animate-pulse' />
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <div className='inline-block h-6 bg-gray-200 rounded-full w-24 animate-pulse' />
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <div className='inline-block h-8 bg-gray-200 rounded-lg w-24 animate-pulse' />
                    </td>
                  </tr>
                ))
              ) : configs.length > 0 ? (
                configs.map((config, idx) => (
                  <LoadThresholdRow
                    key={config.systemConfigId || `${config.companyName}-${config.scpName}-${idx}`}
                    config={config}
                    index={idx}
                    isLast={idx === configs.length - 1}
                    onEdit={onEdit}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='text-center py-8 text-gray-400'>
                    Không có dữ liệu ngưỡng tải kho.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoadThresholdList;
