import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';

export type CollectionRouteStatus = 'Chưa bắt đầu' | 'Đang tiến hành' | 'Hoàn thành' | 'Hủy bỏ';

interface CollectionRouteFilterProps {
    status: CollectionRouteStatus;
    stats?: {
        total?: number;
        notStarted?: number;
        inProgress?: number;
        completed?: number;
        cancelled?: number;
    };
    onFilterChange: (status: CollectionRouteStatus) => void;
}

const CollectionRouteFilter: React.FC<CollectionRouteFilterProps> = ({
    status,
    stats = {},
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6'>
            <div className='flex items-center gap-1 flex-wrap min-h-9 mb-2'>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200 mr-1'>
                    <IoFilterOutline className='text-primary-600' size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('Chưa bắt đầu')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Chưa bắt đầu'
                            ? 'bg-yellow-100 text-yellow-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chưa bắt đầu ({stats.notStarted ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange('Đang tiến hành')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Đang tiến hành'
                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang tiến hành ({stats.inProgress ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange('Hoàn thành')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Hoàn thành'
                            ? 'bg-green-100 text-green-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hoàn thành ({stats.completed ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange('Hủy bỏ')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Hủy bỏ'
                            ? 'bg-red-100 text-red-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hủy bỏ ({stats.cancelled ?? 0})
                </button>
            </div>
        </div>
    );
};

export default CollectionRouteFilter;