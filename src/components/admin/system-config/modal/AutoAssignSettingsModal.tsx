'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import CustomTimePicker from '@/components/ui/CustomTimePicker';
import { AutoAssignSettings } from '@/services/admin/SystemConfigService';

interface AutoAssignSettingsModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (payload: AutoAssignSettings) => Promise<void> | void;
    value: AutoAssignSettings;
    onChange: (next: AutoAssignSettings) => void;
    loading?: boolean;
}

const AutoAssignSettingsModal: React.FC<AutoAssignSettingsModalProps> = ({
    open,
    onClose,
    onConfirm,
    value,
    onChange,
    loading = false
}) => {
    if (!open) return null;

    const handleConfirm = async () => {
        await onConfirm({
            isEnabled: Boolean(value.isEnabled),
            immediateThreshold: Number(value.immediateThreshold || 0),
            scheduleTime: String(value.scheduleTime || '00:00'),
            scheduleMinQty: Number(value.scheduleMinQty || 0)
        });
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <h2 className='text-2xl font-bold text-gray-800'>Chỉnh sửa: Tự động phân phối sản phẩm</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center justify-between gap-3 bg-gray-50 rounded-xl border border-gray-100 p-4'>
                            <div>
                                <div className='text-sm font-semibold text-gray-700'>Kích hoạt</div>
                                <div className='text-xs text-gray-500'>Bật/tắt auto-assign</div>
                            </div>
                            <input
                                type='checkbox'
                                checked={value.isEnabled}
                                onChange={(e) => onChange({ ...value, isEnabled: e.target.checked })}
                                className='w-5 h-5 accent-primary-600 cursor-pointer'
                            />
                        </div>

                        <div className='bg-gray-50 rounded-xl border border-gray-100 p-4'>
                            <div className='text-sm font-semibold text-gray-700'>Immediate Threshold</div>
                            <div className='text-xs text-gray-500 mb-2'>Ngưỡng xử lý ngay</div>
                            <CustomNumberInput
                                value={value.immediateThreshold}
                                onChange={(v) => onChange({ ...value, immediateThreshold: v })}
                                min={0}
                                className='w-full px-3 py-2 border border-primary-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                            />
                        </div>

                        <div className='bg-gray-50 rounded-xl border border-gray-100 p-4'>
                            <div className='text-sm font-semibold text-gray-700'>Schedule Time</div>
                            <div className='text-xs text-gray-500 mb-2'>Giờ chạy (HH:mm)</div>
                            <CustomTimePicker
                                value={value.scheduleTime}
                                onChange={(t) => onChange({ ...value, scheduleTime: t })}
                                dropdownAlign='right'
                            />
                        </div>

                        <div className='bg-gray-50 rounded-xl border border-gray-100 p-4'>
                            <div className='text-sm font-semibold text-gray-700'>Schedule Min Qty</div>
                            <div className='text-xs text-gray-500 mb-2'>Số lượng tối thiểu để chạy lịch</div>
                            <CustomNumberInput
                                value={value.scheduleMinQty}
                                onChange={(v) => onChange({ ...value, scheduleMinQty: v })}
                                min={0}
                                className='w-full px-3 py-2 border border-primary-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                            />
                        </div>
                    </div>
                </div>

                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            !loading
                                ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {loading ? <Loader2 className='animate-spin' size={18} /> : 'Xác nhận'}
                    </button>
                </div>

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
        </div>
    );
};

export default AutoAssignSettingsModal;
