'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';

interface EditSettingModalProps {
    open: boolean;
    point: any;
    onClose: () => void;
    onSave: (pointId: string, serviceTime: number, travelTime: number) => void;
}

const EditSettingModal: React.FC<EditSettingModalProps> = ({
    open,
    point,
    onClose,
    onSave
}) => {
    const [serviceTimeMinutes, setServiceTimeMinutes] = useState(0);
    const [avgTravelTimeMinutes, setAvgTravelTimeMinutes] = useState(0);

    // Chỉ reset state khi modal vừa mở (open chuyển từ false sang true)
    useEffect(() => {
        if (!open) return;
        setServiceTimeMinutes(point?.serviceTimeMinutes || 0);
        setAvgTravelTimeMinutes(point?.avgTravelTimeMinutes || 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSave = () => {
        onSave(point.smallPointId, serviceTimeMinutes, avgTravelTimeMinutes);
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Chỉnh sửa cấu hình
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            {point?.smallPointName || 'N/A'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>


                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 bg-white'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Service Time */}
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-2 items-center gap-2'>
                                <Clock size={16} className='text-primary-600' />
                                Thời gian phục vụ (phút){' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <CustomNumberInput
                                value={serviceTimeMinutes}
                                onChange={setServiceTimeMinutes}
                                placeholder='Nhập thời gian phục vụ...'
                                min={1}
                                className='w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                            />
                            <p className='text-xs text-gray-500 mt-2'>
                                Thời gian trung bình để phục vụ tại điểm này
                            </p>
                        </div>

                        {/* Avg Travel Time */}
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-2 items-center gap-2'>
                                <Clock size={16} className='text-primary-600' />
                                Thời gian di chuyển TB (phút){' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <CustomNumberInput
                                value={avgTravelTimeMinutes}
                                onChange={setAvgTravelTimeMinutes}
                                placeholder='Nhập thời gian di chuyển...'
                                min={1}
                                className='w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:border-primary-400 text-gray-900 placeholder-gray-400'
                            />
                            <p className='text-xs text-gray-500 mt-2'>
                                Thời gian trung bình để di chuyển đến điểm tiếp theo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleSave}
                        className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 flex items-center gap-2'
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

export default EditSettingModal;
