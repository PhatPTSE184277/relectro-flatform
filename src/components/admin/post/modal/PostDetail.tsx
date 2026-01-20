/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import PostApprove from './PostApprove';
import { formatDate } from '@/utils/FormatDate';
import { groupScheduleByTimeRange } from '@/utils/groupScheduleByTimeRange';
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
import SummaryCard from '@/components/ui/SummaryCard';
import UserInfo from '@/components/ui/UserInfo';

interface PostDetailProps {
    post: any;
    onClose: () => void;
    onApprove: (postId: string) => void;
    onReject: (postId: string, reason: string) => void;
}

// Normalize status for display and badge
function normalizeStatus(status: string = ''): string {
    const s = status.trim().toLowerCase();
    if (s.includes('chờ') || s === 'pending' || s === 'chờ duyệt') return 'Chờ duyệt';
    if (s.includes('từ chối') || s === 'rejected' || s === 'đã từ chối') return 'Đã từ chối';
    if (s.includes('duyệt') && !s.includes('chờ') && !s.includes('từ chối') || s === 'approved' || s === 'đã duyệt') return 'Đã duyệt';
    if (s === '') return 'Chờ duyệt';
    return status;
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
    const [showRejectForm, setShowRejectForm] = useState(false);
    
    const REASON_TAGS = [
        "Ảnh sản phẩm không rõ ràng",
        "Mô tả thiếu thông tin liên hệ",
        "Nội dung không phù hợp quy định",
        "Khác"
    ];
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState("");

    const handleApproveConfirm = () => {
        onApprove(post.id);
        setIsApproveModalOpen(false);
        onClose();
    };

    const handleRejectConfirm = () => {
        const reasons = selectedTags.filter(t => t !== "Khác");
        if (selectedTags.includes("Khác")) {
            if (customReason.trim()) reasons.push(customReason.trim());
        }
        onReject(post.id, reasons.join("; "));
        setShowRejectForm(false);
        setSelectedTags([]);
        setCustomReason("");
        onClose();
    };

    const isPending = normalizeStatus(post.status) === 'Chờ duyệt';

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/60 backdrop-blur-sm'
            ></div>

            {/* Modal */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-y-auto z-10 animate-scaleIn max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Chi tiết bài đăng
                        </h2>
                    </div>
                    <div className='flex items-center gap-4'>
                        {/* Status Badge - moved to header */}
                        <span
                            className="flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-primary-600 text-white"
                            style={{ minWidth: 110 }}
                        >
                            {normalizeStatus(post.status)}
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

                {/* Body */}
                <div className='flex flex-col md:flex-row flex-1 overflow-y-auto'>
                    {/* LEFT - IMAGES + STATUS BADGE */}
                    <div className='md:w-1/3 bg-white flex flex-col items-center p-6 border-r border-primary-100 overflow-y-auto'>
                        <div className='relative w-full flex flex-col items-center gap-4'>
                            <img
                                src={
                                    post.imageUrls?.[selectedImg] ||
                                    '/placeholder.png'
                                }
                                alt='Ảnh sản phẩm'
                                className='w-full max-w-[180px] h-40 object-contain rounded-xl border border-primary-200 bg-white cursor-zoom-in shadow-sm'
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
                                                    ? 'border-primary-500 ring-2 ring-primary-200 scale-105'
                                                    : 'border-primary-100 hover:border-primary-200'
                                            }`}
                                            onClick={() => setSelectedImg(idx)}
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        {/* AI Labels - moved to left */}
                        {Array.isArray(post.aggregatedAiLabels) &&
                            post.aggregatedAiLabels.length > 0 && (
                                <div className='p-4 bg-primary-50 rounded-lg border border-primary-100 w-full mt-4'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                            <Tag className='text-primary-500' size={18} />
                                        </span>
                                        <p className='text-sm font-semibold text-primary-900'>
                                            Nhãn AI nhận diện
                                        </p>
                                    </div>
                                    <div className='flex gap-2 flex-wrap'>
                                        {post.aggregatedAiLabels.map(
                                            (label: any, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className='inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-sm font-medium border border-primary-200'
                                                >
                                                    {label.tag}{' '}
                                                    <span className='ml-1 text-xs text-primary-500'>
                                                        {label.confidence}%
                                                    </span>
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        
                    </div>

                    {/* RIGHT - INFO */}
                    <div className='md:w-2/3 p-6 pt-6 space-y-2 overflow-y-visible max-h-full'>
                        {/* Product Details */}

                        {post.product && (
                            <>
                                <SummaryCard
                                    label={
                                        <span className="flex items-center gap-2">
                                            <List className="w-4 h-4 text-primary-500" />
                                            Thông tin bài đăng
                                        </span>
                                    }
                                    singleRow={false}
                                    items={[
                                        {
                                            icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><List className="w-4 h-4 text-primary-500" /></span>,
                                            label: 'Danh mục chính',
                                            value: post.parentCategory || ''
                                        },
                                        {
                                            icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><List className="w-4 h-4 text-primary-500" /></span>,
                                            label: 'Danh mục phụ',
                                            value: post.subCategory || ''
                                        },
                                        post.product.brandName && {
                                            icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><User className="w-4 h-4 text-primary-500" /></span>,
                                            label: 'Thương hiệu',
                                            value: post.product.brandName
                                        },
                                        post.product.description && {
                                            icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Info className="w-4 h-4 text-primary-500" /></span>,
                                            label: 'Mô tả',
                                            value: post.product.description
                                        },
                                        post.product.sizeTierName && {
                                            icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Package className="w-4 h-4 text-primary-500" /></span>,
                                            label: 'Kích thước',
                                            value: post.product.sizeTierName
                                        }
                                    ].filter(Boolean)}
                                />
                            </>
                        )}

                        {/* Product Info SummaryCard */}
                        <SummaryCard
                            singleRow={false}
                            items={[
                                {
                                    icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Star className="w-4 h-4 text-primary-500" /></span>,
                                    label: 'Điểm ước tính',
                                    value: post.estimatePoint != null ? post.estimatePoint : ''
                                },
                                {
                                    icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Calendar className="w-4 h-4 text-primary-500" /></span>,
                                    label: 'Ngày đăng',
                                    value: post.date ? formatDate(post.date) : ''
                                },
                                ...(Array.isArray(post.schedule) && post.schedule.length > 0
                                    ? [{
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Clock className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Lịch thu gom',
                                        value: groupScheduleByTimeRange(post.schedule)
                                            .map(({ dateStr, range }) => `${range} | ${dateStr}`)
                                            .join(', '),
                                        colSpan: 2
                                    }]
                                    : []),
                                ...(post.address
                                    ? [{
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><MapPin className="w-4 h-4 text-primary-500" /></span>,
                                        label: 'Địa chỉ',
                                        value: <span className="block w-full wrap-break-word">{post.address}</span>,
                                        colSpan: 2
                                    }]
                                    : []),
                                ...(post.postNote
                                    ? [{
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-50 border border-yellow-200"><Info className="w-4 h-4 text-yellow-500" /></span>,
                                        label: 'Ghi chú',
                                        value: <span className="block w-full wrap-break-word text-yellow-700">{post.postNote}</span>,
                                        colSpan: 2
                                    }]
                                    : []),
                                ...(post.rejectMessage
                                    ? [{
                                        icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 border border-red-200"><Info className="w-4 h-4 text-red-500" /></span>,
                                        label: 'Lý do từ chối',
                                        value: <span className="block w-full wrap-break-word text-red-700">{post.rejectMessage}</span>,
                                        colSpan: 2
                                    }]
                                    : [])
                            ]}
                        />

                        {/* Sender Info */}
                        <div className='mt-2 mb-2'>
                            <UserInfo user={post.sender} />
                        </div>

                        {/* Reject Message & Post Note moved to SummaryCard */}

                        {/* Approve/Reject Buttons under AI Labels */}
                        {isPending && (
                            <>
                                {!showRejectForm ? (
                                    <div className='flex justify-end mt-2'>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => setShowRejectForm(true)}
                                                className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm order-1'
                                            >
                                                Từ chối
                                            </button>
                                            <button
                                                onClick={() => setIsApproveModalOpen(true)}
                                                className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm flex items-center gap-2 order-2'
                                            >
                                                <CheckCircle size={18} />
                                                Duyệt
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='mt-4 bg-red-50 rounded-xl p-4 border border-red-200'>
                                        <h3 className='text-base font-semibold text-gray-900 mb-3'>Từ chối bài đăng</h3>
                                        <div className='space-y-2'>
                                            <label className='block text-sm font-medium text-gray-700'>
                                                Lý do từ chối <span className='text-red-500'>*</span>
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
                                                <textarea
                                                    className='w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition-all duration-200 bg-white'
                                                    rows={3}
                                                    value={customReason}
                                                    onChange={(e) => setCustomReason(e.target.value)}
                                                    placeholder='Nhập lý do từ chối bài đăng...'
                                                />
                                            )}
                                        </div>
                                        <div className='flex justify-end gap-2 mt-3'>
                                            <button
                                                onClick={() => {
                                                    setShowRejectForm(false);
                                                    setSelectedTags([]);
                                                    setCustomReason('');
                                                }}
                                                className='px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition cursor-pointer text-sm'
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                disabled={selectedTags.length === 0 || (selectedTags.includes('Khác') && !customReason.trim())}
                                                onClick={handleRejectConfirm}
                                                className={`px-4 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 text-sm
                                                    ${selectedTags.length === 0 || (selectedTags.includes('Khác') && !customReason.trim())
                                                        ? 'bg-red-300 cursor-not-allowed'
                                                        : 'bg-red-500 hover:bg-red-600'}
                                                `}
                                            >
                                                Xác nhận từ chối
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>


            </div>

            {/* Modals */}
            <PostApprove
                open={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApproveConfirm}
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

export default PostDetail;
