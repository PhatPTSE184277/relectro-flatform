'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Package as PackageIcon, X, Info, List } from 'lucide-react';
import { toast } from 'react-toastify';
import { getPackageById } from '@/services/shipper/PackageService';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';
import PackageInfoCard from './PackageInfoCard';
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
    title,
    confirmText
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
            toast.warning('Vui lòng nhập mã package');
            return;
        }

        setLoading(true);
        try {
            const pkg = await getPackageById(trimmedId);
            
            // Check if package status is valid for delivery
            if (pkg.status !== PackageStatus.Closed) {
                toast.error('Package này chưa được đóng gói');
                setPackageId('');
                inputRef.current?.focus();
                return;
            }

            setScannedPackage(pkg);
            toast.success('Đã quét package thành công');
        } catch (err: any) {
            console.error('Scan QR error', err);
            toast.error(
                err?.response?.data?.message ||
                    'Không tìm thấy package với mã này'
            );
            setPackageId('');
            inputRef.current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!scannedPackage) {
            toast.warning('Vui lòng quét mã package trước');
            return;
        }

        onConfirm(scannedPackage.packageId);
        handleClose();
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
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className={`relative w-full ${scannedPackage ? 'max-w-6xl' : 'max-w-xl'} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh] animate-fadeIn transition-all duration-300`}> 
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            {title}
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Quét mã package để xác nhận giao hàng
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
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50'>
                    {/* Mã package - chỉ hiện khi chưa quét */}
                    {!scannedPackage && (
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
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
                                    {loading ? 'Đang tìm...' : 'Ok'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Scanned Package Info */}
                    {scannedPackage && (
                        <>
                            {/* Package Info Title */}
                            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                    <Info className='w-5 h-5 text-primary-500' />
                                </span>
                                Thông tin package
                            </h3>
                            <PackageInfoCard pkg={scannedPackage} />

                            {/* Products List */}
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <List className='w-5 h-5 text-primary-500' />
                                    </span>
                                    Danh sách sản phẩm
                                </h3>
                                <ProductList products={scannedPackage.products} />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center gap-3 p-5 border-t border-gray-100 bg-white'>
                    <div className='flex justify-end w-full'>
                        <button
                            onClick={handleSubmit}
                            disabled={!scannedPackage || loading}
                            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer shadow-lg shadow-primary-500/30 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none'
                        >
                            {confirmText}
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

export default ScanPackageModal;
