'use client';

import React, { useState } from 'react';
import { TicketPercent, Plus, Download, Upload } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import VoucherFilter from '@/components/admin/voucher/VoucherFilter';
import VoucherList from '@/components/admin/voucher/VoucherList';
import VoucherDetail from '@/components/admin/voucher/modal/VoucherDetail';
import VoucherCreate from '@/components/admin/voucher/modal/VoucherCreate';
import ImportVoucherModal from '@/components/admin/voucher/modal/ImportVoucherModal';
import VoucherBlock from '@/components/admin/voucher/modal/VoucherBlock';
import VoucherApprove from '@/components/admin/voucher/modal/VoucherApprove';
import Toast from '@/components/ui/Toast';
import { useVoucherContext } from '@/contexts/admin/VoucherContext';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const VoucherPage: React.FC = () => {
    const {
        vouchers,
        loading,
        actionLoading,
        creating,
        page,
        limit,
        totalPages,
        setPage,
        fetchVouchers,
        fetchVoucherById,
        createVoucherItem,
        importFromExcel,
        activateVoucher,
        deactivateVoucher,
        status,
        setStatus,
        stats,
    } = useVoucherContext();

    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);
    const [pendingApproveId, setPendingApproveId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });

    React.useEffect(() => {
        setStatus('Hoạt động');
        setPage(1);
        fetchVouchers(1, undefined, 'Hoạt động');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const loadTemplate = async () => {
            try {
                const configs = await getActiveSystemConfigs('Excel');
                setTemplateUrl(pickExcelTemplateUrl(configs, ['voucher']));
            } catch {
                setTemplateUrl(null);
            }
        };

        void loadTemplate();
    }, []);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchVouchers(newPage, undefined, status);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setPage(1);
        fetchVouchers(1, undefined, newStatus);
    };

    const getVoucherId = (voucher: any): string | null => {
        const id = voucher?.id ?? voucher?.voucherId;
        return id ? String(id) : null;
    };

    const handleToggleVoucher = async (voucherId: string, isActive: boolean) => {
        try {
            if (isActive) {
                await deactivateVoucher(voucherId);
                setToast({ open: true, type: 'success', message: 'Khóa voucher thành công' });
            } else {
                await activateVoucher(voucherId);
                setToast({ open: true, type: 'success', message: 'Mở khóa voucher thành công' });
            }
        } catch {
            setToast({ open: true, type: 'error', message: 'Thao tác thất bại' });
        } finally {
            setPendingBlockId(null);
            setPendingApproveId(null);
        }
    };

    const handleViewDetail = async (voucher: any) => {
        const id = voucher?.id ?? voucher?.voucherId;
        if (!id) {
            setSelectedVoucher(voucher);
            setShowDetailModal(true);
            return;
        }

        try {
            const res = await fetchVoucherById(id);
            setSelectedVoucher(res || voucher);
        } catch {
            setSelectedVoucher(voucher);
        }
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedVoucher(null);
    };

    const handleCreateVoucher = async (payload: any): Promise<boolean> => {
        const res = await createVoucherItem(payload);
        if (!res) {
            setToast({
                open: true,
                type: 'error',
                message: 'Tạo voucher thất bại'
            });
            return false;
        }

        setToast({
            open: true,
            type: 'success',
            message: 'Tạo voucher thành công'
        });
        return true;
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        try {
            await importFromExcel(file);
            setToast({
                open: true,
                type: 'success',
                message: 'Nhập voucher từ Excel thành công'
            });
            setShowImportModal(false);
            return true;
        } catch (error) {
            setToast({
                open: true,
                type: 'error',
                message: 'Nhập voucher từ Excel thất bại'
            });
            return false;
        }
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <TicketPercent className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Quản lý voucher</h1>
                </div>
                <div className='flex gap-4 items-center'>
                    <a
                        href={templateUrl || '#'}
                        download
                        onClick={(e) => {
                            if (!templateUrl) e.preventDefault();
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border transition font-medium shadow-sm ${
                            templateUrl
                                ? 'border-primary-300 text-primary-600 hover:bg-primary-50'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Download size={20} />
                        Tải file mẫu
                    </a>
                    <button
                        type='button'
                        className='flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
                        onClick={() => setShowImportModal(true)}
                    >
                        <Upload size={20} />
                        Nhập từ Excel
                    </button>
                    {/* <button
                        type='button'
                        className='flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={20} />
                        Tạo voucher
                    </button> */}
                </div>
            </div>

            <VoucherFilter
                status={status}
                stats={{ active: stats.active, inactive: stats.inactive }}
                onStatusChange={handleStatusChange}
            />

            <VoucherList
                vouchers={vouchers}
                loading={loading}
                onViewDetail={handleViewDetail}
                onBlock={(voucher) => setPendingBlockId(getVoucherId(voucher))}
                onApprove={(voucher) => setPendingApproveId(getVoucherId(voucher))}
                actionLoading={actionLoading}
                status={status}
                page={page}
                limit={limit}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

            <VoucherBlock
                open={!!pendingBlockId}
                loading={actionLoading}
                onClose={() => setPendingBlockId(null)}
                onConfirm={async () => {
                    if (pendingBlockId) {
                        await handleToggleVoucher(pendingBlockId, true);
                    }
                }}
            />

            <VoucherApprove
                open={!!pendingApproveId}
                loading={actionLoading}
                onClose={() => setPendingApproveId(null)}
                onConfirm={async () => {
                    if (pendingApproveId) {
                        await handleToggleVoucher(pendingApproveId, false);
                    }
                }}
            />

            {showDetailModal && selectedVoucher && (
                <VoucherDetail voucher={selectedVoucher} onClose={handleCloseModal} />
            )}

            {showCreateModal && (
                <VoucherCreate
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateVoucher}
                    creating={creating}
                />
            )}

            {showImportModal && (
                <ImportVoucherModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}

            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            />
        </div>
    );
};

export default VoucherPage;
