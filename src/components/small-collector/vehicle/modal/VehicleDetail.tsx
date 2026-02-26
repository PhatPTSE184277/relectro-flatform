'use client';

import React, { useState } from 'react';
import { Truck, MapPin, Weight, Ruler, CheckCircle, Ban } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import { VehicleItem } from '@/services/small-collector/VehicleService';
import { useVehicleContext } from '@/contexts/small-collector/VehicleContext';
import VehicleApprove from './VehicleApprove';
import VehicleBlock from './VehicleBlock';

interface VehicleDetailProps {
    vehicle: VehicleItem | null;
    onClose: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onClose }) => {
    const { approveVehicle, blockVehicle, actionLoading } = useVehicleContext();
    const [showApprove, setShowApprove] = useState(false);
    const [showBlock, setShowBlock] = useState(false);

    const handleApprove = async () => {
        if (vehicle?.vehicleId) {
            await approveVehicle(vehicle.vehicleId);
            setShowApprove(false);
            onClose();
        }
    };

    const handleBlock = async () => {
        if (vehicle?.vehicleId) {
            await blockVehicle(vehicle.vehicleId);
            setShowBlock(false);
            onClose();
        }
    };

    const isActive = vehicle?.status === 'Đang hoạt động';

    if (!vehicle) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Modal container */}
            <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Chi tiết phương tiện</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer" aria-label="Đóng">&times;</button>
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                            <Truck className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin phương tiện
                    </h3>

                    <SummaryCard
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
                                label: 'Trạng thái',
                                value: vehicle.status || 'Chưa có',
                            },
                            {
                                icon: <MapPin size={14} className='text-primary-500' />,
                                label: 'Điểm thu gom',
                                value: vehicle.smallCollectionPointName || 'Chưa có',
                            },
                            {
                                icon: <Ruler size={14} className='text-primary-500' />,
                                label: 'Kích thước',
                                value: vehicle.lengthM && vehicle.widthM && vehicle.heightM
                                    ? `${vehicle.lengthM} × ${vehicle.widthM} × ${vehicle.heightM} (m)`
                                    : 'Chưa có',
                            },
                        ]}
                    />
                </div>

                {/* Footer actions */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    {isActive ? (
                        <button
                            onClick={() => setShowBlock(true)}
                            disabled={actionLoading}
                            className="px-5 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer flex items-center gap-2 disabled:opacity-40"
                        >
                            <Ban size={16} />
                            Khóa phương tiện
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowApprove(true)}
                            disabled={actionLoading}
                            className="px-5 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition cursor-pointer flex items-center gap-2 disabled:opacity-40"
                        >
                            <CheckCircle size={16} />
                            Duyệt phương tiện
                        </button>
                    )}
                </div>

                <style>{`
                    .animate-scaleIn { animation: scaleIn .2s ease-out; }
                    @keyframes scaleIn { from {transform: scale(.9); opacity: 0;} to {transform: scale(1); opacity: 1;} }
                `}</style>
            </div>

            {/* Confirm modals */}
            <VehicleApprove
                open={showApprove}
                onClose={() => setShowApprove(false)}
                onConfirm={handleApprove}
                loading={actionLoading}
            />
            <VehicleBlock
                open={showBlock}
                onClose={() => setShowBlock(false)}
                onConfirm={handleBlock}
                loading={actionLoading}
            />
        </div>
    );
};

export default VehicleDetail;
