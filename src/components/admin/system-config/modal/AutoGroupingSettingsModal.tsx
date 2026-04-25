'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import CustomTimePicker from '@/components/ui/CustomTimePicker';
import { AutoGroupingSettings } from '@/services/admin/SystemConfigService';

interface AutoGroupingSettingsModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (payload: AutoGroupingSettings) => Promise<void> | void;
    value: AutoGroupingSettings;
    onChange: (next: AutoGroupingSettings) => void;
    loading?: boolean;
}

const AutoGroupingSettingsModal: React.FC<AutoGroupingSettingsModalProps> = ({
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
            collectionUnitId: String(value.collectionUnitId || ''),
            isEnabled: Boolean(value.isEnabled),
            scheduleTime: String(value.scheduleTime || '00:00'),
            loadThresholdPercent: Number(value.loadThresholdPercent || 0)
        });
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />
            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <h2 className='text-2xl font-bold text-gray-800'>Tự động phân xe</h2>
                    <button onClick={onClose} className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer' aria-label='Đóng'>
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center justify-between gap-3 bg-gray-50 rounded-xl border border-gray-100 p-4'>
                            <div>
                                <div className='text-sm font-semibold text-gray-700'>Kích hoạt</div>
                                <div className='text-xs text-gray-500'>Bật/tắt tự động phân xe</div>
                            </div>
                            <input type='checkbox' checked={value.isEnabled} onChange={(e) => onChange({ ...value, isEnabled: e.target.checked })} className='w-5 h-5 accent-primary-600 cursor-pointer' />
                        </div>

                        <div className='bg-gray-50 rounded-xl border border-gray-100 p-4'>
                            <div className='text-sm font-semibold text-gray-700'>Giờ chạy</div>
                            <div className='text-xs text-gray-500 mb-2'>Định dạng HH:mm</div>
                            <CustomTimePicker value={value.scheduleTime} onChange={(t) => onChange({ ...value, scheduleTime: t })} dropdownAlign='right' />
                        </div>

                        <div className='bg-gray-50 rounded-xl border border-gray-100 p-4 md:col-span-2'>
                            <div className='text-sm font-semibold text-gray-700'>Ngưỡng tải (%)</div>
                            <div className='text-xs text-gray-500 mb-2'>Tỉ lệ tải để tự động ghép xe</div>
                            <CustomNumberInput value={value.loadThresholdPercent} onChange={(v) => onChange({ ...value, loadThresholdPercent: v })} min={0} max={100} className='w-full px-3 py-2 border border-primary-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent' />
                        </div>
                    </div>
                </div>

                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button onClick={handleConfirm} disabled={loading} className={`px-4 py-2 rounded-lg font-medium transition ${!loading ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                        {loading ? <Loader2 className='animate-spin' size={18} /> : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutoGroupingSettingsModal;
