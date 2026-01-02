'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { SystemConfig } from '@/services/admin/SystemConfigService';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import SummaryCard from '@/components/ui/SummaryCard';

interface EditSystemConfigModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string, value?: string | null, file?: File | null) => void;
    config: SystemConfig | null;
}

const EditSystemConfigModal: React.FC<EditSystemConfigModalProps> = ({
    open,
    onClose,
    onConfirm,
    config
}) => {
    const [value, setValue] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [isUrl, setIsUrl] = useState(false);

    useEffect(() => {
        if (open && config) {
            const isUrlConfig = config.value?.startsWith('http://') || config.value?.startsWith('https://');
            setIsUrl(isUrlConfig);
            
            if (!isUrlConfig) {
                const num = Number(config.value);
                setValue(!isNaN(num) ? num : 0);
            }
            setFile(null);
        }
    }, [open, config]);

    const handleConfirm = () => {
        if (config) {
            if (isUrl && file) {
                onConfirm(config.systemConfigId, null, file);
            } else {
                onConfirm(config.systemConfigId, String(value), null);
            }
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
            ></div>

            {/* Modal container */}
            <div className='relative w-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn' style={{maxWidth: Math.max(600, Math.min(1100, (config?.displayName?.length || 0) * 16 + 600))}}>
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
                    <SummaryCard
                        label={
                            <span className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-primary-500" />
                                Thông tin cấu hình
                            </span>
                        }
                        singleRow={false}
                        items={[
                            {
                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Settings className="w-4 h-4 text-primary-500" /></span>,
                                label: 'Tên hiển thị',
                                value: config.displayName
                            },
                            isUrl
                                ? {
                                    icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Settings className="w-4 h-4 text-primary-500" /></span>,
                                    label: 'File Excel',
                                    value: (
                                        <div className="flex-1 relative">
                                            <input
                                                type="file"
                                                id="file-upload-input"
                                                accept=".xlsx,.xls"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                className='hidden'
                                            />
                                            <label
                                                htmlFor="file-upload-input"
                                                className='flex flex-col items-center justify-center w-full px-3 py-2 border border-primary-300 rounded-lg text-sm text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent cursor-pointer hover:bg-primary-50 transition'
                                            >
                                                <span className="font-medium text-primary-600">Chọn tệp</span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {file ? file.name : 'Không có tệp nào được chọn'}
                                                </span>
                                            </label>
                                        </div>
                                    )
                                }
                                : {
                                    icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Settings className="w-4 h-4 text-primary-500" /></span>,
                                    label: 'Giá trị',
                                    value: (
                                        <CustomNumberInput
                                            value={value}
                                            onChange={setValue}
                                            min={0}
                                            className='w-24 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                        />
                                    )
                                }
                        ]}
                    />
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={isUrl ? !file : (value === 0 || isNaN(value))}
                        className={`px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 ${
                            (isUrl ? file : (value !== 0 && !isNaN(value)))
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
