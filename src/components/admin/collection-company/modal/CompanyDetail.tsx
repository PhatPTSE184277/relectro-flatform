'use client';

import React from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';

interface CompanyDetailProps {
    company: any;
    onClose: () => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onClose }) => {
    if (!company) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="relative bg-white rounded-2xl p-6 max-w-md shadow-xl z-10">
                    <p className="text-gray-500">Không có dữ liệu công ty</p>
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
            ></div>

            {/* Modal container */}
            <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Chi tiết công ty
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
                <div className="flex-1 overflow-y-auto p-6 pt-10">
                    <SummaryCard
                        label={
                            <span className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary-500" />
                                Thông tin công ty
                            </span>
                        }
                        items={[
                            {
                                icon: <Building2 className="w-4 h-4 text-primary-500" />, 
                                label: 'Tên công ty',
                                value: company.name || 'Không rõ',
                            },
                            {
                                icon: <Mail className="w-4 h-4 text-primary-500" />, 
                                label: 'Email',
                                value: company.companyEmail || 'Chưa có',
                            },
                            {
                                icon: <Phone className="w-4 h-4 text-primary-500" />, 
                                label: 'Số điện thoại',
                                value: company.phone || 'Chưa có',
                            },
                            {
                                icon: <MapPin className="w-4 h-4 text-primary-500" />, 
                                label: 'Thành phố',
                                value: company.city || 'Chưa có',
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

export default CompanyDetail;