'use client';

import React, { useState } from 'react';
import { X, Factory, MapPin, Phone } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';

interface CompanySelectModalProps {
    open: boolean;
    companies: any[];
    selectedCompanyId: string | null;
    onClose: () => void;
    onSelect: (companyId: string) => void;
}

const CompanySelectModal: React.FC<CompanySelectModalProps> = ({
    open,
    companies,
    selectedCompanyId,
    onClose,
    onSelect
}) => {
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState(getFirstDayOfMonthString);
    const [toDate, setToDate] = useState(getTodayString);

    const filteredCompanies = companies.filter((company) => {
        const companyName = company.name || company.companyName || '';
        return companyName.toLowerCase().includes(search.toLowerCase());
    });

    const handleSelect = (companyId: string) => {
        onSelect(companyId);
        onClose();
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-visible z-10 min-h-[600px]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100 rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            Chọn công ty
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Search */}
                <div className='p-4 border-b bg-gray-50'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm công ty...'
                    />
                </div>

                {/* Date Range Picker */}
                <div className='p-4 border-b bg-gray-50'>
                    <div className='max-w-lg w-full mx-auto'>
                        <CustomDateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                        />
                    </div>
                </div>

                {/* Company List */}
                <div className='flex-1 overflow-y-auto p-4 pb-8'>
                    {filteredCompanies.length === 0 ? (
                        <div className='text-center py-12 text-gray-400'>
                            Không tìm thấy công ty nào
                        </div>
                    ) : (
                        <div className='grid gap-3'>
                            {filteredCompanies.map((company) => {
                                const companyId = company.id || company.companyId || String(company.collectionCompanyId);
                                const isSelected = selectedCompanyId === companyId;

                                return (
                                    <div
                                        key={companyId}
                                        onClick={() => handleSelect(companyId)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                            isSelected
                                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                                        }`}
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                isSelected ? 'bg-primary-500' : 'bg-primary-100'
                                            }`}>
                                                <Factory size={20} className={isSelected ? 'text-white' : 'text-primary-600'} />
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='font-semibold text-gray-900 text-sm'>
                                                    {company.name || company.companyName || 'N/A'}
                                                </h3>
                                                <div className='flex items-center gap-2 mt-1'>
                                                    {company.city && (
                                                        <p className='text-xs text-gray-500 flex items-center gap-1'>
                                                            <MapPin size={12} />
                                                            {company.city}
                                                        </p>
                                                    )}
                                                    {company.phone && (
                                                        <p className='text-xs text-gray-500 flex items-center gap-1'>
                                                            <Phone size={12} />
                                                            {company.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className='w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center'>
                                                    <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanySelectModal;
