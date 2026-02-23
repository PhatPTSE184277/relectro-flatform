/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import type { Product } from '@/types/Product';
import {
    Package,
    UserCheck,
    User,
    List,
    FileText,
    Loader2
} from 'lucide-react';
import UserInfo from '@/components/ui/UserInfo';
import SummaryCard, { SummaryCardItem } from '@/components/ui/SummaryCard';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import CustomTextarea from '@/components/ui/CustomTextarea';
import { updatePointsTransaction } from '@/services/small-collector/IWProductService';

interface ProductDetailProps {
    product: Product;
    onClose: () => void;
}

const REASON_TAGS = [
    "Sản phẩm bị hỏng",
    "Thiếu linh kiện",
    "Chất lượng không như mô tả",
    "Khác"
];

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);
    const originalPoint = product?.realPoints ?? product?.estimatePoint ?? 0;
    const [point, setPoint] = useState<number>(originalPoint);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setPoint(product?.realPoints ?? product?.estimatePoint ?? 0);
        setSelectedTags([]);
        setCustomReason('');
    }, [product]);

    const isPointChanged = point !== originalPoint;

    const handleConfirm = async () => {
        if (!isPointChanged) return;
        const reasons = selectedTags.filter(t => t !== "Khác");
        if (selectedTags.includes("Khác")) {
            if (customReason.trim()) reasons.push(customReason.trim());
        }
        if (reasons.length === 0) return;
        
        setSubmitting(true);
        try {
            await updatePointsTransaction(product.productId, point, reasons.join("; "));
            onClose();
        } catch (err) {
            console.error('Update points error', err);
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/60 backdrop-blur-sm'
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
                            className="flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-primary-600 text-white"
                            style={{ minWidth: 110 }}
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
                                    ,
                                    // Points: editable field - only show when product is received into warehouse (status includes 'nhập')
                                    ((product.status || '').toLowerCase().includes('nhập')) ? {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Package className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Điểm',
                                        value: (
                                            <CustomNumberInput
                                                value={point}
                                                onChange={setPoint}
                                                min={0}
                                                className='w-24 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                            />
                                        )
                                    } : undefined,
                                    // Optional changed point message (admin notes)
                                    product.changedPointMessage ? {
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><FileText className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Ghi chú điểm',
                                        value: product.changedPointMessage,
                                        colSpan: 2
                                    } : undefined
                                ].filter(Boolean) as SummaryCardItem[]}
                        />

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

                        {/* Reason for point change */}
                        {isPointChanged && (
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Lý do đổi điểm <span className='text-red-500'>*</span>
                                </label>
                                <div className='flex flex-wrap gap-2 mb-2 items-center'>
                                    {REASON_TAGS.slice(0, 3).map((tag) => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                type='button'
                                                key={tag}
                                                className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer
                                                    ${isSelected ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'}`}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag]);
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className='flex gap-2 mb-2'>
                                    {(() => {
                                        const tag = REASON_TAGS[3];
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                type='button'
                                                key={tag}
                                                className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer
                                                    ${isSelected ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'}`}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                                        setCustomReason('');
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag]);
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })()}
                                </div>
                                {selectedTags.includes('Khác') && (
                                    <CustomTextarea
                                        value={customReason}
                                        onChange={setCustomReason}
                                        placeholder='Nhập lý do tại sao thay đổi điểm...'
                                        rows={3}
                                    />
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                {isPointChanged && (
                    <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                        <button
                            onClick={handleConfirm}
                            disabled={(selectedTags.length === 0 || (selectedTags.includes('Khác') && selectedTags.length === 1 && !customReason.trim())) || submitting}
                            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2'
                        >
                            {submitting ? <Loader2 className='animate-spin' size={16} /> : null}
                            Xác nhận
                        </button>
                    </div>
                )}
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
