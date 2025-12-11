import React from 'react';

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
    <div className='pt-4 border-t border-primary-100'>
        <div className='flex items-center gap-2 mb-2 text-gray-800 font-semibold'>
            {icon} <span>{title}</span>
        </div>
        <div className='p-4 bg-gray-50 rounded-lg border border-primary-100'>{children}</div>
    </div>
);

export default Section;
