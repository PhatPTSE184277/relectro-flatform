'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { SystemConfig } from '@/services/admin/SystemConfigService';
import CustomNumberInput from '@/components/ui/CustomNumberInput';

interface EditSystemConfigModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string, value: string) => void;
    config: SystemConfig | null;
}

const EditSystemConfigModal: React.FC<EditSystemConfigModalProps> = ({
    open,
    onClose,
    onConfirm,
    config
}) => {
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        if (open && config) {
            const num = Number(config.value);
            setValue(!isNaN(num) ? num : 0);
        }
    }, [open, config]);

    const handleConfirm = () => {
        if (config) {
            onConfirm(config.systemConfigId, String(value));
        }
        onClose();
    };

    const handleClose = () => {
        onClose();
    };


    if (!open || !config) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn' style={{maxWidth: Math.max(400, Math.min(900, (config?.displayName?.length || 0) * 14 + 400))}}>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <h2 className='text-2xl font-bold text-gray-800'>Chỉnh sửa cấu hình</h2>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                        <div className='flex items-center gap-2 mb-3'>
                            <Settings className='text-primary-600' size={20} />
                            <h3 className='text-lg font-semibold text-gray-900'>Thông tin cấu hình</h3>
                        </div>
                        <div className='flex gap-4 items-start'>
                            <div className='flex-1 space-y-2'>
                                <div className='flex items-center gap-8'>
                                    <div className='flex items-center w-1/2'>
                                        <span className='text-sm text-gray-500 w-28 block'>Tên hiển thị:</span>
                                        <span className='text-base font-semibold text-gray-900 flex-1 wrap-break-word' style={{wordBreak: 'keep-all', minWidth: 200, maxWidth: 600}}>{config.displayName}</span>
                                    </div>
                                    <div className='flex items-center w-1/2'>
                                        <span className='text-sm text-gray-500 w-24 block'>Giá trị:</span>
                                        <CustomNumberInput
                                            value={value}
                                            onChange={setValue}
                                            min={0}
                                            className='w-24 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={value === 0 || isNaN(value)}
                        className={`px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 ${
                            value !== 0 && !isNaN(value)
                                ? 'bg-primary-600 hover:bg-primary-700'
                                : 'bg-gray-300 cursor-not-allowed'
                        } flex items-center gap-2`}
                    >
                        Cập nhật
                    </button>
                </div>
            </div>

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default EditSystemConfigModal;
