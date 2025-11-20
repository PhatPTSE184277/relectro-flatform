import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';

interface GroupingFilterProps {
    status: string;
    onFilterChange: (status: string) => void;
}

const GroupingFilter: React.FC<GroupingFilterProps> = ({
    status,
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc nhóm thu gom</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'all'
                            ? 'bg-blue-100 text-blue-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Tất cả
                </button>

                <button
                    onClick={() => onFilterChange('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ thu gom
                </button>

                <button
                    onClick={() => onFilterChange('completed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'completed'
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã hoàn thành
                </button>
            </div>
        </div>
    );
};

export default GroupingFilter;
