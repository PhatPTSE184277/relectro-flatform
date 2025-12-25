'use client';

import React, { useEffect } from 'react';
import { X, MapPin, Clock, CheckCircle, Package } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import SummaryCard from '@/components/ui/SummaryCard';

interface TrackingModalProps {
    product: any;
    onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ product, onClose }) => {
    const { timeline, fetchTimeline } = useTrackingContext();

    useEffect(() => {
        if (product?.productId) {
            fetchTimeline(product.productId);
        }
    }, [product?.productId, fetchTimeline]);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            Theo dõi sản phẩm
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Xem lịch sử và trạng thái di chuyển của sản phẩm
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Product Info with SummaryCard */}
                    <SummaryCard
                        items={[
                            {
                                icon: <Package size={14} className='text-primary-400' />,
                                label: 'Danh mục',
                                value: product.categoryName || 'N/A',
                            },
                            {
                                icon: <Package size={14} className='text-primary-400' />,
                                label: 'Thương hiệu',
                                value: product.brandName || 'N/A',
                            },
                            {
                                icon: <MapPin size={14} className='text-primary-400' />,
                                label: 'Người gửi',
                                value: product.sender?.name || 'N/A',
                            },
                            {
                                icon: <Clock size={14} className='text-primary-400' />,
                                label: 'Trạng thái',
                                value: (
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                        product.status === 'Đã thu gom'
                                            ? 'bg-green-100 text-green-700'
                                            : product.status === 'Đang vận chuyển'
                                            ? 'bg-blue-100 text-blue-700'
                                            : product.status === 'Chờ thu gom'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : product.status === 'Hủy bỏ'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {product.status}
                                    </span>
                                ),
                            },
                        ]}
                        singleRow={true}
                    />

                    {/* Timeline */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <Clock className='text-primary-600' size={20} />
                            Lịch sử di chuyển
                        </h3>

                        {timeline.length === 0 ? (
                            <div className='text-center py-12 text-gray-500'>
                                Chưa có lịch sử di chuyển
                            </div>
                        ) : (
                            <div className='relative py-8'>
                                {/* Timeline with vertical connector */}
                                <div className='space-y-'>
                                    {timeline.map((item, index) => {
                                        const isLeft = index % 2 === 0;
                                        return (
                                            <div key={index} className='relative flex'>
                                                {/* Rope/curved connector between dots */}
                                                {index < timeline.length - 1 && (
                                                    <svg
                                                        className='absolute z-0 pointer-events-none'
                                                        style={{
                                                            top: '2.5rem', // below the dot
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            height: '5.5rem',
                                                            width: '60px',
                                                        }}
                                                        width='60'
                                                        height='88'
                                                        viewBox='0 0 60 88'
                                                        fill='none'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                    >
                                                        <path
                                                            d={isLeft
                                                                ? 'M30 0 Q60 44 30 88'
                                                                : 'M30 0 Q0 44 30 88'}
                                                            stroke='#cbd5e1'
                                                            strokeWidth='3'
                                                            fill='none'
                                                            strokeDasharray='6,6'
                                                        />
                                                    </svg>
                                                )}

                                                <div className={`flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`} style={{position: 'relative', zIndex: 1}}>
                                                    <div className='w-5/12 relative'>
                                                        {/* Horizontal connector line from dot to card */}
                                                        <div className={`absolute top-6 ${isLeft ? '-right-4' : '-left-4'} ${isLeft ? 'left-full' : 'right-full'} w-4 h-0.5 bg-primary-300 z-0`}></div>
                                                        
                                                        {/* Dot */}
                                                        <div className={`absolute top-3 ${isLeft ? '-right-4' : '-left-4'} w-8 h-8 rounded-full bg-primary-500 border-4 border-white flex items-center justify-center shadow-lg z-10`}>
                                                            <CheckCircle size={14} className='text-white' />
                                                        </div>
                                                        {/* Card */}
                                                        <div className='bg-linear-to-br from-white to-primary-50 rounded-xl p-4 shadow-md border border-primary-100 hover:shadow-lg transition-shadow'>
                                                            <div className='flex flex-col gap-2'>
                                                                <div className='flex justify-between items-center gap-2'>
                                                                    <h4 className='font-semibold text-gray-900 text-sm'>
                                                                        {item.status || item.event || 'Cập nhật trạng thái'}
                                                                    </h4>
                                                                    <span className='text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap'>
                                                                        <Clock size={12} />
                                                                        {item.date && item.time
                                                                            ? `${item.time} - ${item.date}`
                                                                            : item.time && item.date
                                                                            ? `${item.time} - ${item.date}`
                                                                            : item.timestamp || item.time || item.date || 'N/A'}
                                                                    </span>
                                                                </div>
                                                                {item.location && (
                                                                    <p className='text-xs text-gray-600 flex items-center gap-1'>
                                                                        <MapPin size={12} className='text-gray-400' />
                                                                        {item.location}
                                                                    </p>
                                                                )}
                                                                {item.description && (
                                                                    <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
