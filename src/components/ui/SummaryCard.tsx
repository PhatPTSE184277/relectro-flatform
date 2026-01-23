import React from 'react';

export interface SummaryCardItem {
    icon?: React.ReactNode;
    label: React.ReactNode;
    value: React.ReactNode;
    colSpan?: number;
}

interface SummaryCardProps {
    items: SummaryCardItem[];
    singleRow?: boolean;
    label?: React.ReactNode;
}


// Utility to remove text in parentheses
const removeParentheses = (str: string) => str.replace(/\s*\([^)]*\)/g, '').trim();

const formatValue = (value: React.ReactNode, label?: React.ReactNode): React.ReactNode => {
    // Only remove parentheses for 'Phương tiện' label
    if (label === 'Phương tiện' && typeof value === 'string') {
        return removeParentheses(value);
    }
    return value;
};


const SummaryCard: React.FC<SummaryCardProps> = ({ items, singleRow = false, label }) => {
    const gridClass = singleRow
        ? 'flex overflow-x-auto gap-x-8 gap-y-4 whitespace-nowrap pb-1'
        : 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4';

    return (
        <div className={`relative bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 ${label ? 'mt-2' : ''}`}>
            {label && (
                <div
                    className="absolute -top-3 left-4 bg-white px-3 py-0.5 text-sm font-bold text-primary-700 border border-primary-300 rounded-full shadow-sm z-10 select-none"
                    style={{transform: 'translateY(-50%)', minHeight: 28, lineHeight: '20px'}}
                >
                    {label}
                </div>
            )}
            <div className={gridClass}>
                {items.map((item, idx) => (
                    <div
                        className={`flex items-center ${singleRow ? 'flex-1' : ''} min-w-[220px] ${item.colSpan === 2 ? 'col-span-2' : ''}`}
                        key={idx}
                    >
                        {item.icon && (
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200 mr-2">
                                {item.icon}
                            </span>
                        )}
                        <div style={{display: 'flex', alignItems: 'center', minWidth: 0, width: '100%'}}>
                            <span className='text-xs font-semibold uppercase text-gray-700 mr-2' style={{minWidth: 110, textAlign: 'left', whiteSpace: 'nowrap', flexShrink: 0}}>
                                {item.label}{singleRow ? ':' : ''}
                            </span>
                            <span
                                className='text-sm font-medium text-gray-900 wrap-break-word'
                                style={{
                                    minWidth: 0,
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal'
                                }}
                            >
                                {formatValue(item.value, item.label)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummaryCard;
