import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  variant: 'blue' | 'dark';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, variant }) => {
  const bgColor = variant === 'blue' ? 'bg-blue-500' : 'bg-gray-800';
  const textColor = 'text-white';
  
  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-xl`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-90">{(title)}</h3>
        <TrendingUp size={16} className="opacity-70" />
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-sm">
          {isPositive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span className="font-medium">{change}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;