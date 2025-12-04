'use client';

import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Collector } from '@/types';

interface CollectorDetailProps {
    collector: Collector | null;
    onClose: () => void;
}

const CollectorDetail: React.FC<CollectorDetailProps> = ({ collector, onClose }) => {
    if (!collector) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative bg-white rounded-2xl p-6 max-w-md shadow-xl z-10">
                    <p className="text-gray-500">Không có dữ liệu nhân viên</p>
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
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100 border-primary-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Chi tiết nhân viên thu gom
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Thông tin chi tiết về nhân viên
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
                    {/* Avatar và thông tin cơ bản */}
                    <div className="flex items-center gap-6 mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <img
                            src={collector.avatar || 'https://via.placeholder.com/100'}
                            alt={collector.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 shadow-md"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{collector.name}</h3>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                Điểm thu gom: {collector.smallCollectionPointId}
                            </span>
                        </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                            <User className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin liên hệ
                    </h3>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 gap-4">
                            <InfoCard 
                                icon={<Mail className="w-5 h-5 text-primary-500" />}
                                label="Email" 
                                value={collector.email || 'Chưa có'} 
                            />
                            <InfoCard 
                                icon={<Phone className="w-5 h-5 text-primary-500" />}
                                label="Số điện thoại" 
                                value={collector.phone || 'Chưa có'} 
                            />
                            <InfoCard 
                                icon={<MapPin className="w-5 h-5 text-primary-500" />}
                                label="Điểm thu gom" 
                                value={`Điểm thu gom số ${collector.smallCollectionPointId}`} 
                            />
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

// InfoCard Component
interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary-100">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm text-gray-900 font-semibold">{value}</p>
        </div>
    </div>
);

export default CollectorDetail;
