import React from 'react';

interface DailyStat {
  date: string;
  count: number;
  absoluteChange: number | null;
  percentChange: number | null;
}

interface DailyPackageStatsProps {
  dailyStats: DailyStat[];
  loading: boolean;
}

const PackageList: React.FC<DailyPackageStatsProps> = ({ dailyStats, loading }) => {
  if (loading) {
    return (
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
        <div className='h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse' />
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className='h-6 bg-gray-200 rounded animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
      <div className='overflow-x-auto max-h-[40vh] overflow-y-auto'>
        <table className='w-full text-sm text-gray-800 table-fixed'>
          <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
            <tr>
              <th className='py-3 px-4 text-left w-16'>STT</th>
              <th className='py-3 px-4 text-left'>Ngày</th>
              <th className='py-3 px-4 text-right w-72'>Số lượng</th>
              <th className='py-3 px-4 text-right w-72'>Thay đổi</th>
              <th className='py-3 px-4 text-right w-72'>% Thay đổi</th>
            </tr>
          </thead>
          <tbody>
            {dailyStats && dailyStats.length > 0 ? (
              dailyStats.map((stat, idx) => {
                const isLast = idx === dailyStats.length - 1;
                const hasChange = stat.absoluteChange !== null;
                return (
                  <tr
                    key={idx}
                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors`}
                  >
                    <td className='py-3 px-4 font-medium w-16'>
                      <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                        {idx + 1}
                      </span>
                    </td>
                    <td className='py-3 px-4 font-medium text-gray-900'>
                      {new Date(stat.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                      {stat.count}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                      {hasChange ? (
                        <>
                          {stat.absoluteChange! > 0 ? '▲' : stat.absoluteChange! < 0 ? '▼' : ''}
                          {' '}
                          {stat.absoluteChange! > 0 ? '+' : ''}{stat.absoluteChange}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                      {hasChange && stat.percentChange !== null ? `${stat.percentChange}` : '-'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className='text-center py-8 text-gray-400'>
                  Không có dữ liệu thống kê theo ngày.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageList;
