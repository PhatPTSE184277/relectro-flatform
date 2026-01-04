'use client';

import React, { useState } from 'react';
import { X, Factory, Phone } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';

interface RecyclingSelectModalProps {
    open: boolean;
    companies: any[];
    onClose: () => void;
    onSelect: (companyId: string) => void;
    selectedCompanyId?: string;
}

const RecyclingSelectModal: React.FC<RecyclingSelectModalProps> = ({
    open,
    companies,
    onClose,
    onSelect,
    selectedCompanyId
}) => {
    const [search, setSearch] = useState('');

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
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            {/* Modal container */}
            <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[80vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100 rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            Chọn công ty tái chế
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
                        placeholder='Tìm kiếm công ty tái chế...'
                    />
                </div>

                {/* Company List */}
                <div className='flex-1 overflow-y-auto p-4'>
                    {filteredCompanies.length === 0 ? (
                        <div className='text-center py-12 text-gray-400'>
                            Không tìm thấy công ty tái chế nào
                        </div>
                    ) : (
                        <div className='grid gap-3'>
                            {filteredCompanies.map((company) => {
                                const companyId = company.companyId || company.id;
                                const isSelected = companyId === selectedCompanyId;

                                return (
                                    <div
                                        key={companyId}
                                        onClick={() => handleSelect(companyId)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                            isSelected 
                                                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                                                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                                        }`}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center'>
                                                <Factory size={20} className='text-primary-600' />
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='font-semibold text-gray-900'>
                                                    {company.name || company.companyName || 'N/A'}
                                                </h3>
                                                {company.phone && (
                                                    <p className='text-sm text-gray-500 flex items-center gap-1 mt-1'>
                                                        <Phone size={14} />
                                                        {company.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecyclingSelectModal;
