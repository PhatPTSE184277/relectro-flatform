import React from 'react';
import { formatNumber } from '@/utils/formatNumber';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CompanySelectListProps {
    company: any;
    stt: number;
    isSelected: boolean;
    onToggleSelect: () => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    isLast?: boolean;
    disabled?: boolean;
}

const CompanySelectList: React.FC<CompanySelectListProps> = ({
    company,
    stt,
    isSelected,
    onToggleSelect,
    isExpanded,
    onToggleExpand,
    isLast = false,
    disabled = false
}) => {
    const formatM3 = (value: any) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return '0';
        return formatNumber(num, { locale: 'vi-VN', maximumFractionDigits: 0, minimumFractionDigits: 0 });
    };

    const warehouses = Array.isArray(company?.warehouses)
        ? company.warehouses
        : [];
    const activePoints = Array.isArray(company?.activePoints)
        ? company.activePoints
        : [];
    const activePointSet = new Set(
        activePoints.map((point: any) => String(point ?? '').trim().toLowerCase())
    );
    const visibleWarehouses = activePointSet.size
        ? warehouses.filter((warehouse: any) =>
              activePointSet.has(String(warehouse?.name ?? '').trim().toLowerCase())
          )
        : [];

    return (
        <>
            <tr
                className={`${!isLast && !isExpanded ? 'border-b border-primary-100' : ''} ${isSelected ? 'bg-primary-50' : ''} odd:bg-white even:bg-primary-50 ${
                    disabled ? 'cursor-not-allowed opacity-80' : ''
                }`}
            >
                <td className='py-3 px-4 text-center w-16'>
                    <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={disabled ? undefined : onToggleSelect}
                        onClick={(e) => e.stopPropagation()}
                        disabled={disabled}
                        className={`w-4 h-4 accent-primary-600 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                </td>
                <td className='py-3 px-4 text-center w-[5vw]'>
                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                        {stt}
                    </span>
                </td>
                <td className='py-3 px-4 w-[22vw]'>
                    <div className='flex items-start justify-between gap-2'>
                        <div>
                            <div className='text-gray-900 font-medium'>
                                {company.companyName || company.name || 'N/A'}
                            </div>
                        </div>
                        {visibleWarehouses.length > 0 ? (
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleExpand();
                                }}
                                className='mt-0.5 p-1 rounded-md hover:bg-primary-100 text-primary-600 cursor-pointer'
                                aria-label='Xem đơn vị thu gom chi tiết'
                            >
                                {isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                        ) : null}
                    </div>
                </td>
                <td className='py-3 px-4 w-[34vw]'>
                    <div className='text-sm text-gray-700'>
                        Còn trống:{' '}
                        <span className='font-semibold text-primary-700'>
                            {formatM3(company.companyAvailableCapacity)}
                        </span>{' '}
                        m3
                    </div>
                    <div className='text-sm text-gray-700 mt-0.5'>
                        Sức chứa tối đa:{' '}
                        <span className='font-semibold text-primary-700'>
                            {formatM3(company.companyMaxCapacity)}
                        </span>{' '}
                        m3
                    </div>
                </td>
            </tr>

            {isExpanded && (
                <tr
                    className={`${!isLast ? 'border-b border-primary-100' : ''} bg-white`}
                >
                    <td colSpan={4} className='px-6 py-4'>
                        <div className='rounded-xl border border-primary-100 overflow-hidden'>
                            <table className='w-full text-sm'>
                                <thead className='bg-primary-50 text-primary-700 text-xs uppercase'>
                                    <tr>
                                        <th className='py-2 px-3 text-left'>
                                            Kho / Điểm thu gom
                                        </th>
                                         <th className='py-2 px-3 text-right'>
                                            Còn trống (m3)
                                        </th>
                                        <th className='py-2 px-3 text-right'>
                                            Sức chứa tối đa (m3)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleWarehouses.length > 0 ? (
                                        visibleWarehouses.map((warehouse: any) => (
                                            <tr
                                                key={String(warehouse?.id)}
                                                className='border-t border-primary-50'
                                            >
                                                <td className='py-2 px-3 text-gray-800'>
                                                    {warehouse?.name || 'N/A'}
                                                </td>
                                                <td className='py-2 px-3 text-right text-gray-700'>
                                                    {formatM3(
                                                        warehouse?.availableCapacity
                                                    )}
                                                </td>
                                                <td className='py-2 px-3 text-right text-gray-700'>
                                                    {formatM3(
                                                        warehouse?.maxCapacity
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className='py-3 px-3 text-center text-gray-400'
                                            >
                                                Không có điểm thu gom hoạt động
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default CompanySelectList;
