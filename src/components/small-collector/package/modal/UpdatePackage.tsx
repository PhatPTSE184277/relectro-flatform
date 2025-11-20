'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, ScanLine, Trash2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductByQRCode } from '@/services/small-collector/IWProductService';

interface UpdatePackageProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (packageData: {
        packageName: string;
        productsQrCode: string[];
    }) => void;
    initialData: {
        packageName: string;
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
    const [packageName, setPackageName] = useState('');
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastProductRef = useRef<HTMLTableRowElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (open && initialData) {
            setPackageName(initialData.packageName);
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
                setSelectedIndex(updated.length - 1);
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
        if (!packageName.trim()) {
            toast.warning('Vui lòng nhập tên package');
            return;
        }

        if (scannedProducts.length === 0) {
            toast.warning('Vui lòng thêm ít nhất một sản phẩm');
            return;
        }

        onConfirm({
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
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Cập nhật Package
                            </h2>
                            <p className='text-sm text-gray-500 mt-1'>
                                Quét QR code để thêm hoặc xóa sản phẩm
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
                                    onChange={(e) => setQrCodeInput(e.target.value)}
                                    placeholder='Quét hoặc nhập mã QR...'
                                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                                    disabled={loading}
                                />
                                <ScanLine
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                                    size={18}
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 cursor-pointer'
                            >
                                {loading ? 'Đang quét...' : 'Quét'}
                            </button>
                        </form>
                    </div>

                    {/* Scanned Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='p-4 border-b border-gray-100 flex justify-between items-center'>
                            <h3 className='text-sm font-medium text-gray-700'>
                                Danh sách sản phẩm ({scannedProducts.length})
                            </h3>
                        </div>

                        <div className='overflow-x-auto max-h-[300px]'>
                            {scannedProducts.length > 0 ? (
                                <table className='w-full text-sm'>
                                    <thead className='bg-gray-50 sticky top-0'>
                                        <tr>
                                            <th className='py-2 px-3 text-left text-xs font-medium text-gray-500'>
                                                STT
                                            </th>
                                            <th className='py-2 px-3 text-left text-xs font-medium text-gray-500'>
                                                Danh mục
                                            </th>
                                            <th className='py-2 px-3 text-left text-xs font-medium text-gray-500'>
                                                Thương hiệu
                                            </th>
                                            <th className='py-2 px-3 text-left text-xs font-medium text-gray-500'>
                                                QR Code
                                            </th>
                                            <th className='py-2 px-3 text-center text-xs font-medium text-gray-500'>
                                                Xóa
                                            </th>
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
                                                <td className='py-2 px-3 text-gray-700'>
                                                    {index + 1}
                                                </td>
                                                <td className='py-2 px-3 text-gray-900 font-medium'>
                                                    {product.categoryName}
                                                </td>
                                                <td className='py-2 px-3 text-gray-700'>
                                                    {product.brandName}
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
                            ) : (
                                <div className='py-12 text-center text-gray-400'>
                                    Chưa có sản phẩm nào. Quét QR để thêm sản phẩm.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center gap-3 p-5 border-t border-gray-100 bg-white'>
                    <div className='text-sm text-gray-600'>
                        <span className='font-medium text-gray-900'>
                            {scannedProducts.length}
                        </span>{' '}
                        sản phẩm đã thêm
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleSubmit}
                            disabled={!packageName.trim() || scannedProducts.length === 0}
                            className='p-2 rounded-lg text-white cursor-pointer shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2'
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
