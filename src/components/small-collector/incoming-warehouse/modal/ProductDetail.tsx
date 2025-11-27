/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/Product';
import {
    Package,
    Calendar,
    Star,
    UserCheck,
    User,
    Info,
    List,
    Clock,
    MapPin
} from 'lucide-react';
import { formatDate } from '@/utils/FormateDate';

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
                    onClick={onClose}
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
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleIn max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-blue-50 to-purple-50'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết sản phẩm
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Thông tin chi tiết về sản phẩm và lịch sử thu gom
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className='flex flex-col md:flex-row flex-1 overflow-hidden'>
                    {/* LEFT - IMAGE */}
                    <div className='md:w-1/3 p-6 bg-gray-50 flex flex-col items-center border-r overflow-y-auto'>
                        <div className='relative w-full flex flex-col items-center gap-4'>
                            {/* Badge trạng thái trên ảnh lớn - đồng bộ CollectorRouteDetail */}
                            <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusBadgeClass(
                                    product.status
                                )}`}
                            >
                                {product.status}
                            </span>
                            <img
                                src={product.productImages?.[selectedImg]}
                                alt='main'
                                className='w-full max-w-xs h-72 object-contain rounded-xl border border-gray-200 bg-white cursor-zoom-in shadow-sm'
                                onClick={() =>
                                    setZoomImg(
                                        product.productImages?.[selectedImg]
                                    )
                                }
                            />

                            {product.productImages?.length > 1 && (
                                <div className='flex gap-2 flex-wrap justify-center'>
                                    {product.productImages.map(
                                        (img: string, i: number) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Ảnh ${i + 1}`}
                                                className={`w-14 h-14 object-cover rounded-lg border cursor-pointer transition-all ${
                                                    i === selectedImg
                                                        ? 'border-blue-500 ring-2 ring-blue-300 scale-105'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                                onClick={() =>
                                                    setSelectedImg(i)
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT - INFO */}
                    <div className='md:w-2/3 p-6 space-y-5 overflow-y-auto'>
                        {/* Đã di chuyển badge trạng thái sang bên trái trên ảnh lớn */}

                        {/* GRID INFO */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <InfoCard
                                icon={
                                    <List className='text-blue-600' size={20} />
                                }
                                label='Danh mục'
                                value={product.categoryName}
                            />
                            <InfoCard
                                icon={
                                    <Package
                                        className='text-green-600'
                                        size={20}
                                    />
                                }
                                label='Mã QR'
                                value={product.qrCode || 'Chưa có mã'}
                            />
                            <InfoCard
                                icon={
                                    <Star
                                        className='text-yellow-500'
                                        size={20}
                                    />
                                }
                                label='Điểm ước tính'
                                value={product.estimatePoint}
                            />
                        </div>

                        {/* Product Details */}
                        <Section
                            title='Thông tin sản phẩm'
                            icon={
                                <Package className='text-blue-600' size={18} />
                            }
                        >
                            <div className='space-y-2 text-sm text-gray-700'>
                                {product.brandName && (
                                    <p>
                                        <b>Thương hiệu:</b> {product.brandName}
                                    </p>
                                )}
                                {product.sizeTierName && (
                                    <p>
                                        <b>Kích thước:</b>{' '}
                                        {product.sizeTierName}
                                    </p>
                                )}
                                {product.description && (
                                    <p>
                                        <b>Mô tả:</b> {product.description}
                                    </p>
                                )}
                            </div>
                        </Section>

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

                        {/* Sender Info */}
                        <Section
                            title='Người gửi'
                            icon={<User className='text-blue-600' size={18} />}
                        >
                            <UserInfo user={product.sender} />
                        </Section>

                        {/* Collector Info */}
                        {product.collector && (
                            <Section
                                title='Nhân viên thu gom'
                                icon={
                                    <UserCheck
                                        className='text-green-600'
                                        size={18}
                                    />
                                }
                            >
                                <UserInfo user={product.collector} />
                            </Section>
                        )}

                        {/* Pickup schedule */}
                        {Array.isArray(product.schedule) &&
                            product.schedule.length > 0 && (
                                <Section
                                    title='Lịch thu gom'
                                    icon={
                                        <Clock
                                            className='text-orange-600'
                                            size={18}
                                        />
                                    }
                                >
                                    <div className='space-y-2 text-sm text-gray-700'>
                                        <div className='flex justify-between'>
                                            <span className='font-medium'>
                                                Ngày:
                                            </span>
                                            <span>
                                                {formatDate(
                                                    product.schedule?.[0]
                                                        ?.pickUpDate
                                                ) || 'Không có thông tin'}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-medium'>
                                                Khung giờ:
                                            </span>
                                            <span>
                                                {product.schedule?.[0]?.slots
                                                    ?.startTime || '-'}{' '}
                                                -{' '}
                                                {product.schedule?.[0]?.slots
                                                    ?.endTime || '-'}
                                            </span>
                                        </div>
                                        <div className='pt-2 border-t'>
                                            <div className='flex items-start gap-2'>
                                                <MapPin
                                                    size={16}
                                                    className='text-gray-600 mt-0.5'
                                                />
                                                <span className='flex-1'>
                                                    {product.address}
                                                </span>
                                            </div>
                                        </div>
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

// InfoCard Props
interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
    <div className='p-4 bg-gray-50 rounded-lg border flex gap-3'>
        {icon}
        <div>
            <p className='text-sm text-gray-600'>{label}</p>
            <p className='text-gray-900 text-sm font-medium'>{value}</p>
        </div>
    </div>
);

// Section Props
interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
    <div className='pt-4 border-t'>
        <div className='flex items-center gap-2 mb-2 text-gray-800 font-semibold'>
            {icon} <span>{title}</span>
        </div>
        <div className='p-4 bg-gray-50 rounded-lg border'>{children}</div>
    </div>
);

// UserInfo Props
interface UserInfoProps {
    user?: {
        name?: string;
        phone?: string;
        email?: string;
        address?: string;
        avatar?: string;
        [key: string]: any;
    };
}
const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    // Kiểm tra xem user có dữ liệu hợp lệ không
    const hasValidData =
        user && (user.name || user.phone || user.email || user.avatar);

    if (!hasValidData) {
        return (
            <p className='text-sm text-gray-500'>
                Thông tin người dùng không khả dụng.
            </p>
        );
    }

    return (
        <div className='flex gap-3 items-start'>
            {user.avatar && (
                <img
                    src={user.avatar}
                    className='w-14 h-14 rounded-xl object-cover'
                    alt='Avatar người dùng'
                />
            )}
            <div className='text-sm text-gray-700'>
                <p>
                    <b>{user.name || 'Không có tên'}</b>
                </p>
                <p>{user.phone || 'Không có số điện thoại'}</p>
                <p>{user.email || 'Không có email'}</p>
                {user.address && (
                    <p className='mt-1 text-gray-600'>{user.address}</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
