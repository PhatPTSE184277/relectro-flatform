import React, { useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { isValidSystemQRCode } from '@/utils/qr';
import { checkProductQRCodeExists } from '@/services/collection-point/IWProductService';

interface DeadlineProductUpdateModalProps {
    open: boolean;
    product: any | null;
    loading?: boolean;
    onClose: () => void;
    onConfirm: (payload: { productId: string; qrCode: string; description: string }) => Promise<void>;
    showPhoneNumber?: boolean;
}

const DeadlineProductUpdateModal: React.FC<DeadlineProductUpdateModalProps> = ({
    open,
    product,
    loading = false,
    onClose,
    onConfirm,
    showPhoneNumber = false
}) => {
    const [qrCode, setQrCode] = useState('');
    const [description, setDescription] = useState(() => String(product?.description || '').trim());
    const [submitError, setSubmitError] = useState('');
    const [qrExists, setQrExists] = useState(false);
    const [checkingQrExists, setCheckingQrExists] = useState(false);

    const productId = useMemo(
        () => String(product?.productId || product?.id || ''),
        [product]
    );

    const normalizedQr = qrCode.trim();
    let qrError = '';
    if (normalizedQr) {
        if (!/^[0-9]{13}$/.test(normalizedQr)) {
            qrError = 'Mã QR phải là số gồm 13 ký tự (mã hệ thống tạo ra)!';
        } else if (!isValidSystemQRCode(normalizedQr)) {
            qrError = 'Chỉ được sử dụng mã QR do hệ thống tạo ra trong hôm qua hoặc hôm nay!';
        } else if (qrExists) {
            qrError = 'Mã QR này đã có sản phẩm sử dụng!';
        }
    }

    if (!open || !product) return null;

    const validateQrNotUsed = async (qr: string): Promise<boolean> => {
        try {
            return await checkProductQRCodeExists(qr);
        } catch {
            setSubmitError('Lỗi khi kiểm tra mã QR');
            return false;
        }
    };

    const handleQrBlur = async () => {
        const qr = qrCode.trim();
        if (!qr || !/^[0-9]{13}$/.test(qr) || !isValidSystemQRCode(qr)) {
            setQrExists(false);
            setCheckingQrExists(false);
            return;
        }

        setCheckingQrExists(true);
        try {
            const exists = await validateQrNotUsed(qr);
            setQrExists(exists);
        } finally {
            setCheckingQrExists(false);
        }
    };

    const handleConfirm = async () => {
        const normalizedDescription = description.trim();

        if (!normalizedQr) {
            setSubmitError('Vui lòng nhập mã QR sản phẩm!');
            return;
        }

        if (!isValidSystemQRCode(normalizedQr)) {
            setSubmitError('Chỉ được sử dụng mã QR do hệ thống tạo ra!');
            return;
        }

        const exists = await validateQrNotUsed(normalizedQr);
        if (exists) {
            setQrExists(true);
            setSubmitError('Mã QR này đã có sản phẩm sử dụng!');
            return;
        }

        if (!normalizedDescription) {
            setSubmitError('Vui lòng nhập mô tả.');
            return;
        }

        setSubmitError('');
        await onConfirm({
            productId,
            qrCode: normalizedQr,
            description: normalizedDescription
        });
    };

    return (
        <div className='fixed inset-0 z-70 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' onClick={onClose} />

            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10'>
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900'>Cập nhật sản phẩm hạn chót</h2>
                        <div className='text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2'>
                            <span>{product?.categoryName || 'Không rõ'} - {product?.brandName || 'Không rõ'}</span>
                            {showPhoneNumber && (product?.phoneNumber || product?.phone) && (
                                <span className='text-primary-700'>SĐT: {product?.phoneNumber || product?.phone}</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={26} />
                    </button>
                </div>

                <div className='p-6 space-y-4 bg-gray-50'>
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-gray-700'>Mã QR</label>
                        <input
                            value={qrCode}
                            onChange={(e) => {
                                setQrCode(e.target.value);
                                setQrExists(false);
                                setSubmitError('');
                            }}
                            onBlur={() => {
                                void handleQrBlur();
                            }}
                            placeholder='Nhập mã QR của sản phẩm'
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white ${
                                qrError || submitError ? 'border-red-500' : 'border-primary-300'
                            }`}
                        />
                        <div className='min-h-[18px]'>
                            {checkingQrExists && !qrError && !submitError && (
                                <div className='text-xs text-gray-500'>Đang kiểm tra QR đã tồn tại...</div>
                            )}
                            {!checkingQrExists && qrExists && !qrError && !submitError && (
                                <div className='text-xs text-red-600'>Mã QR này đã có sản phẩm sử dụng!</div>
                            )}
                        </div>
                    </div>

                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-gray-700'>Mô tả</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Nhập mô tả xử lý sản phẩm hạn chót'
                            rows={4}
                            className='px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 resize-none w-full'
                        />
                    </div>

                    <div className='min-h-[20px]'>
                        {(qrError || submitError) && <p className='text-sm text-red-600'>{qrError || submitError}</p>}
                    </div>
                </div>

                <div className='flex justify-end gap-3 p-5 border-t border-gray-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className='px-5 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2'
                    >
                        {loading ? <Loader2 size={16} className='animate-spin' /> : null}
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeadlineProductUpdateModal;
