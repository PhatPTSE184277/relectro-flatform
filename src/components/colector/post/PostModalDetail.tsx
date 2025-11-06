/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { PostStatus } from '@/enums/PostStatus';
import PostApproveModal from './PostApproveModal';
import PostRejectModal from './PostRejectModal';

interface PostModalDetailProps {
    post: any;
    onClose: () => void;
    onApprove: (postId: string) => void;
    onReject: (postId: string, reason: string) => void;
}

// Chuẩn hóa status về enum
function normalizeStatus(status: string = ""): PostStatus {
    const s = status.trim().toLowerCase();
    if (s === "đã duyệt" || s === "approved") return PostStatus.Approved;
    if (s === "đã từ chối" || s === "rejected") return PostStatus.Rejected;
    if (s === "chờ duyệt" || s === "pending" || s === "") return PostStatus.Pending;
    return PostStatus.Pending;
}

const PostModalDetail: React.FC<PostModalDetailProps> = ({
    post,
    onClose,
    onApprove,
    onReject
}) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    // Modal xác nhận duyệt
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    // Modal từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Xác nhận duyệt
    const handleApproveConfirm = () => {
        onApprove(post.id);
        setIsApproveModalOpen(false);
         onClose();
    };

    // Xác nhận từ chối
    const handleRejectConfirm = (reason: string) => {
        onReject(post.id, reason);
        setIsRejectModalOpen(false);
         onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            {post.name}
                        </h2>
                        <span
                            className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
                                ${
                                    normalizeStatus(post.status) === PostStatus.Approved
                                        ? 'bg-green-100 text-green-700'
                                        : normalizeStatus(post.status) === PostStatus.Rejected
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                        >
                            {normalizeStatus(post.status)}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex flex-col md:flex-row flex-1 overflow-hidden'>
                    {/* Left: Image section */}
                    <div className='md:w-1/3 bg-gray-50 flex flex-col items-center p-6 border-r border-gray-100 overflow-y-auto'>
                        <div className='relative w-full flex flex-col items-center gap-4'>
                            <img
                                src={post.imageUrls?.[selectedImg]}
                                alt='Ảnh chính'
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
                                            className={`w-14 h-14 object-cover rounded-lg border cursor-pointer transition-all duration-150 ${
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

                    {/* Right: Details section */}
                    <div className='md:w-2/3 p-6 space-y-4 overflow-y-auto max-h-[85vh]'>
                        {/* --- Product info --- */}
                        <section className='space-y-3'>
                            <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                Thông tin sản phẩm
                            </h3>

                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>
                                    Danh mục:
                                </p>
                                <p className='text-gray-600'>
                                    {post.parentCategory}
                                    {post.subCategory &&
                                        ` - ${post.subCategory}`}
                                </p>
                            </div>

                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>
                                    Mô tả:
                                </p>
                                <p className='text-gray-600'>
                                    {post.product?.description ||
                                        'Không có thông tin'}
                                </p>
                            </div>

                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>
                                    Kết quả kiểm tra:
                                </p>
                                <p className='text-gray-600'>
                                    {post.checkMessage || 'Không có thông tin'}
                                </p>
                                {post.rejectMessage && (
                                    <p className='text-red-500 mt-1'>
                                        Lý do từ chối: {post.rejectMessage}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* --- Sender info --- */}
                        <section className='space-y-3'>
                            <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                Thông tin người đăng
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-3'>
                                <img
                                    src={
                                        post.sender?.avatar ||
                                        '/avatar-default.png'
                                    }
                                    alt='avatar'
                                    className='w-10 h-10 rounded-full object-cover'
                                />
                                <div>
                                    <p className='font-medium text-gray-800'>
                                        {post.sender?.name}
                                    </p>
                                    <p className='text-gray-500 text-xs'>
                                        {post.sender?.email}
                                    </p>
                                </div>
                            </div>

                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>
                                    Địa chỉ:
                                </p>
                                <p className='text-gray-600'>{post.address}</p>
                            </div>
                        </section>

                        {/* --- Schedule --- */}
                        <section className='space-y-3'>
                            <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                Thời gian có thể lấy hàng
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-4 text-gray-600 space-y-2'>
                                {Array.isArray(post.schedule) &&
                                post.schedule.length > 0
                                    ? post.schedule.map(
                                          (sch: any, idx: number) => {
                                              const pickUpDate = sch.pickUpDate
                                                  ? new Date(
                                                        sch.pickUpDate
                                                    ).toLocaleDateString(
                                                        'vi-VN',
                                                        {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }
                                                    )
                                                  : '';
                                              let slotStr = '';
                                              if (Array.isArray(sch.slots)) {
                                                  slotStr = sch.slots
                                                      .map(
                                                          (slot: any) =>
                                                              `${slot.startTime} - ${slot.endTime}`
                                                      )
                                                      .join(', ');
                                              } else if (sch.slots) {
                                                  slotStr = `${sch.slots.startTime} - ${sch.slots.endTime}`;
                                              } else {
                                                  slotStr =
                                                      'Không có thông tin';
                                              }

                                              return (
                                                  <div
                                                      key={idx}
                                                      className='text-sm'
                                                  >
                                                      <span className='font-semibold'>
                                                          {sch.dayName}
                                                      </span>
                                                      {pickUpDate && (
                                                          <>
                                                              ,{' '}
                                                              <span className='text-blue-600'>
                                                                  {pickUpDate}
                                                              </span>
                                                          </>
                                                      )}
                                                      {slotStr && (
                                                          <>
                                                              :{' '}
                                                              <span className='text-purple-700'>
                                                                  {slotStr}
                                                              </span>
                                                          </>
                                                      )}
                                                  </div>
                                              );
                                          }
                                      )
                                    : 'Không có thông tin'}
                            </div>
                        </section>

                        {/* --- Notes --- */}
                        {post.postNote && (
                            <section className='space-y-3'>
                                <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                    Ghi chú
                                </h3>
                                <div className='bg-gray-50 rounded-lg p-4 text-gray-600'>
                                    {post.postNote}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {normalizeStatus(post.status) === PostStatus.Pending && (
                    <div className='flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50'>
                        <button
                            onClick={() => setIsApproveModalOpen(true)}
                            className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer'
                        >
                            Duyệt
                        </button>
                        <button
                            onClick={() => setIsRejectModalOpen(true)}
                            className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer'
                        >
                            Từ chối
                        </button>
                    </div>
                )}
            </div>

            <PostApproveModal
                open={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApproveConfirm}
            />

            <PostRejectModal
                open={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleRejectConfirm}
            />

            {zoomImg && (
                <div
                    className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70'
                    onClick={() => setZoomImg(null)}
                >
                    <img
                        src={zoomImg}
                        alt='Zoom'
                        className='max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white object-contain'
                    />
                </div>
            )}
        </div>
    );
};

export default PostModalDetail;