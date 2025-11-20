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
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc tuyến thu gom</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange('Chưa bắt đầu')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Chưa bắt đầu'
                            ? 'bg-yellow-100 text-yellow-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chưa bắt đầu ({stats.notStarted ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange('Đang tiến hành')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đang tiến hành'
                            ? 'bg-blue-100 text-blue-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang tiến hành ({stats.inProgress ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange('Hoàn thành')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Hoàn thành'
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hoàn thành ({stats.completed ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange('Hủy bỏ')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Hủy bỏ'
                            ? 'bg-red-100 text-red-700 shadow'
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