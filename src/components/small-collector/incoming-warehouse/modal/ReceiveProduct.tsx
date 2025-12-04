/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import { X, Package as PackageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductByQRCode } from '@/services/small-collector/IWProductService';

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
    const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [reasonForChange, setReasonForChange] = useState(''); // Lý do đổi điểm
    const [point, setPoint] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    const qrInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            // Reset form when modal opens
            setQrCode('');
            setScannedProduct(null);
            setReasonForChange('');
            setPoint(0);
            // Auto focus on QR input
            setTimeout(() => qrInputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleScanQR = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = qrCode.trim();

        if (!code) {
            toast.warning('Vui lòng nhập mã QR sản phẩm');
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
                toast.error('Sản phẩm này chưa được thu gom hoặc không hợp lệ');
                setQrCode('');
                qrInputRef.current?.focus();
                return;
            }

            setScannedProduct({
                productId: product.productId,
                categoryName: product.categoryName,
                brandName: product.brandName,
                description: product.description,
                qrCode: product.qrCode,
                status: product.status,
                estimatePoint: product.estimatePoint,
                productImages: product.productImages
            });

            setPoint(product.estimatePoint || 0);
            setReasonForChange('');
            toast.success('Đã quét sản phẩm thành công');
        } catch (err: any) {
            console.error('Scan QR error', err);
            toast.error(
                err?.response?.data?.message ||
                    'Không tìm thấy sản phẩm với mã QR này'
            );
            setQrCode('');
            qrInputRef.current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!scannedProduct) {
            toast.warning('Vui lòng quét mã QR sản phẩm trước');
            return;
        }

        const isPointChanged = point !== (scannedProduct.estimatePoint || 0);
        
        // Nếu admin sửa điểm thì phải nhập lý do
        if (isPointChanged && !reasonForChange.trim()) {
            toast.warning('Vui lòng nhập lý do đổi điểm');
            return;
        }

        onConfirm({
            qrCode: scannedProduct.qrCode,
            productId: scannedProduct.productId,
            // Nếu có sửa điểm thì dùng reasonForChange, không thì truyền null
            description: isPointChanged ? reasonForChange.trim() : null,
            point
        });

        handleClose();
    };

    const handleClose = () => {
        setQrCode('');
        setScannedProduct(null);
        setReasonForChange('');
        setPoint(0);
        onClose();
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Nhận Sản Phẩm Nhập Kho
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Quét mã QR để nhận sản phẩm đã thu gom vào kho
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        style={{ cursor: 'pointer' }}
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    {/* Mã sản phẩm - chỉ hiện khi chưa quét */}
                    {!scannedProduct && (
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-100'>
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
                                    {loading ? 'Đang tìm...' : 'Ok'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Scanned Product Info */}
                    {scannedProduct && (
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                            <div className='flex items-center gap-2 mb-3'>
                                <PackageIcon className='text-primary-600' size={20} />
                                <h3 className='text-lg font-semibold text-gray-900'>Thông tin sản phẩm</h3>
                            </div>
                            <div className='flex gap-4 items-start'>
                                {scannedProduct.productImages && scannedProduct.productImages.length > 0 && (
                                    <div
                                        className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm shrink-0 cursor-pointer'
                                        onClick={() => setZoomImg(scannedProduct.productImages![0])}
                                    >
                                        <img
                                            src={scannedProduct.productImages[0]}
                                            alt={scannedProduct.categoryName}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                )}
                                {zoomImg && (
                                    <div
                                        className='fixed inset-0 z-999 flex items-center justify-center bg-black/70 cursor-pointer'
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
                                            <span className='text-base font-semibold text-gray-900 flex-1 break-all'>{scannedProduct.qrCode}</span>
                                        </div>
                                        <div className='flex items-center w-1/2'>
                                            <span className='text-sm text-gray-500 w-24 block'>Danh mục:</span>
                                            <span className='text-base font-semibold text-gray-900 flex-1 break-all'>{scannedProduct.categoryName}</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-8'>
                                        <div className='flex items-center w-1/2'>
                                            <span className='text-sm text-gray-500 w-28 block'>Thương hiệu:</span>
                                            <span className='text-base font-medium text-gray-900 flex-1 break-all'>{scannedProduct.brandName}</span>
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
                            {scannedProduct.description && (
                                <div className='mt-3 pt-3 border-t border-gray-100'>
                                    <span className='text-sm text-gray-500'>Ghi chú:</span>
                                    <span className='ml-2 text-gray-700 text-sm'>{scannedProduct.description}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Textarea lý do đổi điểm - chỉ hiện khi admin sửa điểm */}
                    {scannedProduct && point !== (scannedProduct.estimatePoint || 0) && (
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
                    <div className='flex justify-end w-full'>
                        <button
                            onClick={handleSubmit}
                            disabled={!scannedProduct || loading}
                            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                        >
                            Xác nhận nhập kho
                        </button>
                    </div>
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
    );
};

export default ReceiveProduct;
