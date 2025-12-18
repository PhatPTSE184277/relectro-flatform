import React from 'react';

export const RenderTimeCell = (datetime?: string) => {
    if (!datetime) return <span className='text-gray-400'>Chưa có</span>;
    const dateObj = new Date(datetime);
    const time = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const date = dateObj.toLocaleDateString('vi-VN');
    return (
        <div className='flex flex-col items-center'>
            <span className='font-semibold text-gray-900'>{time}</span>
            <span className='text-xs text-gray-500'>{date}</span>
        </div>
    );
};

export default RenderTimeCell;
