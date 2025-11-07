import React from 'react';

const CollectionRouteListSkeleton: React.FC = () => (
    <div className='space-y-3'>
        {[...Array(5)].map((_, idx) => (
            <div
                key={idx}
                className='p-4 border-2 rounded-xl flex gap-3 items-center bg-gray-50 animate-pulse'
            >
                <div className='w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0' />
                <div className='flex-1 min-w-0'>
                    <div className='h-4 bg-gray-200 rounded w-32 mb-2' />
                    <div className='h-3 bg-gray-100 rounded w-24 mb-2' />
                    <div className='h-3 bg-gray-100 rounded w-16' />
                </div>
                <div className='w-8 h-8 bg-gray-200 rounded flex-shrink-0' />
            </div>
        ))}
    </div>
);

export default CollectionRouteListSkeleton;