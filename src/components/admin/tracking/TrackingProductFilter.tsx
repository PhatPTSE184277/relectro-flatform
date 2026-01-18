import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';

interface TrackingProductFilterProps {
    status: string;
    onFilterChange: (status: string) => void;
}

const TrackingProductFilter: React.FC<TrackingProductFilterProps> = ({
    status,
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2'>
            <div className='flex items-center gap-1 flex-wrap min-h-9'>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200 mr-1'>
                    <IoFilterOutline className='text-primary-600' size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('Chờ Duyệt')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[70px] ${
                        status === 'Chờ Duyệt'
                            ? 'bg-gray-200 text-gray-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ Duyệt
                </button>
                <button
                    onClick={() => onFilterChange('Chờ gom nhóm')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[70px] ${
                        status === 'Chờ gom nhóm'
                            ? 'bg-yellow-100 text-yellow-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ gom nhóm
                </button>
                <button
                    onClick={() => onFilterChange('Đã thu gom')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[70px] ${
                        status === 'Đã thu gom'
                            ? 'bg-green-100 text-green-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã thu gom
                </button>
                <button
                    onClick={() => onFilterChange('Đang vận chuyển')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[70px] ${
                        status === 'Đang vận chuyển'
                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang vận chuyển
                </button>
                <button
                    onClick={() => onFilterChange('Đã Từ Chối')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[70px] ${
                        status === 'Đã Từ Chối'
                            ? 'bg-red-100 text-red-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã Từ Chối
                </button>
                <button
                    onClick={() => onFilterChange('Tái chế')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[70px] ${
                        status === 'Tái chế'
                            ? 'bg-purple-100 text-purple-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Tái chế
                </button>
            </div>
        </div>
    );
};

export default TrackingProductFilter;
