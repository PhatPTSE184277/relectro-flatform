import React from 'react';
import { TrendingUp, Eye } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';

interface CompanyShowProps {
    company: any;
    onSelect: () => void;
    isLast?: boolean;
    index: number;
    isIncreased?: boolean;
}

const CompanyShow: React.FC<CompanyShowProps> = ({
    company,
    onSelect,
    isLast,
    index,
    isIncreased = false
}) => {
    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    const total = company.totalProducts ?? company.totalOrders ?? 0;
    const isCustomer = !!company.isCustomer || /ute/i.test(company.companyName ?? '');
    const warehouses = Array.isArray(company?.warehouses) ? company.warehouses : [];
    const plannedRaw = Number(
        company?.companyTotalAddedToday ??
            company?.plannedCapacity ??
            warehouses.reduce(
                (sum: number, w: any) =>
                    sum + Number(w?.addedVolumeThisDate ?? w?.plannedCapacity ?? 0),
                0
            )
    );
    const plannedValue = Number.isFinite(plannedRaw) ? plannedRaw : 0;
    const plannedLabel = Number.isInteger(plannedValue)
        ? plannedValue.toString()
        : plannedValue.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-[6vw]'>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {formatNumber(index + 1)}
                </span>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div className='flex items-center gap-2'>
                    <div className='text-gray-900 font-medium'>{company.companyName || 'N/A'}</div>
                    {isCustomer ? (
                        <span className='text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full'>
                            Công ty khách
                        </span>
                    ) : null}
                </div>
            </td>
            <td className='py-3 pr-4 text-right w-auto'>
                <div className='flex items-center justify-end gap-2'>
                    {isIncreased && (
                        <span title='Số lượng đã tăng'>
                            <TrendingUp 
                                size={18} 
                                className='text-green-600 animate-pulse' 
                            />
                        </span>
                    )}
                    <span className='text-gray-900 font-medium'>
                        {total}
                    </span>
                </div>
            </td>
            <td className='py-3 px-4 text-right w-[12vw]'>
                <span className='text-gray-900 font-medium'>{plannedLabel}</span>
            </td>
            <td className='py-3 px-4 w-[10vw]'>
                <div className='flex items-center justify-center'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem kho và sản phẩm'
                        aria-label='Xem kho và sản phẩm'
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CompanyShow;
