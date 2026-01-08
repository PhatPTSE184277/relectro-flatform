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

const DailyPackageStats: React.FC<DailyPackageStatsProps> = ({ dailyStats, loading }) => {
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
      <div className='overflow-x-auto'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
              <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                <tr>
                  <th className='py-3 px-4 text-center' style={{ width: '80px' }}>STT</th>
                  <th className='py-3 px-4 text-left' style={{ width: 'auto' }}>Ngày</th>
                  <th className='py-3 px-4 text-center' style={{ width: '220px' }}>Số lượng</th>
                  <th className='py-3 px-4 text-center' style={{ width: '220px' }}>Thay đổi</th>
                  <th className='py-3 px-4 text-center' style={{ width: '220px' }}>% Thay đổi</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className='max-h-85 overflow-y-auto'>
            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
              <tbody>
                {dailyStats && dailyStats.length > 0 ? (
                  dailyStats.map((stat, idx) => {
                    const isLast = idx === dailyStats.length - 1;
                    const hasChange = stat.absoluteChange !== null;
                    return (
                      <tr
                        key={idx}
                        className={`${!isLast ? 'border-b border-primary-100' : ''} bg-primary-50/30 hover:bg-primary-100/40 transition-colors`}
                      >
                        <td className="py-3 px-4 text-center" style={{ width: '80px' }}>
                          <span className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900" style={{ width: 'auto' }}>
                          {new Date(stat.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 font-semibold" style={{ width: '220px' }}>
                          {stat.count}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 font-semibold" style={{ width: '220px' }}>
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
                        <td className="py-3 px-4 text-center text-gray-700 font-semibold" style={{ width: '220px' }}>
                          {hasChange && stat.percentChange !== null ? `${stat.percentChange}%` : '-'}
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
      </div>
    </div>
  );
};

export default DailyPackageStats;
