import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';

interface DistributeProductFilterProps {
    activeFilter: 'undistributed' | 'distributed';
    onFilterChange: (filter: 'undistributed' | 'distributed') => void;
}

const DistributeProductFilter: React.FC<DistributeProductFilterProps> = ({
    activeFilter,
    onFilterChange
}) => {
    return (
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap min-h-9">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('undistributed')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        activeFilter === 'undistributed'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Chưa chia
                </button>
                <button
                    onClick={() => onFilterChange('distributed')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        activeFilter === 'distributed'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã chia
                </button>
            </div>
        </div>
    );
};

export default DistributeProductFilter;
