'use client';

import React, { useEffect, useRef, useState } from 'react';
import { QrCode, X, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import PackageList from '@/components/small-collector/package/modal/PackageList';
import Toast from '@/components/ui/Toast';
import { useSmallCollectorQR } from '@/contexts/small-collector/QRContext';
import { usePackageContext } from '@/contexts/small-collector/PackageContext';
import { filterPackages } from '@/services/small-collector/PackageService';
import { useAuth } from '@/redux';
import type { PackageType } from '@/types/Package';

interface ScanDeliveryQRModalProps {
    open: boolean;
    onClose: () => void;
}

const ScanDeliveryQRModal: React.FC<ScanDeliveryQRModalProps> = ({ open, onClose }) => {
    const { user } = useAuth();
    const { verify, verifying } = useSmallCollectorQR();
    const { handleDeliverPackages } = usePackageContext();

    const [qrCode, setQrCode] = useState('');
    const [companyInfo, setCompanyInfo] = useState<any | null>(null);
    const [closedPackages, setClosedPackages] = useState<PackageType[]>([]);
    const [scanned, setScanned] = useState<boolean>(false);
    const [loadingPackages, setLoadingPackages] = useState(false);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setQrCode('');
            setCompanyInfo(null);
            setClosedPackages([]);
            setScanned(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const loadClosedPackages = async () => {
        if (!user?.smallCollectionPointId) return;
        setLoadingPackages(true);
        try {
            const res = await filterPackages({
                page: 1,
                limit: 100,
                smallCollectionPointId: String(user.smallCollectionPointId),
                status: 'Đã đóng thùng'
            });
            setClosedPackages(res.data || []);
        } catch (e: any) {
            showToast(e?.message || 'Không tải được danh sách gói', 'error');
        } finally {
            setLoadingPackages(false);
        }
    };

    const handleScanQR = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = qrCode.trim();
        if (!code) return;

        try {
            const res = await verify(code);
            setCompanyInfo(res);
            await loadClosedPackages();
            // auto-select all packages (no manual selection UI)
            // we rely on closedPackages state when confirming
            setScanned(true);
        } catch (e: any) {
            const rawMsg = e?.response?.data?.message || e?.message || 'QR không hợp lệ';
            const translations: Record<string, string> = {
                'Invalid or expired QR code.': 'Mã QR không hợp lệ hoặc đã hết hạn',
                'Invalid or expired QR code': 'Mã QR không hợp lệ hoặc đã hết hạn',
                'QR is invalid': 'Mã QR không hợp lệ',
                'Not found': 'Không tìm thấy',
            };
            let msg: string = typeof rawMsg === 'string' ? rawMsg : 'QR không hợp lệ';
            for (const key in translations) {
                if (typeof rawMsg === 'string' && rawMsg.includes(key)) {
                    msg = translations[key];
                    break;
                }
            }
            showToast(msg, 'error');
            setCompanyInfo(null);
            setClosedPackages([]);
        } finally {
            setQrCode('');
        }
    };

    const handleConfirm = async () => {
        if (!closedPackages || closedPackages.length === 0) {
            showToast('Không có gói để giao', 'error');
            return;
        }
        const ids = closedPackages.map((p) => p.packageId);
        await handleDeliverPackages(ids);
        showToast('Đã xác nhận giao hàng', 'success');
        onClose();
    };

    if (!open) return null;

    const summaryItems = companyInfo
        ? [
              { label: 'Tên công ty', value: companyInfo.name },
              { label: 'Địa chỉ', value: companyInfo.city }
          ]
        : [];

    return (
        <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4'>
            <Toast open={toastOpen} type={toastType} message={toastMessage} onClose={() => setToastOpen(false)} />
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />

            <div className={`relative w-full ${scanned ? 'max-w-5xl' : 'max-w-3xl'} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[96vh] animate-fadeIn transition-all duration-300`}>
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <QrCode className='text-white' size={20} />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900'>Quét QR giao hàng</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-2xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='p-6 space-y-6 bg-gray-50 overflow-y-auto'>
                    {!scanned && (
                        <form onSubmit={handleScanQR} className='flex gap-3 items-center'>
                            <div className='relative flex-1'>
                                <input
                                    ref={inputRef}
                                    value={qrCode}
                                    onChange={(e) => setQrCode(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-gray-900'
                                    placeholder='Nhập mã QR công ty...'
                                    autoComplete='off'
                                />
                                <QrCode className='absolute left-3 top-1/2 -translate-y-1/2 text-primary-400' size={18} />
                            </div>
                            <button
                                type='submit'
                                disabled={verifying}
                                aria-label='Quét'
                                className='px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer disabled:opacity-50 flex items-center justify-center'
                            >
                                {verifying ? (
                                    <Loader2 className='animate-spin w-5 h-5' />
                                ) : (
                                    <ArrowRight className='w-5 h-5' />
                                )}
                            </button>
                        </form>
                    )}

                    {/* Hiện thông tin tóm tắt và danh sách chỉ khi quét thành công */}
                    {scanned && companyInfo && (
                        <SummaryCard items={summaryItems} singleRow={true} label={'Thông tin công ty'} />
                    )}

                    {scanned ? (
                        <PackageList
                            packages={closedPackages}
                            loading={loadingPackages}
                        />
                    ) : null}
                </div>
                {scanned ? (
                    <div className='p-6 border-t bg-white flex justify-end gap-3'>
                        <button
                            onClick={handleConfirm}
                            className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer flex items-center gap-2'
                        >
                            <CheckCircle2 size={18} />
                            Xác nhận giao hàng
                        </button>
                    </div>
                ) : null}
            </div>

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

export default ScanDeliveryQRModal;
