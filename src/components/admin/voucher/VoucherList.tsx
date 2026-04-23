import React from 'react';
import VoucherShow from './VoucherShow';
import VoucherTableSkeleton from './VoucherTableSkeleton';

interface VoucherListProps {
    vouchers: any[];
    loading: boolean;
    onViewDetail: (voucher: any) => void;
    onApprove: (voucher: any) => void;
    onBlock: (voucher: any) => void;
    actionLoading: boolean;
    status?: string;
    page?: number;
    limit?: number;
}

const VoucherList: React.FC<VoucherListProps> = ({ vouchers, loading, onViewDetail, onApprove, onBlock, actionLoading, status, page = 1, limit = 10 }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <div className='max-h-95 overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                            <tr>
                                <th className='py-3 px-4 text-center w-16'>STT</th>
                                <th className='py-3 px-4 text-left w-40'>Mã voucher</th>
                                <th className='py-3 px-4 text-left w-48'>Tên voucher</th>
                                <th className='py-3 px-4 text-right w-28'>Giá trị</th>
                                <th className='py-3 px-4 text-right w-32'>Điểm đổi</th>
                                <th className='py-3 px-4 text-center w-28'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => <VoucherTableSkeleton key={idx} />)
                            ) : vouchers.length > 0 ? (
                                vouchers.map((voucher, idx) => (
                                    <VoucherShow
                                        key={voucher?.id || `${voucher?.code}-${idx}`}
                                        voucher={voucher}
                                        onView={() => onViewDetail(voucher)}
                                        onApprove={() => onApprove(voucher)}
                                        onBlock={() => onBlock(voucher)}
                                        actionLoading={actionLoading}
                                        filterStatus={status}
                                        isLast={idx === vouchers.length - 1}
                                        index={(page - 1) * limit + idx}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center py-8 text-gray-400'>
                                        Không có voucher nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VoucherList;
