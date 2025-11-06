import React from 'react';
import Skeleton from './Skereton';

const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-xl animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <Skeleton width={100} height={16} className="bg-gray-300 dark:bg-gray-600" />
        <Skeleton variant="circular" width={16} height={16} className="bg-gray-300 dark:bg-gray-600" />
      </div>
      
      <div className="flex items-end justify-between">
        <Skeleton width={80} height={36} className="bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-1">
          <Skeleton variant="circular" width={14} height={14} className="bg-gray-300 dark:bg-gray-600" />
          <Skeleton width={60} height={16} className="bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;