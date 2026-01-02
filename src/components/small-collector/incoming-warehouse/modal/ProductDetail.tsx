/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/Product';
import {
    Package,
    Star,
    UserCheck,
    User,
    List,
    FileText
} from 'lucide-react';
import UserInfo from '@/components/ui/UserInfo';
import SummaryCard from '@/components/ui/SummaryCard';

interface ProductDetailProps {
    product: Product;
    onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    if (!product) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                <div
                    className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                ></div>
                <div className='relative bg-white rounded-2xl p-8 shadow-2xl z-10'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                        <p className='mt-4 text-gray-600'>
                            Đang tải thông tin sản phẩm...
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    const isReceived = product.status === 'Nhập kho';

    // Badge status - đồng bộ với PostDetail
    const getStatusBadgeClass = (status: string) => {
        const normalized = status?.toLowerCase() || '';
        const badge: Record<string, string> = {
            'chờ thu gom': 'bg-yellow-100 text-yellow-700',
            chờ: 'bg-yellow-100 text-yellow-700',
            pending: 'bg-yellow-100 text-yellow-700',
            'đã thu gom': 'bg-blue-100 text-blue-700',
            'đã thu': 'bg-blue-100 text-blue-700',
            collected: 'bg-blue-100 text-blue-700',
            'hủy bỏ': 'bg-red-100 text-red-700',
            hủy: 'bg-red-100 text-red-700',
            cancelled: 'bg-red-100 text-red-700',
            'nhập kho': 'bg-green-100 text-green-700',
            nhập: 'bg-green-100 text-green-700',
            received: 'bg-green-100 text-green-700',
            'đóng gói': 'bg-purple-100 text-purple-700',
            packed: 'bg-purple-100 text-purple-700',
            'đang vận chuyển': 'bg-indigo-100 text-indigo-700'
        };
        const key = Object.keys(badge).find((k) => normalized.includes(k));
        return key ? badge[key] : 'bg-gray-100 text-gray-600';
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
                            Chi tiết sản phẩm
                        </h2>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(product.status)}`}
                        >
                            {product.status}
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
                <div className='flex flex-col md:flex-row flex-1 overflow-hidden'>
                    {/* LEFT - IMAGE + PICKUP SCHEDULE */}
                    <div className='md:w-1/3 bg-gray-50 flex flex-col items-center p-6 border-r border-primary-100 overflow-y-auto'>
                        <div className='relative w-full flex flex-col items-center gap-4'>
                            <img
                                src={product.productImages?.[selectedImg] || '/placeholder.png'}
                                alt='Ảnh sản phẩm'
                                className='w-full max-w-[180px] h-40 object-contain rounded-xl border border-primary-200 bg-white cursor-zoom-in shadow-sm'
                                onClick={() => setZoomImg(product.productImages?.[selectedImg])}
                            />
                            <div className='flex gap-2 flex-wrap justify-center'>
                                {(product.productImages ?? []).map((img: string, idx: number) => (
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
                        {/* Pickup schedule moved here */}
                        {/* {Array.isArray(product.schedule) && product.schedule.length > 0 && (() => {
                            const scheduleGroups = groupScheduleByTimeRange(product.schedule);
                            const displayText = scheduleGroups.length > 0 
                                ? `${scheduleGroups[0].range} | ${scheduleGroups[0].dateStr}`
                                : 'Không có thông tin';
                            return (
                                <div className='w-full mt-6'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                            <Clock className='text-primary-500' size={18} />
                                        </span>
                                        <h3 className='text-base font-semibold text-gray-800'>
                                            Lịch thu gom
                                        </h3>
                                    </div>
                                    <SummaryCard
                                        singleRow={false}
                                        items={[
                                            {
                                                label: <span className="whitespace-nowrap">Ngày</span>,
                                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Calendar className="w-4 h-4 text-primary-500" /></span>,
                                                value: <span className="whitespace-nowrap">{displayText}</span>
                                            },
                                            product.address && {
                                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><MapPin className="w-4 h-4 text-primary-500" /></span>,
                                                label: 'Địa chỉ',
                                                value: <span className="block w-full wrap-break-word">{product.address}</span>,
                                                colSpan: 2
                                            }
                                        ].filter(Boolean) as import("@/components/ui/SummaryCard").SummaryCardItem[]}
                                    />
                                </div>
                            );
                        })()} */}
                    </div>

                    {/* RIGHT - INFO */}
                    <div className='md:w-2/3 p-6 space-y-5 overflow-y-auto'>

                    
                        {/* Product Info (all in one SummaryCard) */}
                        <SummaryCard
                            label={
                                <span className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary-500" />
                                    Thông tin sản phẩm
                                </span>
                            }
                            singleRow={false}
                            items={[ 
                                    product.brandName && {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><User className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Thương hiệu',
                                        value: product.brandName
                                    },
                                    {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><List className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Danh mục',
                                        value: product.categoryName || 'Không rõ'
                                    },
                                    product.qrCode && {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Package className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Mã QR',
                                        value: product.qrCode
                                    },
                                    {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Star className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Điểm ước tính',
                                        value: product.estimatePoint || 0
                                    },
                                    product.sizeTierName && {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Package className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Kích thước',
                                        value: product.sizeTierName
                                    },
                                    product.description && {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><FileText className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Mô tả',
                                        value: product.description
                                    }
                                ].filter(Boolean) as import("@/components/ui/SummaryCard").SummaryCardItem[]}
                        />

                        {/* Đã thu gom (realPoint) */}
                        {isReceived && (
                            <div className='p-4 bg-green-50 rounded-lg border flex items-center gap-3'>
                                <Star size={20} className='text-green-600' />
                                <div>
                                    <p className='text-sm text-green-700 font-semibold'>
                                        Sản phẩm đã thu gom
                                    </p>
                                    <p className='text-gray-900 text-lg font-bold'>
                                        Điểm nhận được: {product.realPoints}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Collector Info */}

                        {product.collector && (
                            <UserInfo
                                user={product.collector}
                                label={
                                    <span className='flex items-center gap-2'>
                                        <UserCheck className='text-primary-500' size={18} />
                                        Nhân viên thu gom
                                    </span>
                                }
                            />
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
                        src={zoomImg || ''}
                        alt='Ảnh phóng to sản phẩm'
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
export default ProductDetail;
