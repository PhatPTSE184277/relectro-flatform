import React from 'react';
import type { OverdueSummaryItem } from '@/services/admin/DashboardService';
import OverdueCollectionUnitShow from './OverdueCollectionUnitShow';

interface OverdueCollectionUnitListProps {
  data: OverdueSummaryItem[];
  loading: boolean;
  onViewDetail: (item: OverdueSummaryItem) => void;
}

const OverdueCollectionUnitList: React.FC<OverdueCollectionUnitListProps> = ({
  data,
  loading,
  onViewDetail,
}) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
      <div className='overflow-x-auto w-full'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <div className='max-h-[56vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[48vh] xl:max-h-[56vh] overflow-y-auto w-full'>
              <table className='w-full text-sm text-gray-800 table-fixed'>
                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                  <tr>
                    <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                    <th className='py-3 px-4 text-left w-[20vw]'>Đơn vị thu gom</th>
                    <th className='py-3 pr-4 text-right w-auto'>Số đơn quá hạn</th>
                    <th className='py-3 px-4 text-center w-[10vw]'>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className='border-b border-primary-100'>
                        <td className='py-3 px-4 text-center'><div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' /></td>
                        <td className='py-3 px-4'><div className='h-4 bg-gray-200 rounded w-48 animate-pulse' /></td>
                        <td className='py-3 pr-4 text-right'><div className='h-6 bg-gray-200 rounded w-10 animate-pulse ml-auto' /></td>
                        <td className='py-3 px-4 text-center'><div className='h-8 w-8 bg-gray-200 rounded-full animate-pulse mx-auto' /></td>
                      </tr>
                    ))
                  ) : data.length > 0 ? (
                    data.map((item, idx) => (
                      <OverdueCollectionUnitShow
                        key={item.scpId}
                        item={item}
                        index={idx}
                        isLast={idx === data.length - 1}
                        onSelect={() => onViewDetail(item)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className='text-center py-8 text-gray-400'>
                        Không có dữ liệu đơn vị thu gom quá hạn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverdueCollectionUnitList;
