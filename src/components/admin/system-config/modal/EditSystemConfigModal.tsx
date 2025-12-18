'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X, KeyRound, Tag, Layers } from 'lucide-react';
import { SystemConfig } from '@/services/admin/SystemConfigService';
import SummaryCard from '@/components/ui/SummaryCard';
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
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                                Chỉnh sửa cấu hình
                            </h2>
                            <p className='text-sm text-gray-600 mt-1'>
                                Thay đổi giá trị cấu hình hệ thống
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-white'>
                    <SummaryCard
                        items={[
                            {
                                icon: <KeyRound size={14} className='text-primary-400' />,
                                label: 'Key',
                                value: config.key,
                            },
                            {
                                icon: <Tag size={14} className='text-primary-400' />,
                                label: 'Tên hiển thị',
                                value: config.displayName,
                            },
                            {
                                icon: <Layers size={14} className='text-primary-400' />,
                                label: 'Nhóm',
                                value: config.groupName,
                            },
                            {
                                icon: <Settings size={14} className='text-primary-400' />,
                                label: (
                                    <span>
                                        Giá trị <span className='text-red-500'>*</span>
                                    </span>
                                ),
                                value: (
                                    <CustomNumberInput
                                        value={value}
                                        onChange={setValue}
                                        placeholder='Nhập giá trị mới'
                                        min={0}
                                        className='w-full px-2 py-1 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 text-sm'
                                    />
                                ),
                            },
                        ]}
                    />
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
