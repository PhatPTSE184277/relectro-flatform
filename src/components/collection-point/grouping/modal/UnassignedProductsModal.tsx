import React, { useState } from 'react';
import { X, AlertTriangle, Plus, Loader2, Pencil } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import UnassignedProductsFilter, {
    UNASSIGNED_PRODUCTS_DEFAULT_REASON,
    UnassignedProductsReasonOption
} from './UnassignedProductsFilter';
import ConfirmCloseModal from './ConfirmCloseModal';
import { formatAddress } from '@/utils/FormatAddress';

interface UnassignedProductsModalProps {
    open: boolean;
    onClose: () => void;
    products: any[];
    loading: boolean;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    totalCount: number;
    reasonOptions: UnassignedProductsReasonOption[];
    selectedReason: string;
    onReasonChange: (reason: string) => void;
    onEditDeadlineProduct?: (product: any) => void;
    editingDeadlineProductId?: string | null;
    deadlineUnassignedCount?: number;
    summaryMessage?: string;
    onAddRemainingVehicles: () => void;
    addVehiclesLoading?: boolean;
}

const UnassignedProductsModal: React.FC<UnassignedProductsModalProps> = ({
    open,
    onClose,
    products,
    loading,
    totalPages,
    currentPage,
    onPageChange,
    totalCount,
    reasonOptions,
    selectedReason,
    onReasonChange,
    onEditDeadlineProduct,
    editingDeadlineProductId,
    deadlineUnassignedCount = 0,
    summaryMessage,
    onAddRemainingVehicles,
    addVehiclesLoading = false
}) => {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const handleRequestClose = () => {
        if (deadlineUnassignedCount > 0) {
            setShowCloseConfirm(true);
            return;
        }

        onClose();
    };

    const handleConfirmClose = () => {
        setShowCloseConfirm(false);
        onClose();
    };

    const handleCancelClose = () => {
        setShowCloseConfirm(false);
    };

    const shouldShowDeadlineAction = selectedReason === UNASSIGNED_PRODUCTS_DEFAULT_REASON;

    const getPhoneNumber = (product: any): string => {
        return (
            product?.phoneNumber ||
            product?.phone ||
            product?.senderPhone ||
            product?.userPhone ||
            product?.sender?.phone ||
            'N/A'
        );
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={handleRequestClose}></div>

            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <AlertTriangle className='text-white' size={20} />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>Sản phẩm chưa được phân chia</h2>
                        </div>
                    </div>
                    <button
                        onClick={handleRequestClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Summary */}
                <div className='px-6 py-4 bg-primary-50 border-b border-primary-100 space-y-3'>
                    <div className='flex items-center justify-between gap-2 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <AlertTriangle size={16} className='text-primary-600' />
                            <span className='text-sm font-medium text-gray-700'>
                                {summaryMessage || (
                                    <>
                                        Tổng cộng: <span className='font-bold text-primary-600'>{totalCount}</span> sản phẩm chưa được phân chia
                                    </>
                                )}
                            </span>
                        </div>
                        <button
                            onClick={onAddRemainingVehicles}
                            disabled={addVehiclesLoading}
                            className={`px-4 py-2 rounded-lg border border-primary-200 bg-white text-primary-700 text-sm font-medium transition flex items-center gap-2 cursor-pointer ${addVehiclesLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-50'}`}
                        >
                            {addVehiclesLoading ? (
                                <Loader2 size={16} className='animate-spin' />
                            ) : (
                                <Plus size={16} />
                            )}
                            Thêm xe còn lại
                        </button>
                    </div>
                    <div>
                        <UnassignedProductsFilter
                            options={reasonOptions}
                            selectedReason={selectedReason}
                            onChangeReason={onReasonChange}
                        />
                    </div>
                </div>

                {/* Product List */}
                <div className='flex-1 overflow-hidden p-6'>
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
                        <div className='overflow-x-auto'>
                            <div className='inline-block w-full align-middle'>
                                <div className='overflow-hidden'>
                                    <div className='max-h-[45vh] overflow-y-auto'>
                                        <table className='w-full text-sm text-gray-800 table-fixed'>
                                            <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                                <tr>
                                                    <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                                    <th className='py-3 px-4 text-left w-[18vw]'>Sản phẩm</th>
                                                    <th className='py-3 px-4 text-left w-[14vw]'>SĐT</th>
                                                    <th className='py-3 px-4 text-left w-[22vw]'>Địa chỉ</th>
                                                    {shouldShowDeadlineAction && (
                                                        <th className='py-3 px-4 text-center w-[10vw]'>
                                                            <div className='w-full flex items-center justify-center'>
                                                               Hành động
                                                            </div>
                                                        </th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    Array.from({ length: 5 }).map((_, idx) => (
                                                        <tr key={idx} className='border-b border-primary-100'>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 w-8 bg-gray-200 rounded mx-auto animate-pulse' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 w-28 bg-gray-200 rounded animate-pulse' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 w-36 bg-gray-200 rounded animate-pulse' />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <div className='h-4 w-24 bg-gray-200 rounded ml-auto animate-pulse text-center' />
                                                            </td>
                                                            {shouldShowDeadlineAction && (
                                                                <td className='py-3 px-4 text-center'>
                                                                    <div className='h-8 w-8 bg-gray-200 rounded-full mx-auto animate-pulse' />
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : products?.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={shouldShowDeadlineAction ? 6 : 5}
                                                            className='text-center py-8 text-gray-400'
                                                        >
                                                            Không có sản phẩm chưa được phân chia.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((product, idx) => {
                                                        const stt = (currentPage - 1) * 10 + idx + 1;
                                                        const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                                        const productId = String(product?.productId || product?.id || '');

                                                        return (
                                                            <tr
                                                                key={`${productId}-${idx}`}
                                                                className={`${
                                                                    idx !== products.length - 1
                                                                        ? 'border-b border-primary-100'
                                                                        : ''
                                                                } ${rowBg}`}
                                                            >
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm inline-flex items-center justify-center font-semibold'>
                                                                        {stt}
                                                                    </span>
                                                                </td>
                                                                <td className='py-3 px-4 text-left'>
                                                                    {product?.categoryName || 'Không rõ'} - {product?.brandName || 'Không rõ'}
                                                                </td>
                                                                <td className='py-3 px-4 text-left'>
                                                                    {getPhoneNumber(product)}
                                                                </td>
                                                                <td className='py-3 px-4 text-left'>
                                                                    <div className='line-clamp-2'>
                                                                        {formatAddress(product?.address) || product?.address || 'N/A'}
                                                                    </div>
                                                                </td>
                                                                {shouldShowDeadlineAction && (
                                                                    <td className='py-3 px-4 text-center'>
                                                                        <button
                                                                            type='button'
                                                                            onClick={() => onEditDeadlineProduct?.(product)}
                                                                            disabled={editingDeadlineProductId === productId}
                                                                            className='mx-auto text-primary-600 hover:text-primary-800 flex items-center justify-center font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                                                                            title='Cập nhật QR và mô tả'
                                                                        >
                                                                            {editingDeadlineProductId === productId ? (
                                                                                <Loader2 size={16} className='animate-spin' />
                                                                            ) : (
                                                                                <Pencil size={18} />
                                                                            )}
                                                                        </button>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='px-6 pb-6'>
                        <Pagination
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}

            </div>
            <ConfirmCloseModal
                open={showCloseConfirm}
                deadlineUnassignedCount={deadlineUnassignedCount}
                onConfirm={handleConfirmClose}
                onClose={handleCancelClose}
            />
        </div>
    );
};

export default UnassignedProductsModal;
