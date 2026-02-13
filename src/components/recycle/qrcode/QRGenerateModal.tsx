'use client';

import React, { useRef } from 'react';
import { X, Download, QrCode as QrCodeIcon } from 'lucide-react';
import QRCode from 'react-qr-code';

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

    if (!open) return null;

    const handleDownloadQR = async () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        // Convert SVG to canvas
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
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

            // Download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `qr-code-${qrData?.qrCode || 'company'}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        };
        img.src = svgUrl;
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
                    <div className='p-6 border-t bg-white flex justify-end gap-3'>
                        <button
                            onClick={handleDownloadQR}
                            className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer flex items-center gap-2'
                        >
                            <Download size={18} />
                            Tải về
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

export default QRGenerateModal;
