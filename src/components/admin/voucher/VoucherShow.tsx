import React from 'react';
import { Eye, Ban, CheckCircle } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';

interface VoucherShowProps {
    voucher: any;
    onView: () => void;
    onApprove: () => void;
    onBlock: () => void;
    actionLoading: boolean;
    filterStatus?: string;
    index?: number;
    isLast?: boolean;
}

const VoucherShow: React.FC<VoucherShowProps> = ({ voucher, onView, onApprove, onBlock, actionLoading, filterStatus, index, isLast = false }) => {
    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    const statusText = String(voucher?.status || '').trim().toLowerCase();
    const isActiveByFilter = filterStatus === 'Hoạt động' ? true : filterStatus === 'Không hoạt động' ? false : undefined;
    const isActiveByData =
        voucher?.isActive === true ||
        voucher?.active === true ||
        voucher?.isActivated === true ||
        statusText === 'hoạt động' ||
        statusText.includes('hoạt động');
    const isActive = isActiveByFilter ?? isActiveByData;

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-16'>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {typeof index === 'number' ? formatNumber(index + 1) : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900'>{voucher?.code || 'Không rõ'}</td>
            <td className='py-3 px-4 text-gray-700'>{voucher?.name || 'Không rõ'}</td>
            <td className='py-3 px-4 text-right text-gray-700'>{voucher?.quantity ?? 0}</td>
            <td className='py-3 px-4 text-right text-gray-700'>{voucher?.value ?? 0}</td>
            <td className='py-3 px-4 text-right text-gray-700'>{voucher?.pointsToRedeem ?? 0}</td>
            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>

                    {isActive ? (
                        <button
                            onClick={onBlock}
                            disabled={actionLoading}
                            className='text-red-500 hover:text-red-700 disabled:opacity-40 transition cursor-pointer'
                            title='Khóa'
                        >
                            <Ban size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={onApprove}
                            disabled={actionLoading}
                            className='text-green-500 hover:text-green-700 disabled:opacity-40 transition cursor-pointer'
                            title='Mở khóa'
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default VoucherShow;
