'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Package as PackageIcon, X, List, ArrowRight, Tag, ListCheck, Truck } from 'lucide-react';
import { getPackageById } from '@/services/shipper/PackageService';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from './ProductList';

interface ScanPackageModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (packageId: string) => void;
    title: string;
    confirmText: string;
}

const ScanPackageModal: React.FC<ScanPackageModalProps> = ({
    open,
    onClose,
    onConfirm,
}) => {
    const [packageId, setPackageId] = useState('');
    const [scannedPackage, setScannedPackage] = useState<PackageType | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setPackageId('');
            setScannedPackage(null);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleScanQR = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedId = packageId.trim();

        if (!trimmedId) {
            setTimeout(() => inputRef.current?.focus(), 0);
            return;
        }

        setLoading(true);
        try {
            const pkg = await getPackageById(trimmedId);
            // Check if package status is valid for delivery
            if (pkg.status !== PackageStatus.Closed) {
                setPackageId('');
                setTimeout(() => inputRef.current?.focus(), 0);
                return;
            }

            setScannedPackage(pkg);
        } catch (err: any) {
            console.error('Scan QR error', err);
            setPackageId('');
            setTimeout(() => inputRef.current?.focus(), 0);
        } finally {
            setTimeout(() => inputRef.current?.focus(), 0);
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPackageId('');
        setScannedPackage(null);
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
            <div className={`relative w-full ${scannedPackage ? 'max-w-6xl' : 'max-w-xl'} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh] animate-fadeIn transition-all duration-300`}> 
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Quét mã package
                        </h2>
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
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50'>
                    {/* Mã package - chỉ hiện khi chưa quét */}
                    {!scannedPackage && (
                        <>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Mã package{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <form onSubmit={handleScanQR} className='flex gap-2'>
                                <div className='relative flex-1'>
                                    <input
                                        ref={inputRef}
                                        type='text'
                                        value={packageId}
                                        onChange={(e) => setPackageId(e.target.value)}
                                        placeholder='Nhập mã package...'
                                        disabled={loading}
                                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                        autoComplete='off'
                                    />
                                    <PackageIcon
                                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-600'
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
                        </>
                    )}

                    {/* Scanned Package Info */}
                    {scannedPackage && (
                        <>
                            {/* SummaryCard for package info */}
                            {(() => {
                                const summaryItems = [
                                    {
                                        icon: <span className="w-8 h-8 flex items-center justify-center rounded-full border border-primary-200 bg-primary-50"><Tag size={14} className='text-primary-400' /></span>,
                                        label: 'Mã package',
                                        value: scannedPackage.packageId,
                                    },{
                                        icon: <span className="w-8 h-8 flex items-center justify-center rounded-full border border-primary-200 bg-primary-50"><ListCheck size={14} className='text-primary-400' /></span>,
                                        label: 'Số sản phẩm',
                                        value: scannedPackage.products.length,
                                    },
                                    {
                                        icon: <span className="w-8 h-8 flex items-center justify-center rounded-full border border-primary-200 bg-primary-50"><Truck size={14} className='text-primary-400' /></span>,
                                        label: 'Trạng thái',
                                        value: (
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                                    scannedPackage.status === PackageStatus.Packing
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : scannedPackage.status === PackageStatus.Closed
                                                        ? 'bg-green-100 text-green-700'
                                                        : scannedPackage.status === PackageStatus.Shipping
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : scannedPackage.status === PackageStatus.Recycling
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {scannedPackage.status}
                                            </span>
                                        ),
                                    },
                                ];
                                return <SummaryCard items={summaryItems} singleRow={true} />;
                            })()}

                            {/* Products List */}
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <List className='w-5 h-5 text-primary-500' />
                                    </span>
                                    Danh sách sản phẩm
                                </h3>
                                <div className='overflow-y-auto max-h-64'>
                                    <ProductList products={scannedPackage.products} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer: confirm button only when scannedPackage exists */}
                {scannedPackage && (
                    <div className='flex justify-end items-center gap-3 p-5 border-t border-gray-100 bg-white'>
                        <button
                            onClick={() => {
                                if (scannedPackage) {
                                    onConfirm(scannedPackage.packageId);
                                    handleClose();
                                }
                            }}
                            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 flex items-center gap-2'
                        >
                            Xác nhận giao
                        </button>
                    </div>
                )}
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

export default ScanPackageModal;
