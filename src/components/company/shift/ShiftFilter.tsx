import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

export type ShiftStatus = 'active' | 'inactive';

interface ShiftFilterProps {
    status: ShiftStatus;
    onFilterChange: (status: ShiftStatus) => void;
}

const ShiftFilter: React.FC<ShiftFilterProps> = ({ status, onFilterChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-1 flex-wrap min-h-9 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200 mr-1">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('active')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'active' ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hoạt động
                </button>
                <button
                    onClick={() => onFilterChange('inactive')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'inactive' ? 'bg-red-100 text-red-700 shadow-sm' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Không hoạt động
                </button>
            </div>
        </div>
    );
};

export default ShiftFilter;
