'use client';

import React, { useState, useEffect } from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import { MapPin, Settings } from 'lucide-react';

interface EditConfigModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (company: any) => void;
    company: any;
    loading?: boolean;
}

const EditConfigModal: React.FC<EditConfigModalProps> = ({
    open,
    onClose,
    onConfirm,
    company,
    loading = false
}) => {
    const [ratioPercent, setRatioPercent] = useState<number>(0);
    const [smallPoints, setSmallPoints] = useState<any[]>([]);

    useEffect(() => {
        if (open && company) {
            const newRatioPercent =
                typeof company.ratioPercent === 'number' && !isNaN(company.ratioPercent)
                    ? company.ratioPercent
                    : 0;
            const newSmallPoints = Array.isArray(company.smallPoints) ? [...company.smallPoints] : [];

            setRatioPercent(newRatioPercent);
            setSmallPoints(newSmallPoints);
        }
    }, [open, company]);

    const handleUpdateRadius = (smallPointId: number, radiusKm: number) => {
        setSmallPoints((prev) =>
            prev.map((sp) =>
                sp.smallPointId === smallPointId
                    ? { ...sp, radiusKm }
                    : sp
            )
        );
    };

    const handleUpdateMaxDistance = (smallPointId: number, maxRoadDistanceKm: number) => {
        setSmallPoints((prev) =>
            prev.map((sp) =>
                sp.smallPointId === smallPointId
                    ? { ...sp, maxRoadDistanceKm }
                    : sp
            )
        );
    };

    const handleConfirm = () => {
        onConfirm({
            ...company,
            ratioPercent,
            smallPoints
        });
    };

    const handleClose = () => {
        onClose();
    };

    if (!open || !company) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            Chỉnh sửa cấu hình
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Điều chỉnh tỷ lệ và cấu hình điểm thu gom
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {loading ? (
                        <div className='flex items-center justify-center py-12'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
                        </div>
                    ) : (
                        <>
                            {/* Ratio Percent OUTSIDE, styled like card below */}
                            <div className='border rounded-lg p-4 mb-6 bg-primary-50/30 border-primary-200'>
                                <div className='flex items-center justify-between mb-3'>
                                    <label className='font-medium text-gray-900 flex items-center gap-2 text-base'>
                                        Tỷ lệ phân bổ cho team (%)
                                    </label>
                                    <span className='text-lg font-semibold text-primary-600 min-w-[60px] text-right'>
                                        {ratioPercent}%
                                    </span>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={ratioPercent}
                                        onChange={(e) => setRatioPercent(Number(e.target.value))}
                                        className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500'
                                    />
                                </div>
                                <p className='text-xs text-gray-500 mt-2'>
                                    Tỷ lệ công việc được phân bổ cho team này
                                </p>
                            </div>

                            {/* Small Points Configuration */}
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <MapPin size={18} className='text-primary-600' />
                                    </span>
                                    Cấu hình điểm thu gom
                                </h3>
                                <div className='space-y-4'>
                                    {smallPoints?.map((sp, idx) => {
                                        return (
                                            <div
                                                key={idx}
                                                className={`border rounded-lg p-4 ${
                                                    sp.active
                                                        ? 'border-primary-200 bg-primary-50/30'
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <div className='flex items-center justify-between mb-3'>
                                                    <div>
                                                        <h4 className='font-medium text-gray-900 flex items-center gap-2'>
                                                            {sp.name || `Điểm ${sp.smallPointId}`}
                                                        </h4>
                                                        <p className='text-xs text-gray-500'>
                                                            {company.companyName || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                            sp.active
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        {sp.active ? 'Hoạt động' : 'Tắt'}
                                                    </span>
                                                </div>

                                                <div className='grid grid-cols-2 gap-4'>
                                                    <div>
                                                        <label className='block text-xs font-medium text-gray-700 mb-2'>
                                                            Bán kính (km)
                                                        </label>
                                                        <CustomNumberInput
                                                            value={sp.radiusKm}
                                                            onChange={(val) => handleUpdateRadius(sp.smallPointId, val)}
                                                            min={1}
                                                            max={50}
                                                            placeholder='Nhập bán kính...'
                                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 placeholder-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${sp.radiusKm <= 0 ? 'border-red-400' : 'border-primary-200'}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='block text-xs font-medium text-gray-700 mb-2'>
                                                            Khoảng cách tối đa (km)
                                                        </label>
                                                        <CustomNumberInput
                                                            value={sp.maxRoadDistanceKm}
                                                            onChange={(val) => handleUpdateMaxDistance(sp.smallPointId, val)}
                                                            min={1}
                                                            max={100}
                                                            placeholder='Nhập khoảng cách tối đa...'
                                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 placeholder-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${sp.maxRoadDistanceKm <= 0 ? 'border-red-400' : 'border-primary-200'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t bg-gray-50'>
                    <button
                        onClick={handleConfirm}
                        className='px-6 py-2.5 text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer'
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditConfigModal;
