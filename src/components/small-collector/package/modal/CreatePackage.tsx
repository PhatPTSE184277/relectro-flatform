'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ScanLine, Package, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductByQRCode } from '@/services/small-collector/IWProductService';

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
    const packageNameRef = useRef<HTMLInputElement>(null);
    const lastProductRef = useRef<HTMLTableRowElement>(null);
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
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Tạo Package Mới
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Quét QR code để thêm sản phẩm vào package
                        </p>
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
                    {/* Package ID & Name on one row */}
                    <div className='flex gap-4'>
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Mã Package{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={packageId}
                                    onChange={(e) => setPackageId(e.target.value)}
                                    placeholder='Quét hoặc nhập mã package...'
                                    className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            packageNameRef.current?.focus();
                                        }
                                    }}
                                    style={{ boxShadow: 'none' }}
                                />
                                <ScanLine
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                    size={18}
                                />
                            </div>
                        </div>
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Tên Package{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                ref={packageNameRef}
                                type='text'
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                                placeholder='Nhập tên package...'
                                className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900'
                            />
                        </div>
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

                    {/* Scanned Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='p-4 border-b border-gray-100'>
                            <h3 className='text-lg font-semibold text-gray-900'>
                                Danh sách sản phẩm ({scannedProducts.length})
                            </h3>
                        </div>

                        <div className='overflow-x-auto'>
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
                                <table className='w-full text-sm text-gray-800'>
                                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                        <tr>
                                            <th className='py-3 px-4 text-center'>STT</th>
                                            <th className='py-3 px-4 text-left'>Danh mục</th>
                                            <th className='py-3 px-4 text-left'>Thương hiệu</th>
                                            <th className='py-3 px-4 text-left'>Ghi chú</th>
                                            <th className='py-3 px-4 text-left'>QR Code</th>
                                            <th className='py-3 px-4 text-center'>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className='max-h-64 overflow-y-auto'>
                                        {scannedProducts.map((product, index) => (
                                            <tr
                                                key={product.qrCode}
                                                ref={
                                                    selectedIndex === index
                                                        ? lastProductRef
                                                        : undefined
                                                }
                                                className={`border-b border-primary-100 hover:bg-primary-50/40 transition-colors`}
                                            >
                                                <td className='py-3 px-4 font-medium text-center'>
                                                    <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold mx-auto'>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 font-medium'>
                                                    <div className='text-gray-900'>{product.categoryName}</div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    {product.brandName}
                                                </td>
                                                <td className='py-3 px-4 text-gray-600 text-xs max-w-xs truncate'>
                                                    {product.description || '-'}
                                                </td>
                                                <td className='py-3 px-4 text-gray-400 font-mono text-xs'>
                                                    {product.qrCode}
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='flex justify-center gap-2'>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveProduct(
                                                                    product.qrCode
                                                                )
                                                            }
                                                            className='text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition cursor-pointer'
                                                            title='Xóa sản phẩm'
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
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
                            disabled={
                                !packageName.trim() ||
                                scannedProducts.length === 0
                            }
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
        </div>
    );
};

export default CreatePackage;
