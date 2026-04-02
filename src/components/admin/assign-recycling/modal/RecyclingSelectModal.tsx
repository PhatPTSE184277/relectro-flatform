'use client';

import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
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
    const [tempSelectedCompanyId, setTempSelectedCompanyId] = useState<string>('');

    const effectiveSelectedCompanyId =
        tempSelectedCompanyId || (selectedCompanyId ? String(selectedCompanyId) : '');

    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            const companyName = company.name || company.companyName || '';
            return companyName.toLowerCase().includes(search.toLowerCase());
        });
    }, [companies, search]);

    const handleConfirm = () => {
        if (!effectiveSelectedCompanyId) {
            return;
        }
        onSelect(effectiveSelectedCompanyId);
        setTempSelectedCompanyId('');
        setSearch('');
        onClose();
    };

    const handleClose = () => {
        setTempSelectedCompanyId('');
        setSearch('');
        onClose();
    };

    if (!open) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
            onClick={(e) => e.stopPropagation()}
        >
            {/* Overlay */}
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            {/* Modal container */}
            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[80vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100 rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            Chọn công ty tái chế
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Search */}
                <div className='p-4 bg-gray-50'>
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
                        <div className='overflow-hidden rounded-xl border border-primary-100'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-14'></th>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left'>Công ty tái chế</th>
                                        <th className='py-3 px-4 text-left w-52'>Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {filteredCompanies.map((company, idx) => {
                                const companyId = String(company.companyId || company.id || '');
                                const isSelected = companyId === effectiveSelectedCompanyId;
                                const stt = idx + 1;

                                return (
                                    <tr
                                        key={companyId}
                                        onClick={() => setTempSelectedCompanyId(companyId)}
                                        className='cursor-pointer odd:bg-white even:bg-primary-50'
                                    >
                                        <td className='py-3 px-4 align-middle'>
                                            <input
                                                type='radio'
                                                name='recycling-company'
                                                checked={isSelected}
                                                onChange={() => setTempSelectedCompanyId(companyId)}
                                                className='accent-primary-600 w-4 h-4 rounded-full cursor-pointer'
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className='py-3 px-4 text-center'>
                                            <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                                {formatNumber(stt)}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <div className='flex items-center gap-3'>
                                                <span className='font-medium text-gray-900'>
                                                    {company.name || company.companyName || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='py-3 px-4 text-gray-600'>
                                            {company.phone || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white rounded-b-2xl'>
                    <button
                        onClick={handleConfirm}
                        disabled={!effectiveSelectedCompanyId}
                        className='px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecyclingSelectModal;
