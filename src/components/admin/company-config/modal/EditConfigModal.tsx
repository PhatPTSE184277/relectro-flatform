'use client';

import React, { useState, useEffect } from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import { MapPin } from 'lucide-react';

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
    const [smallPoints, setSmallPoints] = useState<any[]>([]);

    useEffect(() => {
        if (open && company) {
            const newSmallPoints = Array.isArray(company.smallPoints) ? [...company.smallPoints] : [];
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
                            {/* Small Points Configuration */}
                            <div>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                            <MapPin size={18} className='text-primary-600' />
                                        </span>
                                        Cấu hình điểm thu gom
                                    </h3>
                                    <span className='text-base text-gray-500 font-medium'>{company.companyName || 'N/A'}</span>
                                </div>
                                <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-sm text-gray-800'>
                                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                                <tr>
                                                    <th className='py-3 px-4 text-left'>STT</th>
                                                    <th className='py-3 px-4 text-left'>Tên điểm</th>
                                                    <th className='py-3 px-4 text-left'>Bán kính (km)</th>
                                                    <th className='py-3 px-4 text-left'>Khoảng cách tối đa (km)</th>
                                                    <th className='py-3 px-4 text-left'>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {smallPoints?.map((sp, idx) => {
                                                    const isLast = idx === smallPoints.length - 1;
                                                    return (
                                                        <tr
                                                            key={sp.smallPointId}
                                                            className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors`}
                                                        >
                                                            <td className='py-3 px-4 font-medium'>
                                                                <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                                    {idx + 1}
                                                                </span>
                                                            </td>
                                                            <td className='py-3 px-4 font-medium text-gray-900'>
                                                                {sp.name || `Điểm ${sp.smallPointId}`}
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <CustomNumberInput
                                                                    value={sp.radiusKm}
                                                                    onChange={(val) => handleUpdateRadius(sp.smallPointId, val)}
                                                                    min={1}
                                                                    max={50}
                                                                    placeholder='Bán kính'
                                                                    className={`w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 placeholder-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${sp.radiusKm <= 0 ? 'border-red-400' : 'border-primary-200'}`}
                                                                />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <CustomNumberInput
                                                                    value={sp.maxRoadDistanceKm}
                                                                    onChange={(val) => handleUpdateMaxDistance(sp.smallPointId, val)}
                                                                    min={1}
                                                                    max={100}
                                                                    placeholder='Tối đa'
                                                                    className={`w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 placeholder-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${sp.maxRoadDistanceKm <= 0 ? 'border-red-400' : 'border-primary-200'}`}
                                                                />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${sp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {sp.active ? 'Hoạt động' : 'Không hoạt động'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
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
