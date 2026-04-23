'use client';

import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';
import type { CollectorStatusFilter } from '@/contexts/collection-point/CollectorContext';

interface CollectorFilterProps {
    status: CollectorStatusFilter;
    stats?: {
        active?: number;
        inactive?: number;
    };
    onFilterChange: (status: CollectorStatusFilter) => void;
}

const CollectorFilter: React.FC<CollectorFilterProps> = ({ status, stats, onFilterChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap min-h-9">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('Đang hoạt động')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[130px] ${
                        status === 'Đang hoạt động'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đang hoạt động ({stats?.active ?? 0})
                </button>
                <button
                    onClick={() => onFilterChange('Không hoạt động')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[130px] ${
                        status === 'Không hoạt động'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Không hoạt động ({stats?.inactive ?? 0})
                </button>
            </div>
        </div>
    );
};

export default CollectorFilter;
