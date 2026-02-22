'use client';
import React, { useState, useEffect } from 'react';
import { X, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import CustomTextarea from '@/components/ui/CustomTextarea';
import { isValidSystemQRCode } from '@/utils/qr';

interface SeedQRModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (qrCodes: string[]) => Promise<void>;
    selectedCount: number;
}

const SeedQRModal: React.FC<SeedQRModalProps> = ({
    open,
    onClose,
    onConfirm,
    selectedCount
}) => {
    const [qrInput, setQrInput] = useState('');
    const [validQRs, setValidQRs] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setQrInput('');
            setValidQRs([]);
            setErrors([]);
        }
    }, [open]);

    // Validate QR codes in real-time
    useEffect(() => {
        const lines = qrInput.split('\n').map(line => line.trim()).filter(Boolean);
        const valid: string[] = [];
        const errorMessages: string[] = [];

        lines.forEach((line, idx) => {
            if (!/^[0-9]{13}$/.test(line)) {
                errorMessages.push(`Dòng ${idx + 1}: Mã QR phải là số gồm 13 ký tự`);
            } else if (!isValidSystemQRCode(line)) {
                errorMessages.push(`Dòng ${idx + 1}: Chỉ được sử dụng mã QR do hệ thống tạo ra`);
            } else if (valid.includes(line)) {
                errorMessages.push(`Dòng ${idx + 1}: Mã QR trùng lặp`);
            } else {
                valid.push(line);
            }
        });

        setValidQRs(valid);
        setErrors(errorMessages);
    }, [qrInput]);

    // Auto insert newline after every 13 digits to help data entry
    const handleQrChange = (val: string) => {
        // normalize CRLF
        let v = val.replace(/\r/g, '');
        // insert newline after each 13-digit group that isn't already followed by a newline
        v = v.replace(/(\d{13})(?!\n)/g, '$1\n');
        // collapse multiple blank lines
        v = v.replace(/\n{2,}/g, '\n');
        setQrInput(v);
    };

    const handleSubmit = async () => {
        if (validQRs.length === 0) {
            return;
        }

        if (validQRs.length !== selectedCount) {
            setErrors([`Số lượng mã QR (${validQRs.length}) phải bằng số sản phẩm đã chọn (${selectedCount})`]);
            return;
        }

        setLoading(true);
        try {
            await onConfirm(validQRs);
            handleClose();
        } catch (error: any) {
            console.error('Seed QR error:', error);
            setErrors([error?.message || 'Có lỗi xảy ra khi gán mã QR']);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setQrInput('');
        setValidQRs([]);
        setErrors([]);
        onClose();
    };

    const isFormValid = validQRs.length > 0 && validQRs.length === selectedCount && errors.length === 0;

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <QrCode className='text-white' size={20} />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-gray-900'>Gán QR Code</h2>
                            <p className='text-sm text-gray-600'>
                                Nhập {selectedCount} mã QR (mỗi mã một dòng)
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
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>

                    {/* QR Input */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-semibold text-gray-700'>
                            Danh sách mã QR <span className='text-red-500'>*</span>
                        </label>
                        <CustomTextarea
                            value={qrInput}
                            onChange={handleQrChange}
                            placeholder={`Nhập ${selectedCount} mã QR, mỗi mã trên một dòng...\nVí dụ:\n1234567890123\n1234567890124\n1234567890125`}
                            rows={8}
                            className='font-mono text-sm'
                            autoFocus={true}
                        />
                    </div>

                    {/* Validation Status */}
                    <div className='flex items-center justify-between gap-4'>
                        {/* Valid count */}
                        <div className='flex items-center gap-2'>
                            {validQRs.length > 0 && (
                                <div className='flex items-center gap-2 text-sm'>
                                    <CheckCircle className='text-green-500' size={18} />
                                    <span className='text-gray-700'>
                                        <span className='font-semibold text-green-600'>{validQRs.length}</span>
                                        {' / '}
                                        <span className='font-semibold text-primary-600'>{selectedCount}</span>
                                        {' mã hợp lệ'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Error indicator */}
                        {errors.length > 0 && (
                            <div className='flex items-center gap-2 text-sm text-red-600'>
                                <AlertCircle size={18} />
                                <span className='font-medium'>{errors.length} lỗi</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white shadow-md transition ${
                            isFormValid && !loading
                                ? 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                                : 'bg-primary-300 cursor-not-allowed'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <QrCode size={18} />
                                Xác nhận gán
                            </>
                        )}
                    </button>
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

export default SeedQRModal;
