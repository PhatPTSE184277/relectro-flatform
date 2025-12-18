'use client';

import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';

interface PointSelectModalProps {
    open: boolean;
    points: any[];
    selectedPointId: number | null;
    onClose: () => void;
    onSelect: (pointId: number) => void;
}

const PointSelectModal: React.FC<PointSelectModalProps> = ({
    open,
    points,
    selectedPointId,
    onClose,
    onSelect
}) => {
    const [search, setSearch] = useState('');

    const filteredPoints = points.filter((point) => {
        const pointName = point.name || point.smallPointName || '';
        return pointName.toLowerCase().includes(search.toLowerCase());
    });

    const handleSelect = (pointId: number) => {
        onSelect(pointId);
        onClose();
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
            <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[80vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Chọn điểm thu gom
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Chọn điểm thu gom để xem danh sách sản phẩm
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

                {/* Search */}
                <div className='p-4 border-b bg-gray-50'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm điểm thu gom...'
                    />
                </div>

                {/* Point List */}
                <div className='flex-1 overflow-y-auto p-4'>
                    {filteredPoints.length === 0 ? (
                        <div className='text-center py-12 text-gray-400'>
                            Không tìm thấy điểm thu gom nào
                        </div>
                    ) : (
                        <div className='grid gap-3'>
                            {filteredPoints.map((point) => {
                                const isSelected = String(selectedPointId) === String(point.smallPointId);

                                return (
                                    <div
                                        key={point.smallPointId}
                                        onClick={() => handleSelect(point.smallPointId)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                            isSelected
                                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                                        }`}
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                isSelected ? 'bg-primary-500' : 'bg-primary-100'
                                            }`}>
                                                <MapPin size={20} className={isSelected ? 'text-white' : 'text-primary-600'} />
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='font-semibold text-gray-900 text-sm'>
                                                    {point.name || point.smallPointName || 'N/A'}
                                                </h3>
                                                <div className='flex items-center gap-2 mt-1'>
                                                    <p className='text-xs text-gray-500 flex items-center gap-1'>
                                                        Bán kính: {point.radiusKm || 0} km
                                                    </p>
                                                    <span className='text-gray-400'>•</span>
                                                    <p className='text-xs text-gray-500'>
                                                        Đường đi: {point.maxRoadDistanceKm || 0} km
                                                    </p>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className='w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center'>
                                                    <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
            `}</style>
        </div>
    );
};

export default PointSelectModal;
