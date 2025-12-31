/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { formatTime } from '@/utils/FormatTime';
import { formatDate } from '@/utils/FormatDate';
import SummaryCard from '@/components/ui/SummaryCard';
import UserInfo from '@/components/ui/UserInfo';
import {
    User,
    Package,
    UserCheck,
    Calendar,
    MapPin,
    Truck
} from 'lucide-react';

interface CollectorRouteDetailProps {
    route: any;
    onClose: () => void;
}

const CollectorRouteDetail: React.FC<CollectorRouteDetailProps> = ({
    route,
    onClose
}) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    function normalizeStatus(status: string = '') {
        const s = status.trim().toLowerCase();
        if (s === 'hoàn thành' || s === 'đã hoàn thành' || s === 'completed')
            return 'Hoàn thành';
        if (
            s === 'đang tiến hành' ||
            s === 'đang thu gom' ||
            s === 'collecting' ||
            s === 'in progress'
        )
            return 'Đang tiến hành';
        if (s === 'chưa bắt đầu' || s === 'not started') return 'Chưa bắt đầu';
        if (s === 'hủy bỏ' || s === 'cancelled' || s === 'canceled')
            return 'Hủy bỏ';
        return status;
    }

    const getStatusBadgeClass = (status: string) => {
        const normalized = normalizeStatus(status);
        const badge: Record<string, string> = {
            'Hoàn thành': 'bg-green-100 text-green-700',
            'Đang tiến hành': 'bg-blue-100 text-blue-700',
            'Chưa bắt đầu': 'bg-yellow-100 text-yellow-700',
            'Hủy bỏ': 'bg-red-100 text-red-700'
        };
        return badge[normalized] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleIn max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Chi tiết tuyến thu gom
                        </h2>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                                route.status
                            )}`}
                        >
                            {normalizeStatus(route.status)}
                        </span>
                        <button
                            onClick={onClose}
                            className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                            aria-label='Đóng'
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='flex flex-col md:flex-row flex-1'>
                    {/* LEFT - IMAGE (match ProductDetail style) */}
                    <div className='md:w-1/3 bg-gray-50 flex flex-col items-center p-6 border-r border-primary-100 overflow-y-auto'>
                        <div className='relative w-full flex flex-col items-center gap-4'>
                            <img
                                src={route.pickUpItemImages?.[selectedImg] || '/placeholder.png'}
                                alt='Ảnh chính'
                                className='w-full max-w-[180px] h-40 object-contain rounded-xl border border-primary-200 bg-white cursor-zoom-in shadow-sm'
                                onClick={() => setZoomImg(route.pickUpItemImages?.[selectedImg])}
                            />
                            <div className='flex gap-2 flex-wrap justify-center'>
                                {(route.pickUpItemImages ?? []).map((img: string, idx: number) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Ảnh ${idx + 1}`}
                                        className={`w-14 h-14 object-cover rounded-lg border cursor-pointer transition-all ${
                                            selectedImg === idx
                                                ? 'border-primary-500 ring-2 ring-primary-200 scale-105'
                                                : 'border-primary-100 hover:border-primary-200'
                                        }`}
                                        onClick={() => setSelectedImg(idx)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - INFO */}
                    <div className='md:w-2/3 p-6 space-y-5'>
                        {/* Thông tin sản phẩm */}
                        <SummaryCard
                            label={
                                <span className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary-500" />
                                    Thông tin sản phẩm
                                </span>
                            }
                            singleRow={false}
                            items={[
                                {
                                    icon: (
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                            <User className='w-4 h-4 text-primary-500' />
                                        </span>
                                    ),
                                    label: 'Thương hiệu',
                                    value: route.brandName || 'Không rõ'
                                },
                                {
                                    icon: (
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                            <Package className='w-4 h-4 text-primary-500' />
                                        </span>
                                    ),
                                    label: 'Danh mục',
                                    value: route.subCategoryName || 'Không rõ'
                                },
                                {
                                    icon: (
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                            <Truck className='w-4 h-4 text-primary-500' />
                                        </span>
                                    ),
                                    label: 'Biển số xe',
                                    value: route.licensePlate || 'Không rõ'
                                },
                                {
                                    icon: (
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                            <Calendar className='w-4 h-4 text-primary-500' />
                                        </span>
                                    ),
                                    label: 'Ngày và thời gian thu gom',
                                    value: route.collectionDate
                                        ? `${formatTime(route.estimatedTime)} - ${formatDate(route.collectionDate)}`
                                        : 'Không rõ'
                                },
                                {
                                    icon: (
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                            <MapPin className='w-4 h-4 text-primary-500' />
                                        </span>
                                    ),
                                    label: 'Địa chỉ',
                                    value: (
                                        <span className='block w-full wrap-break-word'>
                                            {route.address}
                                        </span>
                                    ),
                                    colSpan: 2
                                }
                            ]}
                        />

                        {/* Người gửi */}
                        <div className="mb-4">
                            <UserInfo
                                user={route.sender}
                                label={
                                    <span className='flex items-center gap-2'>
                                        <User className='text-primary-500' size={18} />
                                        Người gửi
                                    </span>
                                }
                            />
                        </div>

                        {/* Nhân viên thu gom */}
                        <UserInfo
                            user={route.collector}
                            label={
                                <span className='flex items-center gap-2'>
                                    <UserCheck className='text-primary-500' size={18} />
                                    Nhân viên thu gom
                                </span>
                            }
                        />

                        {/* Ảnh xác nhận */}
                        {Array.isArray(route.confirmImages) &&
                            route.confirmImages.length > 0 && (
                                <div className='p-4 bg-primary-50 rounded-lg border border-primary-100'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                            <Package
                                                className='text-primary-500'
                                                size={18}
                                            />
                                        </span>
                                        <p className='text-base font-semibold text-gray-800'>
                                            Ảnh xác nhận
                                        </p>
                                    </div>
                                    <div className='flex gap-2 flex-wrap'>
                                        {route.confirmImages.map(
                                            (img: string, idx: number) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Ảnh xác nhận ${
                                                        idx + 1
                                                    }`}
                                                    className='w-20 h-20 object-cover rounded-lg border-2 border-primary-100 cursor-pointer hover:border-primary-400 hover:shadow-lg transition-all'
                                                    onClick={() =>
                                                        setZoomImg(img)
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* ZOOM IMAGE */}
            {zoomImg && (
                <div
                    className='fixed inset-0 bg-black/70 flex items-center justify-center z-999'
                    onClick={() => setZoomImg(null)}
                >
                    <img
                        src={zoomImg}
                        alt='Ảnh phóng to'
                        className='max-w-[90vw] max-h-[90vh] shadow-2xl rounded-xl object-contain border-4 border-white'
                    />
                </div>
            )}

            {/* Animation */}
            <style>{`
                .animate-scaleIn { animation: scaleIn .2s ease-out; }
                @keyframes scaleIn { from {transform: scale(.9); opacity: 0;} to {transform: scale(1); opacity: 1;} }
            `}</style>
        </div>
    );
};

export default CollectorRouteDetail;
