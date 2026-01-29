import React from 'react';
import { X, Package, Calendar, List } from 'lucide-react';
import { formatDate } from '@/utils/FormatDate';
import SummaryCard from '@/components/ui/SummaryCard';

interface DistributeProductConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    workDate: string;
    productCount: number;
    loading?: boolean;
}

const DistributeProductConfirmModal: React.FC<DistributeProductConfirmModalProps> = ({
    open,
    onClose,
    onConfirm,
    workDate,
    productCount,
    loading = false
}) => {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Package className='text-white' size={20} />
                        </div>
                        <h2 className='text-xl font-bold text-gray-900'>
                            Xác nhận chia sản phẩm
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className='text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}

                <div className='p-6 space-y-4'>
                    <SummaryCard
                        items={[
                            {
                                label: 'Ngày chia',
                                value: formatDate(workDate),
                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><Calendar className="w-4 h-4 text-primary-500" /></span>
                            },
                            {
                                label: 'Số lượng sản phẩm',
                                value: productCount,
                                icon: <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200"><List className="w-4 h-4 text-primary-500" /></span>
                            }
                        ]}
                    />
                    <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                        <p className='text-sm text-amber-800'>
                            <span className='font-semibold'>Lưu ý:</span> Tất cả {productCount} sản phẩm chưa được chia sẽ được xử lý tự động bởi hệ thống.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t bg-gray-50'>

                    <button
                        onClick={onConfirm}
                        disabled={loading || productCount === 0}
                        className='px-6 py-2.5 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2 min-w-[120px] cursor-pointer'
                    >
                        {loading ? (
                            <>
                                <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DistributeProductConfirmModal;
