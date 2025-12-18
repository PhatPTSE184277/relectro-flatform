    import React from 'react';

export interface SummaryCardItem {
    icon?: React.ReactNode;
    label: React.ReactNode;
    value: React.ReactNode;
    colSpan?: number; // Optional: for items that should span multiple columns
}

interface SummaryCardProps {
    items: SummaryCardItem[];
    singleRow?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ items, singleRow = false }) => {
    const gridClass = singleRow
        ? 'flex overflow-x-auto gap-x-8 gap-y-4 whitespace-nowrap pb-1'
        : 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4';

    return (
        <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100'>
            <div className={gridClass}>
                {items.map((item, idx) => (
                    <div
                        className={`flex items-center gap-2 min-w-[220px] ${item.colSpan === 2 ? 'col-span-2' : ''}`}
                        key={idx}
                    >
                        {item.icon && (
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200 mr-2">
                                {item.icon}
                            </span>
                        )}
                        <span className='text-xs font-semibold uppercase text-gray-700 mr-2'>
                            {item.label}:
                        </span>
                        <span className='text-sm font-medium text-gray-900 break-all'>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummaryCard;
