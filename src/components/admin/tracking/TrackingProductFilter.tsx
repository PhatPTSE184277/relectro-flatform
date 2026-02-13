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
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap min-h-9">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange('Đang đóng gói')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Đang đóng gói'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đang đóng gói
                </button>
                <button
                    onClick={() => onFilterChange('Đã đóng thùng')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Đã đóng thùng'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã đóng thùng
                </button>
                <button
                    onClick={() => onFilterChange('Đang vận chuyển')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Đang vận chuyển'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đang vận chuyển
                </button>
                <button
                    onClick={() => onFilterChange('Tái chế')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === 'Tái chế'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Tái chế
                </button>
            </div>
        </div>
    );
};

export default TrackingProductFilter;
