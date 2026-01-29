import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className='flex items-center gap-2 text-sm'>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <ChevronRight size={16} className='text-gray-400' />
                    )}
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className='text-primary-600 hover:text-primary-800 font-medium transition-colors'
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className='text-gray-500 font-medium'>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
