import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';
import { formatNumber } from '@/utils/formatNumber';

export interface UnassignedProductsReasonOption {
    id: string;
    label: string;
    reason: string;
    count?: number;
}

export const UNASSIGNED_PRODUCTS_REASON_OPTIONS: UnassignedProductsReasonOption[] = [
    {
        id: 'deadline-no-vehicle',
        label: 'Hạn chót, chưa có xe phù hợp',
        reason: 'HẠN CHÓT - Cần thu gom gấp nhưng chưa có xe phù hợp.'
    },
    {
        id: 'vehicle-full',
        label: 'Xe đầy, thu gom ngày sau',
        reason: 'Xe đã đầy, sẽ thu gom vào ngày sau.'
    }
];

export const UNASSIGNED_PRODUCTS_DEFAULT_REASON =
    UNASSIGNED_PRODUCTS_REASON_OPTIONS[0].reason;

interface UnassignedProductsFilterProps {
    options: UnassignedProductsReasonOption[];
    selectedReason: string;
    onChangeReason: (reason: string) => void;
}

const UnassignedProductsFilter: React.FC<UnassignedProductsFilterProps> = ({
    options,
    selectedReason,
    onChangeReason
}) => {
    return (
        <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2'>
            <div className='flex items-center gap-2 flex-wrap min-h-9'>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
                    <IoFilterOutline className='text-primary-600' size={16} />
                </span>
                {options.map((option) => {
                    const isActive = selectedReason === option.reason;

                    return (
                        <button
                            key={option.id}
                            onClick={() => onChangeReason(option.reason)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                                isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {option.label}{' '}
                            ({formatNumber(Number(option.count ?? 0))})
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default UnassignedProductsFilter;
