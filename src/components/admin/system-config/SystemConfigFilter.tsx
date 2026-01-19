import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

interface SystemConfigFilterProps {
  groupNames: { value: string; label: string }[];
  groupName: string;
  onFilterChange: (groupName: string) => void;
}

const SystemConfigFilter: React.FC<SystemConfigFilterProps> = ({ groupNames, groupName, onFilterChange }) => {
  return (
    <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6'>
      <div className='flex items-center gap-2 flex-wrap min-h-9'>
        <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
          <IoFilterOutline className='text-primary-600' size={16} />
        </span>
        {/* Bỏ nút Tất cả */}
        {groupNames.map((g) => (
          <button
            key={g.value}
            onClick={() => onFilterChange(g.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[90px] ${
              groupName === g.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SystemConfigFilter;
