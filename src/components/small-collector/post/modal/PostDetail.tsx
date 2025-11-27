/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
// import { PostStatus } from '@/enums/PostStatus';
import PostApprove from './PostApprove';
import PostReject from './PostReject';
import { formatTimeTo24h } from '@/utils/FormatTime';
import { formatDate } from '@/utils/FormateDate';
import {
    Package,
    Calendar,
    MapPin,
    Star,
    User,
    Clock,
    Info,
    List,
    Tag,
    CheckCircle
} from 'lucide-react';

interface PostDetailProps {
    post: any;
    onClose: () => void;
    onApprove: (postId: string) => void;
    onReject: (postId: string, reason: string) => void;
}

// Normalize status for display and badge
function normalizeStatus(status: string = ''): string {
    const s = status.trim().toLowerCase();
    if (s.includes('duyệt') || s === 'approved') return 'Đã duyệt';
    if (s.includes('từ chối') || s === 'rejected') return 'Đã từ chối';
    if (s.includes('chờ') || s === 'pending' || s === '') return 'Chờ duyệt';
    return status;
}

// Badge color logic (match ProductDetail/CollectorRouteDetail)
function getStatusBadgeClass(status: string) {
    const s = normalizeStatus(status);
    const badge: Record<string, string> = {
        'Chờ duyệt': 'bg-yellow-100 text-yellow-700',
        'Đã duyệt': 'bg-green-100 text-green-700',
        'Đã từ chối': 'bg-red-100 text-red-700',
        'Hoàn thành': 'bg-green-100 text-green-700',
        'Đang tiến hành': 'bg-blue-100 text-blue-700',
        'Chưa bắt đầu': 'bg-yellow-100 text-yellow-700',
        'Hủy bỏ': 'bg-red-100 text-red-700'
    };
    return badge[s] || 'bg-gray-100 text-gray-600';
}

const PostDetail: React.FC<PostDetailProps> = ({
    post,
    onClose,
    onApprove,
    onReject
}) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const handleApproveConfirm = () => {
        onApprove(post.id);
        setIsApproveModalOpen(false);
        onClose();
    };

    const handleRejectConfirm = (reason: string) => {
        onReject(post.id, reason);
        setIsRejectModalOpen(false);
        onClose();
    };

    const isPending = normalizeStatus(post.status) === 'Chờ duyệt';

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
                <div className='flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Chi tiết bài đăng
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Thông tin chi tiết về bài đăng sản phẩm
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

                {/* Body */}
                <div className='flex flex-col md:flex-row flex-1 overflow-hidden'>
                    {/* LEFT - IMAGES + STATUS BADGE */}
                    <div className='md:w-1/3 bg-gray-50 flex flex-col items-center p-6 border-r overflow-y-auto'>
                        <div className='relative w-full flex flex-col items-center gap-4'>
                            {/* Status Badge - left, above image */}
                            <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusBadgeClass(post.status)}`}
                                style={{marginLeft: 0}}
                            >
                                {normalizeStatus(post.status)}
                            </span>
                            <img
                                src={
                                    post.imageUrls?.[selectedImg] ||
                                    '/placeholder.png'
                                }
                                alt='Ảnh sản phẩm'
                                className='w-full max-w-xs h-72 object-contain rounded-xl border border-gray-200 bg-white cursor-zoom-in shadow-sm'
                                onClick={() =>
                                    setZoomImg(post.imageUrls?.[selectedImg])
                                }
                            />
                            <div className='flex gap-2 flex-wrap justify-center'>
                                {(post.imageUrls ?? []).map(
                                    (img: string, idx: number) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Ảnh ${idx + 1}`}
                                            className={`w-14 h-14 object-cover rounded-lg border cursor-pointer transition-all ${
                                                selectedImg === idx
                                                    ? 'border-blue-500 ring-2 ring-blue-300 scale-105'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                            onClick={() => setSelectedImg(idx)}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - INFO */}
                    <div className='md:w-2/3 p-6 space-y-5 overflow-y-auto'>
                        {/* Status Badge removed from right info section */}

                        {/* AI Labels */}
                        {Array.isArray(post.aggregatedAiLabels) &&
                            post.aggregatedAiLabels.length > 0 && (
                                <div className='p-4 bg-blue-50 rounded-lg border border-blue-100'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <Tag
                                            className='text-blue-600'
                                            size={18}
                                        />
                                        <p className='text-sm font-semibold text-blue-900'>
                                            Nhãn AI nhận diện
                                        </p>
                                    </div>
                                    <div className='flex gap-2 flex-wrap'>
                                        {post.aggregatedAiLabels.map(
                                            (label: any, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className='inline-flex items-center px-3 py-1 rounded-full bg-white text-blue-700 text-sm font-medium border border-blue-200'
                                                >
                                                    {label.tag}{' '}
                                                    <span className='ml-1 text-xs text-blue-500'>
                                                        {label.confidence}%
                                                    </span>
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Product Info Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <InfoCard
                                icon={
                                    <List className='text-blue-600' size={20} />
                                }
                                label='Danh mục chính'
                                value={post.parentCategory}
                            />
                            <InfoCard
                                icon={
                                    <List
                                        className='text-purple-600'
                                        size={20}
                                    />
                                }
                                label='Danh mục phụ'
                                value={post.subCategory}
                            />
                            <InfoCard
                                icon={
                                    <Star
                                        className='text-yellow-500'
                                        size={20}
                                    />
                                }
                                label='Điểm ước tính'
                                value={post.estimatePoint || 0}
                            />
                            <InfoCard
                                icon={
                                    <Calendar
                                        className='text-green-600'
                                        size={20}
                                    />
                                }
                                label='Ngày đăng'
                                value={formatDate(post.date)}
                            />
                        </div>

                        {/* Product Details */}
                        {post.product && (
                            <Section
                                title='Thông tin sản phẩm'
                                icon={
                                    <Package
                                        className='text-blue-600'
                                        size={18}
                                    />
                                }
                            >
                                <div className='space-y-2 text-sm text-gray-700'>
                                    {post.product.brandName && (
                                        <p>
                                            <b>Thương hiệu:</b>{' '}
                                            {post.product.brandName}
                                        </p>
                                    )}
                                    {post.product.sizeTierName && (
                                        <p>
                                            <b>Kích thước:</b>{' '}
                                            {post.product.sizeTierName}
                                        </p>
                                    )}
                                    {post.product.description && (
                                        <p>
                                            <b>Mô tả:</b>{' '}
                                            {post.product.description}
                                        </p>
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Sender Info */}
                        <Section
                            title='Người đăng'
                            icon={<User className='text-blue-600' size={18} />}
                        >
                            <UserInfo user={post.sender} />
                        </Section>

                        {/* Schedule */}
                        {Array.isArray(post.schedule) &&
                            post.schedule.length > 0 && (
                                <Section
                                    title='Lịch thu gom'
                                    icon={
                                        <Clock
                                            className='text-orange-600'
                                            size={18}
                                        />
                                    }
                                >
                                    <div className='text-sm text-gray-700 space-y-2'>
                                        {post.schedule.map(
                                            (item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className='border-b last:border-b-0 pb-2 last:pb-0'
                                                >
                                                    <p>
                                                        <b>Ngày:</b>{' '}
                                                        {item?.pickUpDate
                                                            ? formatDate(
                                                                  item.pickUpDate
                                                              )
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <p>
                                                        <b>Thời gian:</b>{' '}
                                                        {item?.slots?.startTime
                                                            ? formatTimeTo24h(
                                                                  item.slots
                                                                      .startTime
                                                              )
                                                            : '-'}{' '}
                                                        -{' '}
                                                        {item?.slots?.endTime
                                                            ? formatTimeTo24h(
                                                                  item.slots
                                                                      .endTime
                                                              )
                                                            : '-'}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </Section>
                            )}

                        {/* Address */}
                        {post.address && (
                            <div className='p-4 bg-gray-50 rounded-lg border flex gap-3'>
                                <MapPin
                                    className='text-gray-600 mt-0.5'
                                    size={20}
                                />
                                <div>
                                    <p className='text-sm text-gray-600'>
                                        Địa chỉ
                                    </p>
                                    <p className='text-gray-900 text-sm font-medium'>
                                        {post.address}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Reject Message */}
                        {post.rejectMessage && (
                            <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Info className='text-red-600' size={18} />
                                    <p className='text-sm font-semibold text-red-900'>
                                        Lý do từ chối
                                    </p>
                                </div>
                                <p className='text-sm text-red-700'>
                                    {post.rejectMessage}
                                </p>
                            </div>
                        )}

                        {/* Post Note */}
                        {post.postNote && (
                            <div className='p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Info
                                        className='text-yellow-600'
                                        size={18}
                                    />
                                    <p className='text-sm font-semibold text-yellow-900'>
                                        Ghi chú
                                    </p>
                                </div>
                                <p className='text-sm text-yellow-700'>
                                    {post.postNote}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Actions */}
                {isPending && (
                    <div className='flex justify-end gap-3 p-5 border-t border-gray-100 bg-white'>
                        <button
                            onClick={() => setIsApproveModalOpen(true)}
                            className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm flex items-center gap-2'
                        >
                            <CheckCircle size={18} />
                            Duyệt
                        </button>
                        <button
                            onClick={() => setIsRejectModalOpen(true)}
                            className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm'
                        >
                            Từ chối
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <PostApprove
                open={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApproveConfirm}
            />

            <PostReject
                open={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleRejectConfirm}
            />

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

// InfoCard Component
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

// Section Component
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

// UserInfo Component
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

export default PostDetail;
