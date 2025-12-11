import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

export type ShiftStatus = 'active' | 'inactive';

interface ShiftFilterProps {
    status: ShiftStatus;
    onFilterChange: (status: ShiftStatus) => void;
}

const ShiftFilter: React.FC<ShiftFilterProps> = ({ status, onFilterChange }) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc trạng thái ca làm</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'active' ? 'bg-green-100 text-green-700 shadow' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hoạt động
                </button>

                <button
                    onClick={() => onFilterChange('inactive')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'inactive' ? 'bg-red-100 text-red-700 shadow' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Không hoạt động
                </button>
            </div>
        </div>
    );
};

export default ShiftFilter;
