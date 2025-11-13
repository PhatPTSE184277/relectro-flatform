'use client';
import React from 'react';
import type { Package } from '@/services/collector/PackageService';

interface PackageDetailProps {
    package: Package;
    onClose: () => void;
}

const PackageDetail: React.FC<PackageDetailProps> = ({ package: pkg, onClose }) => {
    if (!pkg) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết Package
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            {pkg.packageName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Package Info */}
                    <div className='bg-gray-50 rounded-xl p-4 mb-6'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                            Thông tin Package
                        </h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm text-gray-500'>Mã Package</p>
                                <p className='text-base font-medium text-gray-900'>
                                    {pkg.packageId}
                                </p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500'>Tên Package</p>
                                <p className='text-base font-medium text-gray-900'>
                                    {pkg.packageName}
                                </p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500'>Điểm thu gom</p>
                                <p className='text-base font-medium text-gray-900'>
                                    Điểm {pkg.smallCollectionPointsId}
                                </p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500'>Số sản phẩm</p>
                                <p className='text-base font-medium text-gray-900'>
                                    {pkg.products.length} sản phẩm
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                            Danh sách sản phẩm
                        </h3>
                        <div className='space-y-3'>
                            {pkg.products.map((product, index) => (
                                <div
                                    key={product.productId}
                                    className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                                >
                                    <div className='flex justify-between items-start'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <span className='text-xs font-semibold text-gray-500'>
                                                    #{index + 1}
                                                </span>
                                                <h4 className='font-semibold text-gray-900'>
                                                    {product.categoryName}
                                                </h4>
                                            </div>
                                            <div className='grid grid-cols-2 gap-2 text-sm'>
                                                <div>
                                                    <span className='text-gray-500'>Thương hiệu:</span>
                                                    <span className='ml-2 text-gray-900'>
                                                        {product.brandName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className='text-gray-500'>Kích thước:</span>
                                                    <span className='ml-2 text-gray-900'>
                                                        {product.sizeTierName || 'Chưa xác định'}
                                                    </span>
                                                </div>
                                                {product.qrCode && (
                                                    <div>
                                                        <span className='text-gray-500'>QR Code:</span>
                                                        <span className='ml-2 text-gray-900 font-mono text-xs'>
                                                            {product.qrCode}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.status && (
                                                    <div>
                                                        <span className='text-gray-500'>Trạng thái:</span>
                                                        <span className='ml-2 text-gray-900'>
                                                            {product.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {product.description && (
                                                <p className='text-sm text-gray-600 mt-2'>
                                                    {product.description}
                                                </p>
                                            )}
                                            {product.attributes && product.attributes.length > 0 && (
                                                <div className='mt-3'>
                                                    <p className='text-xs font-semibold text-gray-700 mb-1'>
                                                        Thuộc tính:
                                                    </p>
                                                    <div className='flex flex-wrap gap-2'>
                                                        {product.attributes.map((attr, idx) => (
                                                            <span
                                                                key={idx}
                                                                className='px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md'
                                                            >
                                                                {attr.attributeName}: {attr.value}
                                                                {attr.unit && ` ${attr.unit}`}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;
