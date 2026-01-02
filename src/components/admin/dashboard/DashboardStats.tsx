import React from 'react';
import { TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  totalUsers: number;
  totalCompanies: number;
  totalProducts: number;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
    { title: 'Người dùng', value: totalUsers, variant: 'blue' },
    { title: 'Công ty', value: totalCompanies, variant: 'dark' },
    { title: 'Sản phẩm', value: totalProducts, variant: 'blue' },
    { title: 'Tổng quan', value: totalUsers + totalProducts, variant: 'dark' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const bgColor = stat.variant === 'blue' ? 'bg-blue-500' : 'bg-gray-800';
        return (
          <div key={idx} className={`${bgColor} text-white p-6 rounded-xl`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">{stat.title}</h3>
              <TrendingUp size={16} className="opacity-70" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
