/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ScanLine, Package, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductByQRCode } from '@/services/collector/IWProductService';

interface CreatePackageProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (packageData: {
        packageId: string;
        packageName: string;
        productsQrCode: string[];
    }) => void;
}

interface ScannedProduct {
    qrCode: string;
    categoryName: string;
    brandName: string;
    description: string;
    productImage?: string;
}

const CreatePackage: React.FC<CreatePackageProps> = ({
    open,
    onClose,
    onConfirm
}) => {
    const [packageId, setPackageId] = useState('');
    const [packageName, setPackageName] = useState('');
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastProductRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            // Reset form when modal opens
            setPackageId('');
            setPackageName('');
            setQrCodeInput('');
            setScannedProducts([]);
            // Auto focus on QR input
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    // Tự động scroll tới sản phẩm vừa quét
    useEffect(() => {
        if (selectedIndex !== null && lastProductRef.current) {
            lastProductRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            inputRef.current?.focus();
        }
    }, [selectedIndex, scannedProducts.length]);

    const handleScanQR = async (e: React.FormEvent) => {
        e.preventDefault();
        const qrCode = qrCodeInput.trim();

        if (!qrCode) {
            toast.warning('Vui lòng nhập mã QR');
            return;
        }

        // Check if already scanned
        if (scannedProducts.some((p) => p.qrCode === qrCode)) {
            toast.warning('Sản phẩm này đã được quét');
            setQrCodeInput('');
            inputRef.current?.focus();
            return;
        }

        setLoading(true);
        try {
            const product = await getProductByQRCode(qrCode);

            // Check if product status is valid for packaging
            const normalizedStatus = product.status?.toLowerCase() || '';
            if (
                !normalizedStatus.includes('nhập') &&
                normalizedStatus !== 'received'
            ) {
                toast.error('Sản phẩm này chưa được nhập kho');
                setQrCodeInput('');
                inputRef.current?.focus();
                return;
            }

            setScannedProducts((prev) => {
                const updated = [
                    ...prev,
                    {
                        qrCode: product.qrCode,
                        categoryName: product.categoryName,
                        brandName: product.brandName,
                        description: product.description,
                        productImage: product.productImages?.[0]
                    }
                ];
                setSelectedIndex(updated.length - 1); // select the newly added product
                return updated;
            });

            toast.success(`Đã thêm ${product.categoryName}`);
            setQrCodeInput('');
            inputRef.current?.focus();
        } catch (err: any) {
            console.error('Scan QR error', err);
            toast.error(
                err?.response?.data?.message ||
                    'Không tìm thấy sản phẩm với mã QR này'
            );
            setQrCodeInput('');
            inputRef.current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProduct = (qrCode: string) => {
        setScannedProducts((prev) => prev.filter((p) => p.qrCode !== qrCode));
        toast.info('Đã xóa sản phẩm khỏi package');
    };

    const handleSubmit = () => {
        if (!packageId.trim()) {
            toast.warning('Vui lòng nhập mã package');
            return;
        }

        if (!packageName.trim()) {
            toast.warning('Vui lòng nhập tên package');
            return;
        }

        if (scannedProducts.length === 0) {
            toast.warning('Vui lòng thêm ít nhất một sản phẩm');
            return;
        }

        onConfirm({
            packageId: packageId.trim(),
            packageName: packageName.trim(),
            productsQrCode: scannedProducts.map((p) => p.qrCode)
        });

        handleClose();
    };

    useEffect(() => {
        if (scannedProducts.length > 0) {
            inputRef.current?.focus();
        }
    }, [scannedProducts]);

    const handleClose = () => {
        setPackageId('');
        setPackageName('');
        setQrCodeInput('');
        setScannedProducts([]);
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
            <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Tạo Package Mới
                            </h2>
                            <p className='text-sm text-gray-500 mt-1'>
                                Quét QR code để thêm sản phẩm vào package
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50'>
                    {/* Package ID */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Mã Package <span className='text-red-500'>*</span>
                        </label>
                        <div className='relative'>
                            <input
                                type='text'
                                value={packageId}
                                onChange={(e) => setPackageId(e.target.value)}
                                placeholder='Quét hoặc nhập mã package...'
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                            />
                            <ScanLine
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                                size={18}
                            />
                        </div>
                    </div>

                    {/* Package Name */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Tên Package <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            placeholder='Nhập tên package...'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                        />
                    </div>

                    {/* QR Scanner */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Quét QR Code Sản Phẩm
                        </label>
                        <form onSubmit={handleScanQR} className='flex gap-2'>
                            <div className='relative flex-1'>
                                <input
                                    ref={inputRef}
                                    type='text'
                                    value={qrCodeInput}
                                    onChange={(e) =>
                                        setQrCodeInput(e.target.value)
                                    }
                                    placeholder='Quét hoặc nhập mã QR...'
                                    disabled={loading}
                                    className='w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                    autoComplete='off'
                                />
                                <ScanLine
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                                    size={18}
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={!qrCodeInput.trim() || loading}
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium flex items-center gap-2'
                            >
                                <Plus size={18} />
                                Thêm
                            </button>
                        </form>
                    </div>

                    {/* Scanned Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='p-4 border-b border-gray-100 flex justify-between items-center'>
                            <h3 className='text-lg font-semibold text-gray-900'>
                                Danh sách sản phẩm ({scannedProducts.length})
                            </h3>
                        </div>

                        <div className='p-4'>
                            {scannedProducts.length === 0 ? (
                                <div className='text-center py-8 text-gray-400'>
                                    <Package
                                        size={48}
                                        className='mx-auto mb-2 opacity-50'
                                    />
                                    <p>Chưa có sản phẩm nào</p>
                                    <p className='text-sm'>
                                        Quét QR code để thêm sản phẩm
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-3 max-h-64 overflow-y-auto'>
                                    {scannedProducts.map((product, index) => (
                                        <div
                                            key={product.qrCode}
                                            ref={
                                                selectedIndex === index
                                                    ? lastProductRef
                                                    : undefined
                                            }
                                            className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition ${
                                                selectedIndex === index
                                                    ? 'ring-2 ring-blue-400'
                                                    : ''
                                            }`}
                                        >
                                            {product.productImage && (
                                                <div className='w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0'>
                                                    <img
                                                        src={
                                                            product.productImage
                                                        }
                                                        alt={
                                                            product.categoryName
                                                        }
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                            )}
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                        {index + 1}
                                                    </span>
                                                    <p className='font-semibold text-gray-900'>
                                                        {product.categoryName}
                                                    </p>
                                                </div>
                                                <p className='text-sm text-gray-600 mt-1'>
                                                    {product.brandName}
                                                </p>
                                                {product.description && (
                                                    <p className='text-xs text-gray-500 mt-1 line-clamp-1'>
                                                        {product.description}
                                                    </p>
                                                )}
                                                <p className='text-xs text-gray-400 font-mono mt-1'>
                                                    QR: {product.qrCode}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveProduct(
                                                        product.qrCode
                                                    )
                                                }
                                                className='text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0'
                                                title='Xóa sản phẩm'
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center gap-3 p-5 border-t border-gray-100 bg-white'>
                    <div className='text-sm text-gray-600'>
                        <span className='font-semibold'>
                            {scannedProducts.length}
                        </span>{' '}
                        sản phẩm đã thêm
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleClose}
                            className='px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition cursor-pointer'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={
                                !packageName.trim() ||
                                scannedProducts.length === 0
                            }
                            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            <Package size={18} />
                            Tạo Package
                        </button>
                    </div>
                </div>
            </div>

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CreatePackage;
