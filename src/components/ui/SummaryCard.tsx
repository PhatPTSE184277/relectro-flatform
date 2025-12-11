import React from 'react';

interface SummaryCardItem {
    icon: React.ReactNode;
    label: React.ReactNode;
    value: React.ReactNode;
}

interface SummaryCardProps {
    items: SummaryCardItem[];
    columns?: 3 | 4;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ items, columns = 3 }) => {
    const gridClass = columns === 4 
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6'
        : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6';

    return (
        <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100'>
            <div className={gridClass}>
                {items.map((item, idx) => (
                    <div className='flex flex-col' key={idx}>
                        <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                {item.icon}
                            </span>
                            {item.label}
                        </div>
                        <div className='text-sm font-medium text-gray-900 break-all'>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummaryCard;
