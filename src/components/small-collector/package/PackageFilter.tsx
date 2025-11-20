import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';

export type PackageStatus = 'Đang đóng gói' | 'Đang vận chuyển' | 'Đã đóng thùng';

interface PackageFilterProps {
    status: PackageStatus;
    stats?: {
        total?: number;
        packing?: number;
        shipping?: number;
        closed?: number;
    };
    onFilterChange: (status: PackageStatus) => void;
}

const PackageFilter: React.FC<PackageFilterProps> = ({
    status,
    stats = {},
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc Package</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange('Đang đóng gói')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đang đóng gói'
                            ? 'bg-yellow-100 text-yellow-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang đóng gói ({stats.packing ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange('Đã đóng thùng')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đã đóng thùng'
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã đóng thùng ({stats.closed ?? 0})
                </button>

                <button
                    onClick={() => onFilterChange('Đang vận chuyển')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'Đang vận chuyển'
                            ? 'bg-blue-100 text-blue-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đang vận chuyển ({stats.shipping ?? 0})
                </button>
            </div>
        </div>
    );
};

export default PackageFilter;
