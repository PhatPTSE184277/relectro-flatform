/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import { X, Package as PackageIcon, ArrowRight } from 'lucide-react';
import { getProductByQRCode, updatePointsTransaction } from '@/services/small-collector/IWProductService';

interface ReceiveProductProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: {
        qrCode: string;
        productId: string;
        description: string | null;
        point: number;
    }) => void;
}

interface ScannedProduct {
    productId: string;
    categoryName: string;
    brandName: string;
    description: string;
    qrCode: string;
    status: string;
    estimatePoint?: number;
    productImages?: string[];
}

const ReceiveProduct: React.FC<ReceiveProductProps> = ({
    open,
    onClose,
    onConfirm
}) => {
    const [qrCode, setQrCode] = useState('');
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ScannedProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [reasonForChange, setReasonForChange] = useState('');
    const [point, setPoint] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const qrInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            // Reset form when modal opens
            setQrCode('');
            setScannedProducts([]);
            setSelectedProduct(null);
            setReasonForChange('');
            setPoint(0);
            setShowEditModal(false);
            // Auto focus on QR input
            setTimeout(() => qrInputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleScanQR = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = qrCode.trim();

        if (!code) {
            return;
        }

        setLoading(true);
        try {
            const product = await getProductByQRCode(code);

            // Check if product status is valid for receiving
            const normalizedStatus = product.status?.toLowerCase() || '';
            if (
                !normalizedStatus.includes('đã thu') &&
                normalizedStatus !== 'collected'
            ) {
                setQrCode('');
                qrInputRef.current?.focus();
                return;
            }

            const newProduct: ScannedProduct = {
                productId: product.productId,
                categoryName: product.categoryName,
                brandName: product.brandName,
                description: product.description,
                qrCode: product.qrCode,
                status: product.status,
                estimatePoint: product.estimatePoint,
                productImages: product.productImages
            };

            // Add to list (max 4, remove first if full)
            setScannedProducts((prev) => {
                const newList = [...prev, newProduct];
                if (newList.length > 4) {
                    return newList.slice(1); // Remove first, keep last 4
                }
                return newList;
            });

            // Immediately call receive API (parent) with default point
            try {
                onConfirm({
                    qrCode: newProduct.qrCode,
                    productId: newProduct.productId,
                    description: null,
                    point: newProduct.estimatePoint || 0
                });
            } catch (err) {
                console.error('onConfirm handler error', err);
            }

            setQrCode('');
            qrInputRef.current?.focus();
        } catch (err: any) {
            console.error('Scan QR error', err);
            setQrCode('');
            qrInputRef.current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (product: ScannedProduct) => {
        setSelectedProduct(product);
        setPoint(product.estimatePoint || 0);
        setReasonForChange('');
        setShowEditModal(true);
    };

    const handleSubmit = async () => {
        if (!selectedProduct) return;

        const isPointChanged = point !== (selectedProduct.estimatePoint || 0);
        if (isPointChanged && !reasonForChange.trim()) return;

        if (isPointChanged) {
            try {
                await updatePointsTransaction(
                    selectedProduct.productId,
                    point,
                    reasonForChange.trim()
                );
                // update local list so UI reflects new point
                setScannedProducts((prev) =>
                    prev.map((p) =>
                        p.qrCode === selectedProduct.qrCode
                            ? { ...p, estimatePoint: point }
                            : p
                    )
                );
            } catch (error) {
                console.error('Error updating points:', error);
                return;
            }
        }

        // Close edit modal after possible update
        setShowEditModal(false);
        setSelectedProduct(null);
        setReasonForChange('');
        setPoint(0);
    };

    const handleClose = () => {
        setQrCode('');
        setScannedProducts([]);
        setSelectedProduct(null);
        setReasonForChange('');
        setPoint(0);
        setShowEditModal(false);
        onClose();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedProduct(null);
        setReasonForChange('');
        setPoint(0);
    };

    if (!open) return null;

    return (
        <>
            {/* Main Modal - Scan QR */}
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                {/* Overlay */}
                <div
                    className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                    onClick={handleClose}
                ></div>

                {/* Modal container */}
                <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                    {/* Header */}
                    <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Nhận hàng từ shipper
                            </h2>
                            <p className='text-sm text-gray-600 mt-1'>Quét mã sản phẩm để nhận hàng</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        >
                            <X size={28} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                        {/* Mã sản phẩm input */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Mã sản phẩm{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <form onSubmit={handleScanQR} className='flex gap-2'>
                                <div className='relative flex-1'>
                                    <input
                                        ref={qrInputRef}
                                        type='text'
                                        value={qrCode}
                                        onChange={(e) => setQrCode(e.target.value)}
                                        placeholder='Nhập mã sản phẩm...'
                                        disabled={loading}
                                        className='w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                        autoComplete='off'
                                    />
                                    <PackageIcon
                                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                        size={18}
                                    />
                                </div>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                                >
                                    {loading ? 'Đang tìm...' : <ArrowRight className='w-5 h-5' />}
                                </button>
                            </form>
                        </div>

                        {/* Tabs hiện các sản phẩm đã quét */}
                        {scannedProducts.length > 0 && (
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                                <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                                    Sản phẩm đã quét ({scannedProducts.length}/4)
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {scannedProducts.map((product) => (
                                        <button
                                            key={product.qrCode}
                                            onClick={() => handleTabClick(product)}
                                            className='px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg font-medium transition cursor-pointer border border-primary-300 text-sm'
                                        >
                                            {product.qrCode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Animation */}
                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.2s ease-out;
                    }
                `}</style>
            </div>

            {/* Edit Modal - Hiện khi click vào tab */}
            {showEditModal && selectedProduct && (
                <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4'>
                    {/* Overlay */}
                    <div
                        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                        onClick={handleCloseEditModal}
                    ></div>

                    {/* Modal container */}
                    <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                        {/* Header */}
                        <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900'>
                                    Chi tiết sản phẩm
                                </h2>
                                <p className='text-sm text-gray-600 mt-1'>Xác nhận và cập nhật điểm sản phẩm</p>
                            </div>
                            <button
                                onClick={handleCloseEditModal}
                                className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                            {/* Scanned Product Info */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                                <div className='flex items-center gap-2 mb-3'>
                                    <PackageIcon className='text-primary-600' size={20} />
                                    <h3 className='text-lg font-semibold text-gray-900'>Thông tin sản phẩm</h3>
                                </div>
                                <div className='flex gap-4 items-start'>
                                    {selectedProduct.productImages && selectedProduct.productImages.length > 0 && (
                                        <div
                                            className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm shrink-0 cursor-pointer'
                                            onClick={() => setZoomImg(selectedProduct.productImages![0])}
                                        >
                                            <img
                                                src={selectedProduct.productImages[0]}
                                                alt={selectedProduct.categoryName}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    )}
                                    {zoomImg && (
                                        <div
                                            className='fixed inset-0 z-70 flex items-center justify-center bg-black/70 cursor-pointer'
                                            onClick={() => setZoomImg(null)}
                                        >
                                            <img
                                                src={zoomImg}
                                                alt='Zoom'
                                                className='max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white object-contain'
                                            />
                                        </div>
                                    )}
                                    <div className='flex-1 space-y-2'>
                                        <div className='flex items-center gap-8'>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-28 block'>Mã sản phẩm:</span>
                                                <span className='text-base font-semibold text-gray-900 flex-1 break-all'>{selectedProduct.qrCode}</span>
                                            </div>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-24 block'>Danh mục:</span>
                                                <span className='text-base font-semibold text-gray-900 flex-1 break-all'>{selectedProduct.categoryName}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-8'>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-28 block'>Thương hiệu:</span>
                                                <span className='text-base font-medium text-gray-900 flex-1 break-all'>{selectedProduct.brandName}</span>
                                            </div>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-24 block'>Điểm:</span>
                                                <CustomNumberInput
                                                    value={point}
                                                    onChange={setPoint}
                                                    min={0}
                                                    className='w-24 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Ghi chú sản phẩm */}
                                {selectedProduct.description && (
                                    <div className='mt-3 pt-3 border-t border-gray-100'>
                                        <span className='text-sm text-gray-500'>Ghi chú:</span>
                                        <span className='ml-2 text-gray-700 text-sm'>{selectedProduct.description}</span>
                                    </div>
                                )}
                            </div>

                            {/* Textarea lý do đổi điểm - chỉ hiện khi admin sửa điểm */}
                            {point !== (selectedProduct.estimatePoint || 0) && (
                                <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Lý do đổi điểm <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        value={reasonForChange}
                                        onChange={(e) => setReasonForChange(e.target.value)}
                                        placeholder='Nhập lý do tại sao thay đổi điểm...'
                                        rows={3}
                                        className='w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none'
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className='flex justify-between items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                            <div className='flex justify-end w-full gap-3'>
                                <button
                                    onClick={handleCloseEditModal}
                                    className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer'
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReceiveProduct;
