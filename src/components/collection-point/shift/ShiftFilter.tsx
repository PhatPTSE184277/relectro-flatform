import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

export type ShiftStatus = 'active' | 'scheduled' | 'cancelled';

interface ShiftFilterProps {
    status: ShiftStatus;
    onFilterChange: (status: ShiftStatus) => void;
}

const ShiftFilter: React.FC<ShiftFilterProps> = ({ status, onFilterChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap min-h-9">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('active')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'active'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Có sẵn
                </button>
                <button
                    onClick={() => onFilterChange('scheduled')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'scheduled'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã lên lịch
                </button>
                <button
                    onClick={() => onFilterChange('cancelled')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'cancelled'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã hủy
                </button>
            </div>
        </div>
    );
};

export default ShiftFilter;
