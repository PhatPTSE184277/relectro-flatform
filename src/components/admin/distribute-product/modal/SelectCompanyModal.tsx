import React from 'react';
import { X, Calendar, List } from 'lucide-react';
import CompanySelectList from './CompanySelectList';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatDate } from '@/utils/FormatDate';

interface SelectCompanyModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (selectedCompanyIds: string[]) => void;
    companies: any[];
    loading?: boolean;
    selectedCompanyIds: string[];
    onToggleSelect: (companyId: string) => void;
    onToggleSelectAll: () => void;
    workDate: string;
    productCount: number;
    distributing?: boolean;
}

const SelectCompanyModal: React.FC<SelectCompanyModalProps> = ({
    open,
    onClose,
    onConfirm,
    companies,
    loading = false,
    selectedCompanyIds,
    onToggleSelect,
    onToggleSelectAll,
    workDate,
    productCount,
    distributing = false
}) => {
    if (!open) return null;

    const allSelected = companies.length > 0 && companies.every(c => selectedCompanyIds.includes(c.id));
    const hasSelection = selectedCompanyIds.length > 0;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose}></div>

            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-xl font-bold text-gray-900'>
                            Chọn công ty thu gom
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Summary Card */}
                <div className='p-6 pb-4'>
                    <SummaryCard
                        items={[
                            {
                                label: 'Ngày chia',
                                value: formatDate(workDate),
                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Calendar className="w-4 h-4 text-primary-500" /></span>
                            },
                            {
                                label: 'Số lượng sản phẩm',
                                value: productCount,
                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><List className="w-4 h-4 text-primary-500" /></span>
                            }
                        ]}
                    />
                </div>

                {/* Content */}
                <div className='px-6 pb-6'>
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
                        <div className='overflow-x-auto'>
                            <div className='inline-block min-w-full align-middle'>
                                <div className='overflow-hidden'>
                                    <div className='max-h-[70vh] overflow-y-auto'>
                                        <table className='w-full text-sm text-gray-800 table-fixed'>
                                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                                <tr>
                                                    <th className='py-3 px-4 text-center w-16'>
                                                        <input
                                                            type='checkbox'
                                                            checked={allSelected}
                                                            onChange={onToggleSelectAll}
                                                            className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                                        />
                                                    </th>
                                                    <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                                    <th className='py-3 px-4 text-left w-[20vw]'>Công ty</th>
                                                    <th className='py-3 px-4 text-left w-[15vw]'>Số điện thoại</th>
                                                    <th className='py-3 px-4 text-left w-[20vw]'>Địa chỉ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    Array.from({ length: 5 }).map((_, idx) => (
                                                        <tr key={idx} className='border-b border-gray-100'>
                                                            <td className='py-3 px-4 text-center'>
                                                                <div className='h-4 w-4 bg-gray-200 rounded animate-pulse mx-auto' />
                                                            </td>
                                                            <td className='py-3 px-4 text-center'>
                                                                <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 bg-gray-200 rounded w-48 animate-pulse mb-2' />
                                                                <div className='h-3 bg-gray-200 rounded w-32 animate-pulse' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : companies.length > 0 ? (
                                                    companies.map((company, idx) => (
                                                        <CompanySelectList
                                                            key={company.id}
                                                            company={company}
                                                            stt={idx + 1}
                                                            isSelected={selectedCompanyIds.includes(company.id)}
                                                            onToggleSelect={() => onToggleSelect(company.id)}
                                                            isLast={idx === companies.length - 1}
                                                        />
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className='text-center py-8 text-gray-400'>
                                                            Không có công ty nào.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: show selected count on the left, confirm button on the right */}
                <div className='flex items-center justify-between gap-3 p-6 border-t bg-gray-50'>
                    <div>
                        {hasSelection ? (
                            <span className='text-sm font-medium text-primary-700'>
                                Đã chọn {selectedCompanyIds.length} công ty
                            </span>
                        ) : null}
                    </div>
                    <div>
                        <button
                            onClick={() => onConfirm(selectedCompanyIds)}
                            disabled={!hasSelection || distributing || productCount === 0}
                            className='px-6 py-2.5 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2 min-w-[140px] cursor-pointer'
                        >
                            {distributing ? (
                                <>
                                    <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                                    </svg>
                                    Đang phân phối...
                                </>
                            ) : (
                                'Xác nhận'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectCompanyModal;
