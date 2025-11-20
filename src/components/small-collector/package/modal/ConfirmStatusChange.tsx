'use client';
import React from 'react';
import { AlertTriangle, Truck, X } from 'lucide-react';

interface ConfirmStatusChangeProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    packageName: string;
}

const ConfirmStatusChange: React.FC<ConfirmStatusChangeProps> = ({
    open,
    onClose,
    onConfirm,
    packageName
}) => {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-orange-50 to-red-50'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center'>
                            <AlertTriangle className='text-orange-600' size={24} />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-gray-900'>
                                Xác nhận đóng trạng thái
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-2xl font-light cursor-pointer'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className='p-6 space-y-4'>
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                        <p className='text-sm text-orange-800 font-medium mb-2'>
                            Cảnh báo quan trọng
                        </p>
                        <p className='text-sm text-orange-700'>
                            Sau khi đóng trạng thái package sẽ{' '}
                            <strong>KHÔNG THỂ</strong> chỉnh sửa.
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <p className='text-sm text-gray-600'>
                            <span className='font-medium text-gray-700'>
                                Package:
                            </span>{' '}
                            {packageName}
                        </p>
                        <p className='text-sm text-gray-600'>
                            Bạn có chắc chắn muốn tiếp tục?
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50'>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium cursor-pointer'
                    >
                        <Truck size={18} />
                        Xác nhận đóng
                    </button>
                </div>
            </div>

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ConfirmStatusChange;
