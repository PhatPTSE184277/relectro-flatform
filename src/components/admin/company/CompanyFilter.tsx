import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

interface CompanyFilterProps {
    status: string;
    onStatusChange: (status: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({ status, onStatusChange }) => {
    return (
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-start gap-1 mb-4'>
            <div className='bg-white rounded-2xl shadow border border-gray-100 px-2 py-2'>
                <div className='flex items-center gap-1 flex-wrap'>
                    <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
                        <IoFilterOutline className='text-primary-600' size={16} />
                    </span>
                    <button
                        onClick={() => onStatusChange('Đang hoạt động')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[90px] ${
                            status === 'Đang hoạt động'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Đang hoạt động
                    </button>
                    <button
                        onClick={() => onStatusChange('Không hoạt động')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[90px] ${
                            status === 'Không hoạt động'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Không hoạt động
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyFilter;
