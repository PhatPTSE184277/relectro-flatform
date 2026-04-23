/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/Product';
import { X, Package, FileText, UserCheck, Loader2 } from 'lucide-react';
import SummaryCard, { SummaryCardItem } from '@/components/ui/SummaryCard';
import UserInfo from '@/components/ui/UserInfo';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import CustomTextarea from '@/components/ui/CustomTextarea';

interface DashboardProductDetailModalProps {
    open: boolean;
    product: Product | null;
    loading: boolean;
    submitting: boolean;
    onClose: () => void;
    onConfirm: (productId: string, newPointValue: number, reasonForUpdate: string) => Promise<void>;
}

interface DashboardProductDetailModalContentProps {
    product: Product | null;
    loading: boolean;
    submitting: boolean;
    onClose: () => void;
    onConfirm: (productId: string, newPointValue: number, reasonForUpdate: string) => Promise<void>;
}

const REASON_TAGS = [
    'Sản phẩm bị hỏng',
    'Thiếu linh kiện',
    'Chất lượng không như mô tả',
    'Khác'
];

const DashboardProductDetailModalContent: React.FC<DashboardProductDetailModalContentProps> = ({
    product,
    loading,
    submitting,
    onClose,
    onConfirm
}) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);
    const [point, setPoint] = useState(product?.realPoints ?? product?.estimatePoint ?? 0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState('');

    const originalPoint = product?.realPoints ?? product?.estimatePoint ?? 0;
    const isPointChanged = point !== originalPoint;

    const normalizeStatus = (status: string = '') => {
        const s = (status || '').trim().toLowerCase();
        if (s === 'cho_thu_gom' || s === 'chờ thu gom') return 'Chờ thu gom';
        if (s === 'da_thu_gom' || s === 'đã thu gom') return 'Đã thu gom';
        if (s === 'that_bai' || s === 'thất bại') return 'Thất bại';
        if (s === 'nhap_kho' || s === 'nhập kho') return 'Nhập kho';
        if (s === 'dung' || s === 'đã dùng') return 'Đã dùng';
        if (s === 'da_tu_choi' || s === 'đã từ chối') return 'Đã từ chối';
        if (s === 'tai_che' || s === 'tái chế') return 'Tái chế';
        if (s === 'hoàn thành') return 'Hoàn thành';
        if (s === 'đang tiến hành') return 'Đang tiến hành';
        if (s === 'chưa bắt đầu') return 'Chưa bắt đầu';
        return status;
    };

    const canSubmit =
        isPointChanged &&
        selectedTags.length > 0 &&
        !(selectedTags.includes('Khác') && selectedTags.length === 1 && !customReason.trim());

    const handleConfirm = async () => {
        if (!product || !canSubmit || submitting) return;
        const reasons = selectedTags.filter((t) => t !== 'Khác');
        if (selectedTags.includes('Khác') && customReason.trim()) {
            reasons.push(customReason.trim());
        }
        await onConfirm(product.productId, point, reasons.join('; '));
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose}></div>

            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100 relative'>
                    <h2 className='text-2xl font-bold text-gray-800'>Chi tiết sản phẩm</h2>
                    <span
                        className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-transparent text-primary-700'
                        style={{ minWidth: 140 }}
                    >
                        Trạng thái: {normalizeStatus(product?.status || '')}
                    </span>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {loading || !product ? (
                    <div className='flex-1 flex items-center justify-center p-8'>
                        <div className='flex items-center gap-3 text-gray-600'>
                            <Loader2 className='animate-spin' size={20} />
                            <span>Đang tải thông tin sản phẩm...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='flex flex-col md:flex-row flex-1 overflow-hidden'>
                            <div className='md:w-1/3 bg-gray-50 flex flex-col items-center p-6 border-r border-primary-100 overflow-y-auto'>
                                <div className='relative w-full flex flex-col items-center gap-4'>
                                    <img
                                        src={product.productImages?.[selectedImg] || '/placeholder.png'}
                                        alt='Ảnh sản phẩm'
                                        className='w-full max-w-[180px] h-40 object-contain rounded-xl border border-primary-200 bg-white cursor-zoom-in shadow-sm'
                                        onClick={() => setZoomImg(product.productImages?.[selectedImg] || null)}
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

                            <div className='md:w-2/3 p-6 space-y-5 overflow-y-auto'>
                                <SummaryCard
                                    label={
                                        <span className='flex items-center gap-2'>
                                            <Package className='w-4 h-4 text-primary-500' />
                                            Thông tin sản phẩm
                                        </span>
                                    }
                                    singleRow={false}
                                    items={[
                                        {
                                            icon: <Package className='w-4 h-4 text-primary-500' />,
                                            label: 'Thương hiệu',
                                            value: product.brandName || 'Không rõ'
                                        },
                                        {
                                            icon: <Package className='w-4 h-4 text-primary-500' />,
                                            label: 'Danh mục',
                                            value: product.categoryName || 'Không rõ'
                                        },
                                        {
                                            icon: <Package className='w-4 h-4 text-primary-500' />,
                                            label: 'Mã QR',
                                            value: product.qrCode || '-'
                                        },
                                        {
                                            icon: <Package className='w-4 h-4 text-primary-500' />,
                                            label: 'Kích thước',
                                            value: product.sizeTierName || '-'
                                        },
                                        {
                                            icon: <FileText className='w-4 h-4 text-primary-500' />,
                                            label: 'Mô tả',
                                            value: product.description || '-'
                                        },
                                        {
                                            icon: <Package className='w-4 h-4 text-primary-500' />,
                                            label: 'Điểm',
                                            value: (
                                                <CustomNumberInput
                                                    value={point}
                                                    onChange={setPoint}
                                                    min={0}
                                                    className='w-24 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                                />
                                            )
                                        },
                                        product.changedPointMessage
                                            ? {
                                                  icon: <FileText className='w-4 h-4 text-primary-500' />,
                                                  label: 'Ghi chú điểm',
                                                  value: product.changedPointMessage,
                                                  colSpan: 2
                                              }
                                            : undefined
                                    ].filter(Boolean) as SummaryCardItem[]}
                                />

                                {product.sender && (
                                    <UserInfo
                                        user={product.sender}
                                        label={
                                            <span className='flex items-center gap-2'>
                                                <UserCheck className='text-primary-500' size={18} />
                                                Người gửi
                                            </span>
                                        }
                                    />
                                )}

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
                                                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-primary-100 border-primary-500 text-primary-700'
                                                                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'
                                                        }`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedTags(selectedTags.filter((t) => t !== tag));
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
                                                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-primary-100 border-primary-500 text-primary-700'
                                                                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'
                                                        }`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedTags(selectedTags.filter((t) => t !== tag));
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

                        {isPointChanged && (
                            <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!canSubmit || submitting}
                                    className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2'
                                >
                                    {submitting ? <Loader2 className='animate-spin' size={16} /> : null}
                                    Xác nhận
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {zoomImg && (
                <div
                    className='fixed inset-0 bg-black/70 flex items-center justify-center z-999'
                    onClick={() => setZoomImg(null)}
                >
                    <img
                        src={zoomImg}
                        alt='Ảnh phóng to sản phẩm'
                        className='max-w-[90vw] max-h-[90vh] shadow-2xl rounded-xl object-contain border-4 border-white'
                    />
                </div>
            )}
        </div>
    );
};

const DashboardProductDetailModal: React.FC<DashboardProductDetailModalProps> = ({
    open,
    product,
    loading,
    submitting,
    onClose,
    onConfirm
}) => {
    if (!open) return null;

    return (
        <DashboardProductDetailModalContent
            key={product?.productId ?? 'loading'}
            product={product}
            loading={loading}
            submitting={submitting}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
};

export default DashboardProductDetailModal;
