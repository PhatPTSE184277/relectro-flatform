import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatDetail {
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange';
}

interface DashboardStatsProps {
  totalUsers: StatDetail;
  totalCompanies: StatDetail;
  totalProducts: StatDetail;
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalUsers,
  totalCompanies,
  totalProducts,
  loading
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 p-6 rounded-xl animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { title: 'Người dùng', detail: totalUsers },
    { title: 'Công ty', detail: totalCompanies },
    { title: 'Sản phẩm', detail: totalProducts },
    {
      title: 'Tổng quan',
      detail: {
        currentValue: totalUsers.currentValue + totalProducts.currentValue,
        previousValue: totalUsers.previousValue + totalProducts.previousValue,
        absoluteChange: totalUsers.absoluteChange + totalProducts.absoluteChange,
        percentChange:
          totalUsers.previousValue + totalProducts.previousValue === 0
            ? 100
            : Math.round(
                ((totalUsers.currentValue + totalProducts.currentValue - (totalUsers.previousValue + totalProducts.previousValue)) /
                  (totalUsers.previousValue + totalProducts.previousValue)) * 100
              ),
        trend:
          totalUsers.currentValue + totalProducts.currentValue > totalUsers.previousValue + totalProducts.previousValue
            ? 'Increase'
            : totalUsers.currentValue + totalProducts.currentValue < totalUsers.previousValue + totalProducts.previousValue
            ? 'Decrease'
            : 'NoChange',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const isPrimary = idx % 2 === 1;
        // Ensure all values are numbers and fallback to 0 if NaN or undefined
        const {
          currentValue,
          previousValue,
          absoluteChange,
          percentChange,
          trend
        } = stat.detail || {};
        const safeCurrentValue = isNaN(Number(currentValue)) ? 0 : Number(currentValue);
        const safePreviousValue = isNaN(Number(previousValue)) ? 0 : Number(previousValue);
        const safeAbsoluteChange = isNaN(Number(absoluteChange)) ? 0 : Number(absoluteChange);
        const safePercentChange = isNaN(Number(percentChange)) ? 0 : Number(percentChange);
        return (
          <div
            key={idx}
            className={
              isPrimary
                ? 'bg-primary-600 p-6 rounded-xl flex flex-col justify-center'
                : 'bg-white border border-primary-100 p-6 rounded-xl flex flex-col justify-center'
            }
          >
            <div className="flex items-center justify-between w-full">
              <h3 className={isPrimary ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-primary-700'}>{stat.title}</h3>
              <TrendingUp size={18} className={isPrimary ? 'text-white opacity-80' : 'text-primary-400 opacity-80'} />
              <span className={isPrimary ? 'text-3xl font-bold ml-4 text-white' : 'text-3xl font-bold ml-4 text-primary-600'}>{safeCurrentValue}</span>
            </div>
            <div className={isPrimary ? 'flex justify-between items-center mt-2 text-white text-xs' : 'flex justify-between items-center mt-2 text-primary-700 text-xs'}>
              <span>
                Trước: <b>{safePreviousValue}</b>
              </span>
              <span>
                {trend === 'Increase' ? '▲' : trend === 'Decrease' ? '▼' : ''} {safeAbsoluteChange > 0 ? '+' : ''}{safeAbsoluteChange} ({safePercentChange}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
