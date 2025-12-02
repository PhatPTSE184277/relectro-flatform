'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PackageType } from '@/types/Package';
import { X, QrCode, Info, List } from 'lucide-react';
import { toast } from 'react-toastify';
import PackageInfoCard from './PackageInfoCard';
import ProductList from './ProductList';

interface ScanProductModalProps {
    open: boolean;
    onClose: () => void;
    package: PackageType;
    onConfirm: (packageId: string, productQrCodes: string[]) => void;
}

const ScanProductModal: React.FC<ScanProductModalProps> = ({
    open,
    onClose,
    package: pkg,
    onConfirm
}) => {
    const [qrCode, setQrCode] = useState('');
    const [checkedProducts, setCheckedProducts] = useState<Set<string>>(new Set());
    const inputRef = useRef<HTMLInputElement>(null);

    const totalChecked = pkg.products.filter(p => p.isChecked).length + checkedProducts.size;

    useEffect(() => {
        if (open) {
            setQrCode('');
            setCheckedProducts(new Set());
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleScanQR = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQr = qrCode.trim();

        if (!trimmedQr) {
            toast.warning('Vui lòng nhập mã QR sản phẩm');
            return;
        }

        // Check if product exists in package
        const product = pkg.products.find((p) => p.qrCode === trimmedQr);
        
        if (!product) {
            toast.error('Không tìm thấy sản phẩm với mã QR này trong package');
            setQrCode('');
            inputRef.current?.focus();
            return;
        }

        // Check if already checked from API
        if (product.isChecked) {
            toast.warning('Sản phẩm này đã được kiểm tra rồi');
            setQrCode('');
            inputRef.current?.focus();
            return;
        }

        // Check if already scanned in this session
        if (checkedProducts.has(trimmedQr)) {
            toast.warning('Sản phẩm này đã được quét rồi trong phiên này');
            setQrCode('');
            inputRef.current?.focus();
            return;
        }

        // Add to checked list
        setCheckedProducts((prev) => new Set([...prev, trimmedQr]));
        toast.success('Đã quét: ' + product.categoryName + ' - ' + product.brandName);
        setQrCode('');
        inputRef.current?.focus();
    };

    const handleSubmit = () => {
        if (checkedProducts.size === 0) {
            toast.warning('Vui lòng quét ít nhất một sản phẩm');
            return;
        }

        onConfirm(pkg.packageId, Array.from(checkedProducts));
        handleClose();
    };

    const handleClose = () => {
        setQrCode('');
        setCheckedProducts(new Set());
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
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Quét kiểm tra sản phẩm
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Quét mã QR từng sản phẩm để xác nhận
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
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Package Info */}
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                            <Info className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin package
                    </h3>
                    <PackageInfoCard pkg={pkg} />

                    {/* Scan Input & Progress */}
                    <div className='bg-primary-50 rounded-xl p-4 shadow-sm border border-primary-200 mb-6'>
                        <div className='flex items-center gap-2 mb-3'>
                            <QrCode className='text-primary-600' size={20} />
                            <label className='text-sm font-semibold text-gray-700'>
                                Quét mã QR sản phẩm
                            </label>
                        </div>
                        <form onSubmit={handleScanQR} className='flex gap-2 mb-4'>
                            <input
                                ref={inputRef}
                                type='text'
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                                placeholder='Quét hoặc nhập mã QR...'
                                className='flex-1 px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400'
                                autoFocus
                            />
                            <button
                                type='submit'
                                className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer'
                            >
                                Quét
                            </button>
                        </form>

                        {/* Progress */}
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-semibold text-gray-700'>
                                Tiến độ kiểm tra
                            </span>
                            <span className='text-sm font-bold text-primary-600'>
                                {totalChecked} / {pkg.products.length}
                            </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2.5'>
                            <div
                                className='bg-primary-600 h-2.5 rounded-full transition-all duration-300'
                                style={{
                                    width: ((totalChecked / pkg.products.length) * 100) + '%'
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                <List className='w-5 h-5 text-primary-500' />
                            </span>
                            Danh sách sản phẩm
                        </h3>
                        <ProductList
                            products={pkg.products}
                            showStatus={true}
                            checkedProducts={checkedProducts}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleSubmit}
                        disabled={checkedProducts.size === 0}
                        className={`px-6 py-2 rounded-lg font-medium transition cursor-pointer ${
                            checkedProducts.size > 0
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Xác nhận
                    </button>
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

export default ScanProductModal;
