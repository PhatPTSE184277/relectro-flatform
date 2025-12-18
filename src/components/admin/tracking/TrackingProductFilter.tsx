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
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc sản phẩm</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'all'
                            ? 'bg-primary-100 text-primary-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Tất cả
                </button>

                <button
                    onClick={() => onFilterChange('Chờ Duyệt')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Chờ Duyệt'
                            ? 'bg-gray-100 text-gray-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ Duyệt
                </button>

                <button
                    onClick={() => onFilterChange('Chờ gom nhóm')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Chờ gom nhóm'
                            ? 'bg-yellow-100 text-yellow-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ gom nhóm
                </button>

                <button
                    onClick={() => onFilterChange('Đã thu gom')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đã thu gom'
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã thu gom
                </button>

                <button
                    onClick={() => onFilterChange('Đang vận chuyển')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đang vận chuyển'
                            ? 'bg-blue-100 text-blue-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang vận chuyển
                </button>

                <button
                    onClick={() => onFilterChange('Đã Từ Chối')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đã Từ Chối'
                            ? 'bg-red-100 text-red-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã Từ Chối
                </button>

                <button
                    onClick={() => onFilterChange('Tái chế')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Tái chế'
                            ? 'bg-purple-100 text-purple-700 shadow'
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
