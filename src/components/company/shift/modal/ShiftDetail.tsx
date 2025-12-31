'use client';


import React from 'react';
import { User, Calendar, Clock, Truck } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import RenderTimeCell from '@/utils/RenderTimeCell';

interface ShiftDetailProps {
    shift: any | null;
    onClose: () => void;
}

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift, onClose }) => {


    if (!shift) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative bg-white rounded-2xl p-6 max-w-md shadow-xl z-10">
                    <p className="text-gray-500">Không có dữ liệu ca làm việc</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Chi tiết ca làm việc
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer"
                        aria-label="Đóng"
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <SummaryCard
                        label={
                            <span className="flex items-center gap-2">
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                    <Calendar className='w-4 h-4 text-primary-500' />
                                </span>
                                Thông tin ca làm việc
                            </span>
                        }
                        items={[ 
                            {
                                icon: <User className="w-4 h-4 text-primary-500" />,
                                label: 'Nhân viên',
                                value: shift.collectorName || 'Chưa có',
                            },
                            {
                                icon: <Truck className="w-4 h-4 text-primary-500" />,
                                label: 'Biển số xe',
                                value: shift.plate_Number || 'Chưa có',
                            },
                            {
                                icon: <Clock className="w-4 h-4 text-primary-500" />,
                                label: 'Bắt đầu',
                                value: RenderTimeCell(shift.shift_Start_Time),
                            },
                            {
                                icon: <Clock className="w-4 h-4 text-primary-500" />,
                                label: 'Kết thúc',
                                value: RenderTimeCell(shift.shift_End_Time),
                            },
                        ]}
                    />
                </div>

                {/* Animation */}
                <style>{`
                    .animate-scaleIn { animation: scaleIn .2s ease-out; }
                    @keyframes scaleIn { from {transform: scale(.9); opacity: 0;} to {transform: scale(1); opacity: 1;} }
                `}</style>
            </div>
        </div>
    );
};

export default ShiftDetail;
