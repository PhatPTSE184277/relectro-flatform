import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import CustomTextarea from '@/components/ui/CustomTextarea';

interface RejectAssignmentModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    loading?: boolean;
    productCount: number;
    workDate: string;
}

const RejectAssignmentModal: React.FC<RejectAssignmentModalProps> = ({
    open,
    onClose,
    onConfirm,
    loading = false,
    productCount,
    workDate
}) => {
    const [reason, setReason] = useState('');
    const REASON_TAGS = [
        'Kho đã đầy',
        'Không đủ phương tiện',
        'Lịch trình không khả dụng',
        'Khác'
    ];
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState('');

    const handleClose = () => {
        setReason(''); // Reset reason when closing
        setSelectedTags([]);
        setCustomReason('');
        onClose();
    };

    if (!open) return null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={handleClose}></div>

            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-red-50 to-orange-50 border-red-100'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-xl font-bold text-gray-900'>Từ chối nhận hàng</h2>
                            <p className='text-sm text-gray-600'>Ngày: {formatDate(workDate)}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='p-2 hover:bg-white/50 rounded-full transition-colors'
                        disabled={loading}
                    >
                        <X size={24} className='text-gray-600' />
                    </button>
                </div>

                {/* Summary */}
                <div className='px-6 py-4 bg-red-50 border-b border-red-100'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle size={16} className='text-red-600' />
                        <span className='text-sm font-medium text-gray-700'>
                            Bạn đang từ chối nhận <span className='font-bold text-red-600'>{productCount}</span> sản phẩm được phân bổ
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor='reason' className='block text-sm font-medium text-gray-700 mb-2'>
                                Lý do từ chối <span className='text-red-500'>*</span>
                            </label>
                            <div>
                                <div className='flex flex-wrap gap-2 mb-2 items-center'>
                                    {REASON_TAGS.slice(0, 3).map((tag) => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                type='button'
                                                key={tag}
                                                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer
                                                  ${isSelected ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'}`}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag]);
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className='flex gap-2 mb-2'>
                                    {(() => {
                                        const tag = REASON_TAGS[3];
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                type='button'
                                                key={tag}
                                                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer
                                                  ${isSelected ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'}`}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                                        setCustomReason('');
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag]);
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })()}
                                </div>

                                {selectedTags.includes('Khác') && (
                                    <CustomTextarea
                                        value={customReason}
                                        onChange={setCustomReason}
                                        placeholder='Nhập lý do từ chối...'
                                        rows={4}
                                        disabled={loading}
                                    />
                                )}
                                <div className='flex justify-between items-center mt-1'>
                                    <p className='text-xs text-gray-500'>Lý do sẽ được gửi tới admin</p>
                                    <p className='text-xs text-gray-500'>{(selectedTags.includes('Khác') ? customReason.length : reason.length)}/500</p>
                                </div>
                            </div>
                        </div>

                        {/* Warning block removed as requested */}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex items-center justify-end gap-3 p-6 border-t bg-gray-50'>
                    <button
                        onClick={() => {
                            // compose reason from tags
                            const reasons = selectedTags.filter(t => t !== 'Khác');
                            if (selectedTags.includes('Khác')) {
                                if (customReason.trim()) reasons.push(customReason.trim());
                            }
                            const finalReason = reasons.join('; ') || reason.trim();
                            if (finalReason) {
                                onConfirm(finalReason);
                                setSelectedTags([]);
                                setCustomReason('');
                                setReason('');
                            }
                        }}
                        disabled={
                            loading || (
                                selectedTags.length === 0 || (selectedTags.includes('Khác') && !customReason.trim())
                            )
                        }
                        className={`px-6 py-2.5 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200
                          ${(selectedTags.length === 0 || (selectedTags.includes('Khác') && !customReason.trim()))
                            ? 'bg-primary-300 cursor-not-allowed'
                            : 'bg-primary-500 hover:bg-primary-600'}`}
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin text-white" />
                        ) : (
                            'Xác nhận'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectAssignmentModal;
