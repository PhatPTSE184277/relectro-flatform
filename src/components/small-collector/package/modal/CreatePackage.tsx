'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ScanLine, Plus } from 'lucide-react';
import { getProductByQRCode } from '@/services/small-collector/IWProductService';
import ProductList from './ProductList';
import Toast from '@/components/ui/Toast';

interface CreatePackageProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (packageData: {
        packageId: string;
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
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const inputRef = useRef<HTMLInputElement>(null);
    // const packageNameRef = useRef<HTMLInputElement>(null);
    const lastProductRef = useRef<HTMLTableRowElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            // Reset form when modal opens
            setPackageId('');
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
            return;
        }

        // Check if already scanned
        if (scannedProducts.some((p) => p.qrCode === qrCode)) {
            setQrCodeInput('');
            inputRef.current?.focus();
            setToastMessage('Mã này đã có trong danh sách');
            setToastType('error');
            setToastOpen(true);
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
                setQrCodeInput('');
                inputRef.current?.focus();
                return;
            }

            setScannedProducts((prev) => {
                const updated = [
                    {
                        qrCode: product.qrCode,
                        categoryName: product.categoryName,
                        brandName: product.brandName,
                        description: product.description,
                        productImage: product.productImages?.[0]
                    },
                    ...prev
                ];
                setSelectedIndex(0); // newly added product is at the top
                return updated;
            });

            setQrCodeInput('');
            inputRef.current?.focus();
        } catch (err: any) {
            console.error('Scan QR error', err);
            setQrCodeInput('');
            inputRef.current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProduct = (qrCode: string) => {
        setScannedProducts((prev) => prev.filter((p) => p.qrCode !== qrCode));
    };

    const handleSubmit = () => {
        if (!packageId.trim()) {
            return;
        }
        if (scannedProducts.length === 0) {
            return;
        }
        onConfirm({
            packageId: packageId.trim(),
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
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Tạo Package Mới
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 p-6 space-y-6 bg-gray-50'>
                    {/* Package ID & QR Scanner in one row */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        {/* Mã Package */}
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Mã Package <span className='text-red-500'>*</span>
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={packageId}
                                    onChange={(e) => setPackageId(e.target.value)}
                                    placeholder='Quét hoặc nhập mã package...'
                                    disabled={loading}
                                    className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                    autoComplete='off'
                                />
                                <ScanLine
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                    size={18}
                                />
                            </div>
                        </div>
                        {/* QR Scanner */}
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Quét QR Code Sản Phẩm
                            </label>
                            <form onSubmit={handleScanQR} className='flex gap-2'>
                                <div className='relative flex-1'>
                                    <input
                                        ref={inputRef}
                                        type='text'
                                        value={qrCodeInput}
                                        onChange={(e) => setQrCodeInput(e.target.value)}
                                        placeholder='Quét hoặc nhập mã QR...'
                                        disabled={loading}
                                        className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                        autoComplete='off'
                                    />
                                    <ScanLine
                                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                        size={18}
                                    />
                                </div>
                                <button
                                    type='submit'
                                    disabled={!qrCodeInput.trim() || loading}
                                    className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium flex items-center gap-2 border border-primary-200 shadow-md'
                                >
                                    <Plus size={18} />
                                    Thêm
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Scanned Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='p-4 border-b border-gray-100'>
                            <h3 className='text-lg font-semibold text-gray-900'>
                                Danh sách sản phẩm ({scannedProducts.length})
                            </h3>
                        </div>

                        <ProductList
                            products={scannedProducts}
                            mode='edit'
                            onRemoveProduct={handleRemoveProduct}
                            selectedIndex={selectedIndex}
                            lastProductRef={lastProductRef}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center gap-3 p-5 border-t border-gray-100 bg-white'>
                    <div className='text-sm text-gray-600 flex items-center'>
                        <span className='font-semibold'>
                            {scannedProducts.length}
                        </span>
                        <span className='ml-1'>sản phẩm đã thêm</span>
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleSubmit}
                            disabled={scannedProducts.length === 0}
                            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 border border-primary-200'
                        >
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

            <Toast
                open={toastOpen}
                type={toastType}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
            />
        </div>
    );
};

export default CreatePackage;
