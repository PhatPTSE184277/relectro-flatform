import React from 'react';

interface CompanyFilterProps {
    status: 'active' | 'inactive';
    onFilterChange: (status: 'active' | 'inactive') => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({ status, onFilterChange }) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <span className='text-gray-500'>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M9 18h6"/></svg>
                </span>
                <h3 className='text-gray-900 font-medium'>Lọc trạng thái công ty</h3>
            </div>
            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'active'
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Hoạt động
                </button>
                <button
                    onClick={() => onFilterChange('inactive')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === 'inactive'
                            ? 'bg-red-100 text-red-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Không hoạt động
                </button>
            </div>
        </div>
    );
};

export default CompanyFilter;
