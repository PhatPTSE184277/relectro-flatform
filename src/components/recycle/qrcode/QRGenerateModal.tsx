'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    ChevronDown,
    Download,
    Link2,
    Copy,
    QrCode as QrCodeIcon,
    Send,
    Share2,
    X
} from 'lucide-react';
import QRCode from 'react-qr-code';
import Toast from '@/components/ui/Toast';

interface QRGenerateModalProps {
    open: boolean;
    onClose: () => void;
    qrData: any;
    loading: boolean;
}

const QRGenerateModal: React.FC<QRGenerateModalProps> = ({
    open,
    onClose,
    qrData,
    loading
}) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{
        open: boolean;
        message: string;
        type?: 'success' | 'error';
    }>({ open: false, message: '', type: undefined });

    const showToast = (
        message: string,
        type: 'success' | 'error' = 'success'
    ) => {
        setToast({ open: true, message, type });
    };

    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    if (!open) return null;

    const getQRPngBlob = async (): Promise<Blob | null> => {
        if (!qrRef.current) return null;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return null;

        // Convert SVG to PNG blob so it can be downloaded or shared.
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8'
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();

        return await new Promise<Blob | null>((resolve) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

                URL.revokeObjectURL(svgUrl);
                canvas.toBlob((blob) => resolve(blob), 'image/png');
            };

            img.onerror = () => {
                URL.revokeObjectURL(svgUrl);
                resolve(null);
            };

            img.src = svgUrl;
        });
    };

    const handleDownloadQR = async () => {
        setMenuOpen(false);
        setActionLoading(true);
        const blob = await getQRPngBlob();
        setActionLoading(false);
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-code-${qrData?.qrCode || 'company'}.png`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleNativeShare = async () => {
        setMenuOpen(false);

        if (!navigator.share) {
            showToast(
                'Trình duyệt không hỗ trợ chia sẻ trực tiếp. Vui lòng chọn Zalo/Messenger hoặc Tải về.',
                'error'
            );
            return;
        }

        setActionLoading(true);
        const blob = await getQRPngBlob();
        setActionLoading(false);

        const fileName = `qr-code-${qrData?.qrCode || 'company'}.png`;
        const text = qrValue;

        try {
            if (blob) {
                const file = new File([blob], fileName, { type: 'image/png' });
                if (
                    navigator.canShare &&
                    navigator.canShare({ files: [file] })
                ) {
                    await navigator.share({
                        title: 'Mã QR',
                        text,
                        files: [file]
                    });
                    return;
                }
            }

                    await navigator.share({
                        title: 'Mã QR',
                        text
                    });
        } catch {
            // User canceled share dialog.
        }
    };

    // Removed Cloudinary upload and external share handlers — keep download, native share and copy only

    const handleCopyValue = async () => {
        setMenuOpen(false);
        try {
            await navigator.clipboard.writeText(qrValue);
            showToast('Đã sao chép mã QR.', 'success');
        } catch {
            showToast('Không thể sao chép. Vui lòng thử lại.', 'error');
        }
    };

    const handleCopyImage = async () => {
        setMenuOpen(false);
        setActionLoading(true);
        const blob = await getQRPngBlob();
        setActionLoading(false);
        if (!blob) {
            showToast('Không thể tạo ảnh QR để sao chép.', 'error');
            return;
        }

        try {
            if ((navigator as any).clipboard && (navigator as any).clipboard.write) {
                const item = new (window as any).ClipboardItem({ 'image/png': blob });
                await (navigator as any).clipboard.write([item]);
                showToast('Đã sao chép ảnh QR thành công.', 'success');
                return;
            }

            showToast('Trình duyệt không hỗ trợ sao chép ảnh. Vui lòng Tải về.', 'error');
        } catch (e) {
            console.log(e)
            showToast('Không thể sao chép ảnh. Vui lòng thử lại hoặc Tải về.', 'error');
        }
    };

    const qrValue = qrData?.qrCode || '';

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            {/* Modal container */}
            <div className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <QrCodeIcon className='text-white' size={20} />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            QR Code Công ty
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className='flex-1 p-8 flex flex-col items-center justify-center gap-6 bg-gray-50'>
                    {loading ? (
                        <div className='flex flex-col items-center gap-4'>
                            <div className='w-64 h-64 bg-gray-200 rounded-xl animate-pulse'></div>
                            <p className='text-gray-500'>Đang tạo QR Code...</p>
                        </div>
                    ) : qrValue ? (
                        <>
                            <div
                                ref={qrRef}
                                className='bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100'
                            >
                                <QRCode value={qrValue} size={256} />
                            </div>
                            <div className='text-center'>
                                <p className='text-sm text-gray-600 font-mono bg-gray-100 px-4 py-2 rounded-lg'>
                                    {qrValue}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className='text-center text-gray-500'>
                            <p>Không có dữ liệu QR</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && qrValue && (
                    <div className='p-5 border-t border-primary-100 bg-white flex justify-end gap-3'>
                        <div className='relative' ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                disabled={actionLoading}
                                className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-70 transition font-medium cursor-pointer flex items-center gap-2'
                            >
                                <Share2 size={18} />
                                {actionLoading
                                    ? 'Đang xử lý...'
                                    : 'Tải/Chia sẻ'}
                                <ChevronDown size={16} />
                            </button>

                            {menuOpen && (
                                <div className='absolute right-0 bottom-12 w-60 bg-white border border-gray-200 shadow-xl rounded-lg py-2 z-20'>
                                    <button
                                        onClick={handleDownloadQR}
                                        className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer'
                                    >
                                        <Download size={16} />
                                        Tải về PNG
                                    </button>
                                    <button
                                        onClick={handleNativeShare}
                                        className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer'
                                    >
                                        <Send size={16} />
                                        Chia sẻ nhanh
                                    </button>
                                    <button
                                        onClick={handleCopyImage}
                                        className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer'
                                    >
                                        <Copy size={16} />
                                        Sao chép ảnh
                                    </button>
                                    <button
                                        onClick={handleCopyValue}
                                        className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer'
                                    >
                                        <Link2 size={16} />
                                        Sao chép mã QR
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Animation */}
            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
            />

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

export default QRGenerateModal;
