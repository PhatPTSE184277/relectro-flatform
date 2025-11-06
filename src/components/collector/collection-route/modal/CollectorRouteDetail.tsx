/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { formatTime } from '@/utils/FormatTime';

interface CollectorRouteDetailProps {
    route: any;
    onClose: () => void;
}

const CollectorRouteDetail: React.FC<CollectorRouteDetailProps> = ({ route, onClose }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    function normalizeStatus(status: string = "") {
        const s = status.trim().toLowerCase();
        if (s === "hoàn thành" || s === "đã hoàn thành" || s === "completed") return "Hoàn thành";
        if (s === "đang tiến hành" || s === "đang thu gom" || s === "collecting" || s === "in progress") return "Đang tiến hành";
        if (s === "chưa bắt đầu" || s === "not started") return "Chưa bắt đầu";
        if (s === "hủy bỏ" || s === "cancelled" || s === "canceled") return "Hủy bỏ";
        return status;
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            {route.itemName}
                        </h2>
                        <span
                            className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
                                ${
                                    normalizeStatus(route.status) === "Hoàn thành"
                                        ? 'bg-green-100 text-green-700'
                                        : normalizeStatus(route.status) === "Đang tiến hành"
                                        ? 'bg-blue-100 text-blue-700'
                                        : normalizeStatus(route.status) === "Hủy bỏ"
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                        >
                            {normalizeStatus(route.status)}
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
                                src={route.pickUpItemImages?.[selectedImg] || '/placeholder.png'}
                                alt='Ảnh chính'
                                className='w-full max-w-xs h-72 object-contain rounded-xl border border-gray-200 bg-white cursor-zoom-in shadow-sm'
                                onClick={() => setZoomImg(route.pickUpItemImages?.[selectedImg])}
                            />
                            <div className='flex gap-2 flex-wrap justify-center'>
                                {(route.pickUpItemImages ?? []).map(
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
                        {/* --- Route info --- */}
                        <section className='space-y-3'>
                            <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                Thông tin thu gom
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>Biển số xe:</p>
                                <p className='text-gray-600'>{route.licensePlate || 'Không có thông tin'}</p>
                            </div>
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>Thời gian dự kiến:</p>
                                <p className='text-gray-600'>{formatTime(route.estimatedTime) || 'Không có thông tin'}</p>
                            </div>
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>Ngày thu gom:</p>
                                <p className='text-gray-600'>
                                    {route.collectionDate
                                        ? new Date(route.collectionDate).toLocaleDateString('vi-VN', {
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric'
                                          })
                                        : 'Không có thông tin'}
                                </p>
                            </div>
                        </section>

                        {/* --- Sender info --- */}
                        <section className='space-y-3'>
                            <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                Thông tin người gửi
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-3'>
                                <img
                                    src={route.sender?.avatar || '/avatar-default.png'}
                                    alt='avatar'
                                    className='w-10 h-10 rounded-full object-cover'
                                />
                                <div>
                                    <p className='font-medium text-gray-800'>
                                        {route.sender?.name}
                                    </p>
                                    <p className='text-gray-500 text-xs'>
                                        {route.sender?.email}
                                    </p>
                                    <p className='text-gray-500 text-xs'>
                                        {route.sender?.phone}
                                    </p>
                                </div>
                            </div>
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='font-medium text-gray-700'>Địa chỉ:</p>
                                <p className='text-gray-600'>{route.sender?.address || route.address}</p>
                            </div>
                        </section>

                        {/* --- Collector info --- */}
                        <section className='space-y-3'>
                            <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                Thông tin người thu gom
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-3'>
                                <img
                                    src={route.collector?.avatar || '/avatar-default.png'}
                                    alt='avatar'
                                    className='w-10 h-10 rounded-full object-cover'
                                />
                                <div>
                                    <p className='font-medium text-gray-800'>
                                        {route.collector?.name}
                                    </p>
                                    <p className='text-gray-500 text-xs'>
                                        {route.collector?.email}
                                    </p>
                                    <p className='text-gray-500 text-xs'>
                                        {route.collector?.phone}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* --- Confirm images --- */}
                        {Array.isArray(route.confirmImages) && route.confirmImages.length > 0 && (
                            <section className='space-y-3'>
                                <h3 className='font-semibold text-gray-900 text-lg border-b pb-2'>
                                    Ảnh xác nhận thu gom
                                </h3>
                                <div className='flex gap-2 flex-wrap'>
                                    {route.confirmImages.map((img: string, idx: number) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Xác nhận ${idx + 1}`}
                                            className='w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition'
                                            onClick={() => setZoomImg(img)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Zoom image modal */}
                {zoomImg && (
                    <div
                        className='fixed inset-0 z-999 flex items-center justify-center bg-black/70'
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
        </div>
    );
};

export default CollectorRouteDetail;