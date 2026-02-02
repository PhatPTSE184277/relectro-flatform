'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, List, Tag, MapPin, Home } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from './ProductList';
import { useRecyclerPackageContext } from '@/contexts/recycle/PackageContext';

interface ScanProductModalProps {
    open: boolean;
    onClose: () => void;
    package: { packageId: string };
    onConfirm: (packageId: string, productQrCodes: string[]) => void;
}

const ScanProductModal: React.FC<ScanProductModalProps> = ({
    open,
    onClose,
    package: pkg,
    onConfirm
}) => {
    const { selectedPackage, fetchPackageDetail } = useRecyclerPackageContext();
    const [qrCode, setQrCode] = useState('');
    const [checkedProducts, setCheckedProducts] = useState<Set<string>>(new Set());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setQrCode('');
            setCheckedProducts(new Set());
            setTimeout(() => inputRef.current?.focus(), 100);
            fetchPackageDetail(pkg.packageId, 1, 10);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, pkg.packageId]);

    if (!open || !selectedPackage) return null;

    const productsData = Array.isArray(selectedPackage.products) ? selectedPackage.products : selectedPackage.products.data;
    const totalChecked = productsData.filter((p: any) => p.isChecked).length + checkedProducts.size;

    const handleScanQR = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQr = qrCode.trim();

        if (!trimmedQr) {
            return;
        }

        // Check if product exists in package
        const product = productsData.find((p: any) => p.qrCode === trimmedQr);
        
        if (!product) {
            setQrCode('');
            inputRef.current?.focus();
            return;
        }

        // Check if already checked from API
        if (product.isChecked) {
            setQrCode('');
            inputRef.current?.focus();
            return;
        }

        // Check if already scanned in this session
        if (checkedProducts.has(trimmedQr)) {
            setQrCode('');
            inputRef.current?.focus();
            return;
        }

        // Add to checked list
        setCheckedProducts((prev) => new Set([...prev, trimmedQr]));
        setQrCode('');
        inputRef.current?.focus();
    };

    const handleSubmit = () => {
        if (checkedProducts.size === 0) {
            return;
        }

        onConfirm(selectedPackage.packageId, Array.from(checkedProducts));
        handleClose();
    };

    const handlePageChange = async (page: number) => {
        await fetchPackageDetail(selectedPackage.packageId, page, 10);
    };

    const handleClose = () => {
        setQrCode('');
        setCheckedProducts(new Set());
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-8xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-4 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900'>
                            Quét kiểm tra sản phẩm
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-2xl font-light cursor-pointer transition'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className='p-4 space-y-4'>
                    {/* Package Info */}
                    <SummaryCard 
                        items={[
                            {
                                icon: <Tag size={14} className='text-primary-400' />,
                                label: 'Mã package',
                                value: selectedPackage.packageId,
                            },
                            {
                                icon: <MapPin size={14} className='text-primary-400' />,
                                label: 'Điểm thu gom',
                                value: selectedPackage.smallCollectionPointsName,
                            },
                            {
                                icon: <Home size={14} className='text-primary-400' />,
                                label: 'Địa chỉ thu gom',
                                value: selectedPackage.smallCollectionPointsAddress,
                            },
                        ]}
                        singleRow={true}
                    />

                    {/* Scan Input & Progress */}
                    <div className='bg-primary-50 rounded-xl p-3 shadow-sm border border-primary-200'>
                        <div className='flex items-center gap-2 justify-between'>
                            <form onSubmit={handleScanQR} className='flex gap-2 items-center'>
                                <div className='relative w-72'>
                                    <input
                                        ref={inputRef}
                                        type='text'
                                        value={qrCode}
                                        onChange={(e) => setQrCode(e.target.value)}
                                        placeholder='Nhập mã QR...'
                                        className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400'
                                        autoFocus
                                    />
                                    <QrCode className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400' size={18} />
                                </div>
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer'
                                >
                                    Quét
                                </button>
                            </form>
                            <span className='text-sm font-semibold text-gray-700 whitespace-nowrap'>
                                Tiến độ kiểm tra: <span className='text-primary-600 font-bold'>{totalChecked} / {selectedPackage.products.totalItems}</span>
                            </span>
                        </div>
                    </div>

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                <List className='w-5 h-5 text-primary-500' />
                            </span>
                            Danh sách sản phẩm
                        </h3>
                            <ProductList
                                products={selectedPackage.products}
                                showStatus={true}
                                checkedProducts={checkedProducts}
                                showPagination={true}
                                onPageChange={handlePageChange}
                                maxHeight={240}
                            />
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-4 border-t border-primary-100 bg-white'>
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
