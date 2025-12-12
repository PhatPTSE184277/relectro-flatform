'use client';

import React from 'react';
import { Truck, MapPin, Weight, Ruler } from 'lucide-react';
import InfoCard from '@/components/ui/InfoCard';
import SummaryCard from '@/components/ui/SummaryCard';

interface VehicleDetailProps {
    vehicle: any | null;
    onClose: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onClose }) => {
    if (!vehicle) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative bg-white rounded-2xl p-6 max-w-md shadow-xl z-10">
                    <p className="text-gray-500">Không có dữ liệu phương tiện</p>
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
            <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Chi tiết phương tiện
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Thông tin chi tiết về phương tiện
                        </p>
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
                    {/* Thông tin phương tiện Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                            <Truck className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin phương tiện
                    </h3>
                    {/* Summary section */}
                    <SummaryCard
                        columns={4}
                        items={[
                            {   
                                icon: <Truck size={14} className='text-primary-500' />,
                                label: 'Biển số xe',
                                value: vehicle.plateNumber || 'Không rõ',
                            },
                            {
                                icon: <Weight size={14} className='text-primary-500' />,
                                label: 'Tải trọng',
                                value: vehicle.capacityKg ? `${vehicle.capacityKg} kg` : 'Chưa có',
                            },
                            {
                                icon: <Truck size={14} className='text-primary-500' />,
                                label: 'Loại xe',
                                value: vehicle.vehicleType || 'Không rõ loại xe',
                            },
                            {
                                icon: <Ruler size={14} className='text-primary-500' />,
                                label: 'Thể tích',
                                value: vehicle.capacityM3 ? `${vehicle.capacityM3} m³` : 'Chưa có',
                            },
                        ]}
                    />
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<MapPin className='w-4 h-4 text-primary-500' />}
                                    label="Điểm thu gom"
                                    value={vehicle.smallCollectionPointName || 'Chưa có'}
                                />
                                <InfoCard
                                    icon={<MapPin className='w-4 h-4 text-primary-500' />}
                                    label="Bán kính hoạt động"
                                    value={vehicle.radiusKm ? `${vehicle.radiusKm} km` : 'Chưa có'}
                                />
                            </div>
                        </div>
                    </div>
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

export default VehicleDetail;
