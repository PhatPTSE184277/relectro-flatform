'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, MapPin, CheckCircle, Ban } from 'lucide-react';
import { IoFilterOutline } from 'react-icons/io5';
import SummaryCard from '@/components/ui/SummaryCard';
import {
    getSmallCollectionsFilter,
    approveCollectionPoint,
    blockCollectionPoint,
} from '@/services/admin/CollectionCompanyService';
import { SmallCollectionPoint } from '@/types';
import CollectionPointApprove from './CollectionPointApprove';
import CollectionPointBlock from './CollectionPointBlock';

interface CompanyDetailProps {
    company: any;
    onClose: () => void;
}

const SmallCollectionSkeleton: React.FC = () => (
    <>
        {Array.from({ length: 4 }).map((_, idx) => (
            <tr key={idx} className="border-b border-gray-100">
                <td className="py-3 px-4 text-center">
                    <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto" />
                </td>
                <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-40 animate-pulse" /></td>
                <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-56 animate-pulse" /></td>
                <td className="py-3 px-4 text-center"><div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse" /></td>
                <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                    </div>
                </td>
            </tr>
        ))}
    </>
);

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onClose }) => {
    const [smallCollections, setSmallCollections] = useState<SmallCollectionPoint[]>([]);
    const [scLoading, setScLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'active' | 'inactive'>('active');
    const [actionLoading, setActionLoading] = useState(false);
    const [pendingApproveId, setPendingApproveId] = useState<string | number | null>(null);
    const [pendingBlockId, setPendingBlockId] = useState<string | number | null>(null);

    const loadPoints = (id: string | number) => {
        setScLoading(true);
        getSmallCollectionsFilter({ companyId: String(id), limit: 100 })
            .then((res) => setSmallCollections(res?.data ?? []))
            .catch(() => setSmallCollections([]))
            .finally(() => setScLoading(false));
    };

    useEffect(() => {
        if (!company?.id) return;
        loadPoints(company.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company?.id]);

    const handleApprove = async () => {
        if (!pendingApproveId) return;
        setActionLoading(true);
        try {
            await approveCollectionPoint(pendingApproveId);
            loadPoints(company.id);
        } finally {
            setActionLoading(false);
            setPendingApproveId(null);
        }
    };

    const handleBlock = async () => {
        if (!pendingBlockId) return;
        setActionLoading(true);
        try {
            await blockCollectionPoint(pendingBlockId);
            loadPoints(company.id);
        } finally {
            setActionLoading(false);
            setPendingBlockId(null);
        }
    };

    const filtered = smallCollections.filter((p) =>
        filterStatus === 'active'
            ? p.status === 'DANG_HOAT_DONG'
            : p.status !== 'DANG_HOAT_DONG'
    );

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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

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
                    {/* Company info */}
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

                    {/* Small collection section */}
                    <div className="mt-2">
                        {/* Section heading */}
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-bold text-primary-700 uppercase tracking-wide">
                                Điểm thu gom nhỏ
                            </span>
                        </div>

                        {/* Filter */}
                        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-4">
                            <div className="flex items-center gap-2 flex-wrap min-h-9">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                                    <IoFilterOutline className="text-primary-600" size={16} />
                                </span>
                                <button
                                    onClick={() => setFilterStatus('active')}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                                        filterStatus === 'active'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Hoạt động
                                </button>
                                <button
                                    onClick={() => setFilterStatus('inactive')}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                                        filterStatus === 'inactive'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Không hoạt động
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="overflow-x-auto">
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="min-w-full text-sm text-gray-800 table-fixed">
                                        <thead className="bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100">
                                            <tr>
                                                <th className="py-3 px-4 text-center w-16">STT</th>
                                                <th className="py-3 px-4 text-left w-52">Tên điểm</th>
                                                <th className="py-3 px-4 text-left">Địa chỉ</th>
                                                <th className="py-3 px-4 text-center w-40">Giờ mở cửa</th>
                                                <th className="py-3 px-4 text-center w-32">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scLoading ? (
                                                <SmallCollectionSkeleton />
                                            ) : filtered.length > 0 ? (
                                                filtered.map((point, idx) => (
                                                    <tr
                                                        key={point.id}
                                                        className={`${idx !== filtered.length - 1 ? 'border-b border-primary-100' : ''} ${idx % 2 === 0 ? 'bg-white' : 'bg-primary-50'}`}
                                                    >
                                                        <td className="py-3 px-4 text-center">
                                                            <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                                                                {idx + 1}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 font-medium text-gray-900">
                                                            {point.name || 'Không rõ'}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-700">
                                                            {point.address || <span className="text-gray-400">Chưa có</span>}
                                                        </td>
                                                        <td className="py-3 px-4 text-center text-gray-700">
                                                            {point.openTime || <span className="text-gray-400">Chưa có</span>}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <div className="flex justify-center items-center gap-2">
                                                                {point.status === 'DANG_HOAT_DONG' ? (
                                                                    <button
                                                                        onClick={() => setPendingBlockId(point.id)}
                                                                        disabled={actionLoading}
                                                                        className="text-red-500 hover:text-red-700 disabled:opacity-40 transition cursor-pointer"
                                                                        title="Khóa"
                                                                    >
                                                                        <Ban size={16} />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setPendingApproveId(point.id)}
                                                                        disabled={actionLoading}
                                                                        className="text-green-500 hover:text-green-700 disabled:opacity-40 transition cursor-pointer"
                                                                        title="Duyệt"
                                                                    >
                                                                        <CheckCircle size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                                        Không có điểm thu gom nào.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
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

            {/* Confirm approve */}
            <CollectionPointApprove
                open={!!pendingApproveId}
                onClose={() => setPendingApproveId(null)}
                onConfirm={handleApprove}
                loading={actionLoading}
            />

            {/* Confirm block */}
            <CollectionPointBlock
                open={!!pendingBlockId}
                onClose={() => setPendingBlockId(null)}
                onConfirm={handleBlock}
                loading={actionLoading}
            />
        </div>
    );
};

export default CompanyDetail;