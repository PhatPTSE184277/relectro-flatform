'use client';
import React from 'react';
import { X, Tag, Boxes } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';

interface ConfirmStatusChangeProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    packageId?: string;
    productCount?: number;
    status?: string;
}

const ConfirmStatusChange: React.FC<ConfirmStatusChangeProps> = ({
    open,
    onClose,
    onConfirm,
    packageId,
    productCount,
}) => {
    if (!open) return null;

    const summaryItems = [
        {
            icon: <Tag size={14} className='text-primary-400' />,
            label: 'Mã kiện hàng',
            value: packageId || '-',
        },
        {
            icon: <Boxes size={14} className='text-primary-400' />,
            label: 'Số sản phẩm',
            value: productCount ?? 0,
        }
    ];

    return (
        <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay (click disabled - modal only closes with X or explicit confirm) */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[96vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900'>
                            Xác nhận đóng trạng thái
                        </h2>
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
                    <SummaryCard items={summaryItems} singleRow={true} />

                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <p className='text-sm text-yellow-800 font-medium mb-2'>
                            Cảnh báo quan trọng
                        </p>
                        <p className='text-sm text-yellow-700'>
                            Sau khi đóng trạng thái package sẽ{' '}
                            <strong>KHÔNG THỂ</strong> chỉnh sửa.
                        </p>
                    </div>

                    <div className='space-y-2'>
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
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer shadow-md border border-primary-200'
                    >
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
