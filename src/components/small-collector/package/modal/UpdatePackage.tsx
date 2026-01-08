'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, ScanLine, Trash2, Package } from 'lucide-react';
import { getProductByQRCode } from '@/services/small-collector/IWProductService';

interface UpdatePackageProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (packageData: {
        productsQrCode: string[];
    }) => void;
    initialData: {
        productsQrCode: string[];
    };
}

interface ScannedProduct {
    qrCode: string;
    categoryName: string;
    brandName: string;
    description: string;
    productImage?: string;
}

const UpdatePackage: React.FC<UpdatePackageProps> = ({
    open,
    onClose,
    onConfirm,
    initialData
}) => {
    // const [packageName, setPackageName] = useState('');
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastProductRef = useRef<HTMLTableRowElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (open && initialData) {
            // Load existing products
            const loadExistingProducts = async () => {
                const products: ScannedProduct[] = [];
                for (const qrCode of initialData.productsQrCode) {
                    try {
                        const product = await getProductByQRCode(qrCode);
                        products.push({
                            qrCode: product.qrCode,
                            categoryName: product.categoryName,
                            brandName: product.brandName,
                            description: product.description,
                            productImage: product.productImages?.[0]
                        });
                    } catch (err) {
                        console.error('Error loading product:', err);
                    }
                }
                setScannedProducts(products);
            };
            loadExistingProducts();
            setQrCodeInput('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, initialData]);

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
                    ...prev,
                    {
                        qrCode: product.qrCode,
                        categoryName: product.categoryName,
                        brandName: product.brandName,
                        description: product.description,
                        productImage: product.productImages?.[0]
                    }
                ];
                setSelectedIndex(updated.length - 1);
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
        if (scannedProducts.length === 0) {
            return;
        }
        onConfirm({
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
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Cập nhật Package
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
                                    onChange={(e) => setQrCodeInput(e.target.value)}
                                    placeholder='Quét hoặc nhập mã QR...'
                                    className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900'
                                    disabled={loading}
                                />
                                <ScanLine
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                    size={18}
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 cursor-pointer border border-primary-200 shadow-md'
                            >
                                {loading ? 'Đang quét...' : 'Quét'}
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

                        <div className='max-h-64 overflow-y-auto'>
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
                                    <tbody>
                                        {scannedProducts.map((product, index) => (
                                            <tr
                                                key={product.qrCode}
                                                ref={
                                                    index === selectedIndex
                                                        ? lastProductRef
                                                        : null
                                                }
                                                className={`border-b border-gray-100 ${
                                                    index === selectedIndex
                                                        ? 'bg-blue-50'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className='py-2 px-3 text-gray-700 text-center'>
                                                    <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold mx-auto'>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className='py-2 px-3 text-gray-900 font-medium'>
                                                    {product.categoryName}
                                                </td>
                                                <td className='py-2 px-3 text-gray-700'>
                                                    {product.brandName}
                                                </td>
                                                <td className='py-2 px-3 text-gray-700 max-w-xs'>
                                                    <div className='line-clamp-2'>
                                                        {product.description || 'Không có mô tả'}
                                                    </div>
                                                </td>
                                                  <td className='py-2 px-3 text-gray-500 font-mono text-xs'>
                                                    {product.qrCode}
                                                </td>
                                                <td className='py-2 px-3 text-center'>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveProduct(
                                                                product.qrCode
                                                            )
                                                        }
                                                        className='text-red-500 hover:text-red-700 transition cursor-pointer'
                                                        title='Xóa sản phẩm'
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
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
                        <span className='font-medium text-gray-900'>
                            {scannedProducts.length}
                        </span>
                        <span className='ml-1'>sản phẩm đã thêm</span>
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleSubmit}
                            disabled={scannedProducts.length === 0}
                            className='p-2 rounded-lg text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-primary-200'
                            title='Cập nhật Package'
                        >
                            <Package size={22} />
                            Xác nhận
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

export default UpdatePackage;
