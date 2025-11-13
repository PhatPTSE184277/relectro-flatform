/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Package, Tag, Calendar, MapPin } from 'lucide-react';

interface ProductDetailProps {
    product: any;
    onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    if (!product) return null;

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || '';
        
        if (normalizedStatus.includes('chờ') || normalizedStatus === 'pending') {
            return (
                <span className='px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700'>
                    Chờ thu gom
                </span>
            );
        }
        if (normalizedStatus.includes('đã thu') || normalizedStatus === 'collected') {
            return (
                <span className='px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700'>
                    Đã thu gom
                </span>
            );
        }
        if (normalizedStatus.includes('hủy') || normalizedStatus === 'cancelled') {
            return (
                <span className='px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700'>
                    Hủy bỏ
                </span>
            );
        }
        if (normalizedStatus.includes('nhập') || normalizedStatus === 'received') {
            return (
                <span className='px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700'>
                    Nhập kho
                </span>
            );
        }
        return (
            <span className='px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700'>
                {status}
            </span>
        );
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Chi tiết sản phẩm</h2>
                        {getStatusBadge(product.status)}
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
                    {/* Left: Images */}
                    <div className='md:w-1/3 bg-gray-50 flex flex-col items-center p-6 border-r border-gray-100 overflow-y-auto'>
                        {product.productImages && product.productImages.length > 0 ? (
                            <>
                                <div className='w-full aspect-square rounded-lg overflow-hidden bg-white shadow-md mb-4'>
                                    <img
                                        src={product.productImages[selectedImg]}
                                        alt={`${product.categoryName} main`}
                                        className='w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform'
                                        onClick={() => setZoomImg(product.productImages[selectedImg])}
                                    />
                                </div>
                                {product.productImages.length > 1 && (
                                    <div className='grid grid-cols-3 gap-2 w-full'>
                                        {product.productImages.map((img: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                                                    selectedImg === idx ? 'border-blue-500' : 'border-gray-200'
                                                }`}
                                                onClick={() => setSelectedImg(idx)}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${product.categoryName} ${idx + 1}`}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='w-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center'>
                                <Package size={64} className='text-gray-300' />
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className='md:w-2/3 p-6 space-y-4 overflow-y-auto max-h-[85vh]'>
                        <div className='flex items-start justify-between'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-900'>{product.categoryName}</h3>
                                <p className='text-gray-500 mt-1'>{product.brandName}</p>
                            </div>
                        </div>

                        {product.description && (
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='text-sm font-medium text-gray-700 mb-1'>Mô tả tình trạng:</p>
                                <p className='text-gray-600'>{product.description}</p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                                <Tag className='text-blue-600 mt-1' size={20} />
                                <div>
                                    <p className='text-sm font-medium text-gray-700'>Mã QR</p>
                                    <p className='text-gray-900 font-mono text-sm mt-1'>
                                        {product.qrCode || <span className='text-gray-400'>Chưa có mã</span>}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                                <Package className='text-green-600 mt-1' size={20} />
                                <div>
                                    <p className='text-sm font-medium text-gray-700'>Kích thước</p>
                                    <p className='text-gray-900 text-sm mt-1'>
                                        {product.sizeTierName || <span className='text-gray-400'>Chưa xác định</span>}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                                <MapPin className='text-red-600 mt-1' size={20} />
                                <div>
                                    <p className='text-sm font-medium text-gray-700'>Điểm thu gom</p>
                                    <p className='text-gray-900 text-sm mt-1'>
                                        {product.smallCollectionPointName || <span className='text-gray-400'>Không rõ</span>}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                                <Calendar className='text-purple-600 mt-1' size={20} />
                                <div>
                                    <p className='text-sm font-medium text-gray-700'>Ngày thu gom</p>
                                    <p className='text-gray-900 text-sm mt-1'>
                                        {product.pickUpDate 
                                            ? new Date(product.pickUpDate).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : <span className='text-gray-400'>Chưa xác định</span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Attributes */}
                        {product.attributes && product.attributes.length > 0 && (
                            <div className='border-t pt-4'>
                                <p className='text-sm font-medium text-gray-700 mb-3'>Thuộc tính:</p>
                                <div className='grid grid-cols-2 gap-2'>
                                    {product.attributes.map((attr: any, idx: number) => (
                                        <div key={idx} className='text-sm bg-gray-50 rounded px-3 py-2'>
                                            <span className='text-gray-600'>{attr.name}:</span>{' '}
                                            <span className='text-gray-900 font-medium'>{attr.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* IDs Info */}
                        <div className='border-t pt-4 text-xs text-gray-500 space-y-1'>
                            <p><strong>Product ID:</strong> {product.productId}</p>
                            <p><strong>Category ID:</strong> {product.categoryId}</p>
                            <p><strong>Brand ID:</strong> {product.brandId}</p>
                        </div>
                    </div>
                </div>
            </div>

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
    );
};

export default ProductDetail;
