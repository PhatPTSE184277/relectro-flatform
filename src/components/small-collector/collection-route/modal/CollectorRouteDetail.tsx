/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { formatTime } from '@/utils/FormatTime';
import { formatDate } from '@/utils/FormateDate';
import { User, Package, MapPin, Clock, Calendar, Truck, Tag, UserCheck } from 'lucide-react';
import InfoCard from '@/components/ui/InfoCard';
import Section from '@/components/ui/Section';
import UserInfo from '@/components/ui/UserInfo';

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
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleIn max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex-1'>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Chi tiết tuyến thu gom
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Thông tin chi tiết về tuyến thu gom và lịch sử
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className='flex flex-col md:flex-row flex-1 overflow-hidden'>
                    {/* LEFT - IMAGE */}
                    <div className='md:w-1/3 p-6 bg-gray-50 flex flex-col items-center border-r border-primary-100 overflow-y-auto'>
                        <div className='w-full flex flex-col items-center gap-4'>
                            {/* Badge Status */}
                            <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusBadgeClass(
                                    route.status
                                )}`}
                            >
                                {normalizeStatus(route.status)}
                            </span>

                            {/* Main Image */}
                            <img
                                src={
                                    route.pickUpItemImages?.[selectedImg] ||
                                    '/placeholder.png'
                                }
                                alt='Ảnh chính'
                                className='w-full max-w-xs h-72 object-contain rounded-xl border border-primary-200 bg-white cursor-zoom-in shadow-sm'
                                onClick={() =>
                                    setZoomImg(
                                        route.pickUpItemImages?.[selectedImg]
                                    )
                                }
                            />

                            {/* Thumbnails */}
                            {Array.isArray(route.pickUpItemImages) &&
                                route.pickUpItemImages.length > 1 && (
                                    <div className='flex gap-2 flex-wrap justify-center'>
                                        {route.pickUpItemImages.map(
                                            (img: string, idx: number) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Ảnh ${idx + 1}`}
                                                    onClick={() =>
                                                        setSelectedImg(idx)
                                                    }
                                                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all ${
                                                        idx === selectedImg
                                                            ? 'border-2 border-primary-500 ring-2 ring-primary-200 scale-105'
                                                            : 'border border-primary-100 hover:border-primary-200'
                                                    }`}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* RIGHT - INFO */}
                    <div className='md:w-2/3 p-6 space-y-5 overflow-y-auto'>
                        {/* Thông tin tuyến thu gom */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <InfoCard
                                icon={<span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-primary-100"><Package className="w-4 h-4 text-primary-500" /></span>}
                                label="Thương hiệu"
                                value={route.brandName || 'Không rõ'}
                            />
                            <InfoCard
                                icon={<span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-primary-100"><Tag className="w-4 h-4 text-primary-500" /></span>}
                                label="Danh mục"
                                value={route.subCategoryName || 'Không rõ'}
                            />
                            <InfoCard
                                icon={<span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-primary-100"><Truck className="w-4 h-4 text-primary-500" /></span>}
                                label="Biển số xe"
                                value={route.licensePlate || 'Không rõ'}
                            />
                            <InfoCard
                                icon={<span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-primary-100"><Calendar className="w-4 h-4 text-primary-500" /></span>}
                                label="Ngày thu gom"
                                value={route.collectionDate ? new Date(route.collectionDate).toLocaleDateString('vi-VN') : 'Không rõ'}
                            />
                        </div>

                        {/* Người gửi */}
                        <Section
                            title='Người gửi'
                            icon={
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                    <User className='text-primary-500' size={18} />
                                </span>
                            }
                        >
                            <UserInfo user={route.sender} />
                        </Section>

                        {/* Nhân viên thu gom */}
                        <Section
                            title='Nhân viên thu gom'
                            icon={
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                    <UserCheck
                                        className='text-primary-500'
                                        size={18}
                                    />
                                </span>
                            }
                        >
                            <UserInfo user={route.collector} />
                        </Section>

                        {/* Lịch thu gom */}
                        <Section
                            title='Lịch thu gom'
                            icon={
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                    <Clock className='text-primary-500' size={18} />
                                </span>
                            }
                        >
                            <div className='space-y-2 text-sm text-gray-700'>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Ngày:</span>
                                    <span>
                                        {formatDate(route.collectionDate) ||
                                            'Chưa thu gom'}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>
                                        Thời gian dự kiến:
                                    </span>
                                    <span>
                                        {formatTime(route.estimatedTime)}
                                    </span>
                                </div>

                                <div className='pt-2 border-t'>
                                    <div className='flex items-start gap-2'>
                                        <MapPin
                                            size={16}
                                            className='text-gray-600 mt-0.5'
                                        />
                                        <span>{route.address}</span>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Ảnh xác nhận */}
                        {Array.isArray(route.confirmImages) &&
                            route.confirmImages.length > 0 && (
                                <Section
                                    title='Ảnh xác nhận'
                                    icon={
                                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                            <Package
                                                className='text-primary-500'
                                                size={18}
                                            />
                                        </span>
                                    }
                                >
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
                                </Section>
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
