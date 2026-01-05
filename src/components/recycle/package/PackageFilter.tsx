import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageFilterProps {
    status: PackageStatus;
    stats?: {
        closed?: number;
        shipping?: number;
        recycling?: number;
    };
    onFilterChange: (status: PackageStatus) => void;
}

const PackageFilter: React.FC<PackageFilterProps> = ({
    status,
    stats = {},
    onFilterChange
}) => {
    return (
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-1 flex-wrap min-h-9 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200 mr-1">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange(PackageStatus.Closed)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === PackageStatus.Closed
                            ? 'bg-green-100 text-green-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã đóng thùng ({stats.closed ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange(PackageStatus.Shipping)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === PackageStatus.Shipping
                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang vận chuyển ({stats.shipping ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange(PackageStatus.Recycling)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === PackageStatus.Recycling
                            ? 'bg-purple-100 text-purple-700 shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Tái chế ({stats.recycling ?? 0})
                </button>
            </div>
        </div>
    );
};

export default PackageFilter;
