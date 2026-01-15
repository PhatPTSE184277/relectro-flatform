import React from 'react';

const ProcessingModal: React.FC = () => (
    <div className='fixed top-16 left-64 right-0 bottom-0 bg-white z-40 flex items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-md border border-primary-200'>
            <div className='w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
            <div className='text-center'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Đang xử lý phân công...</h3>
                <p className='text-gray-600'>Hệ thống đang phân công sản phẩm</p>
            </div>
        </div>
    </div>
);

export default ProcessingModal;
