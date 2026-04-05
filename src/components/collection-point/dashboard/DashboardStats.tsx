import React from 'react';
import { TrendingUp, Package, Box } from 'lucide-react';

interface StatDetail {
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
}

interface DashboardStatsProps {
  totalPackages: StatDetail;
  totalProducts: StatDetail;
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalPackages,
  totalProducts,
  loading
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 p-6 rounded-xl animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { title: 'Kiện hàng', detail: totalPackages, icon: Package },
    { title: 'Sản phẩm', detail: totalProducts, icon: Box },
    {
      title: 'Tổng quan',
      icon: TrendingUp,
      detail: {
        currentValue: totalPackages.currentValue + totalProducts.currentValue,
        previousValue: totalPackages.previousValue + totalProducts.previousValue,
        absoluteChange: totalPackages.absoluteChange + totalProducts.absoluteChange,
        percentChange:
          totalPackages.previousValue + totalProducts.previousValue === 0
            ? 100
            : Math.round(
                ((totalPackages.currentValue + totalProducts.currentValue - (totalPackages.previousValue + totalProducts.previousValue)) /
                  (totalPackages.previousValue + totalProducts.previousValue)) * 100
              ),
        trend:
          totalPackages.currentValue + totalProducts.currentValue > totalPackages.previousValue + totalProducts.previousValue
            ? 'Increase'
            : totalPackages.currentValue + totalProducts.currentValue < totalPackages.previousValue + totalProducts.previousValue
            ? 'Decrease'
            : 'NoChange',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => {
        const isPrimary = idx % 2 === 1;
        const Icon = stat.icon;
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
              <div className="flex items-center gap-2">
                <Icon size={18} className={isPrimary ? 'text-white opacity-80' : 'text-primary-400 opacity-80'} />
                <h3 className={isPrimary ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-primary-700'}>{stat.title}</h3>
              </div>
              <span className={isPrimary ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-primary-600'}>{safeCurrentValue}</span>
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
