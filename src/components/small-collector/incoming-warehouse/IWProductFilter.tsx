import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';
import { ProductStatus } from '@/enums/ProductStatus';

interface IWProductFilterProps {
    status: string;
    stats?: {
        total?: number;
        pending?: number;
        collected?: number;
        cancelled?: number;
        received?: number;
    };
    onFilterChange: (status: string) => void;
}

const IWProductFilter: React.FC<IWProductFilterProps> = ({
    status,
    stats = {},
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc sản phẩm</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange(ProductStatus.Pending)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === ProductStatus.Pending
                            ? 'bg-yellow-100 text-yellow-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ thu gom ({stats.pending ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange(ProductStatus.Collected)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === ProductStatus.Collected
                            ? 'bg-blue-100 text-blue-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã thu gom ({stats.collected ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange(ProductStatus.Cancelled)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === ProductStatus.Cancelled
                            ? 'bg-red-100 text-red-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hủy bỏ ({stats.cancelled ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange(ProductStatus.Received)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === ProductStatus.Received
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Nhập kho ({stats.received ?? 0})
                </button>
            </div>
        </div>
    );
};

export default IWProductFilter;