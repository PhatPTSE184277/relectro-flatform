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
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap min-h-9">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange(ProductStatus.Pending)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === ProductStatus.Pending
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Chờ thu gom ({stats.pending ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange(ProductStatus.Collected)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === ProductStatus.Collected
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã thu gom ({stats.collected ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange(ProductStatus.Cancelled)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === ProductStatus.Cancelled
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Hủy bỏ ({stats.cancelled ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange(ProductStatus.Received)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === ProductStatus.Received
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Nhập kho ({stats.received ?? 0})
                </button>
            </div>
        </div>
    );
};

export default IWProductFilter;