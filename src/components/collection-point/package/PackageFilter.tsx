import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

interface PackageFilterProps {
    status: string;
    stats?: {
        packing?: number;
        closed?: number;
        shipping?: number;
        recycled?: number;
    };
    onFilterChange: (status: string) => void;
}

const STATUS_OPTIONS = [
    { value: 'Đang đóng gói', label: 'Đang đóng gói' },
    { value: 'Đã đóng thùng', label: 'Đã đóng thùng' },
    { value: 'Đã giao', label: 'Đã giao' }
];

const PackageFilter: React.FC<PackageFilterProps> = ({
    status,
    stats,
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2'>
                <div className='flex items-center gap-2 flex-wrap min-h-9'>
                    <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
                        <IoFilterOutline className='text-primary-600' size={16} />
                    </span>
                    {STATUS_OPTIONS.map((option) => {
                        const active = status === option.value;
                        let count = 0;
                        if (option.value === 'Đang đóng gói') count = stats?.packing ?? 0;
                        if (option.value === 'Đã đóng thùng') count = stats?.closed ?? 0;
                        if (option.value === 'Đã giao') count = (stats?.shipping ?? 0) + (stats?.recycled ?? 0);
                        return (
                            <button
                                key={option.value}
                                onClick={() => onFilterChange(option.value)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
                                    active
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {option.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PackageFilter;
