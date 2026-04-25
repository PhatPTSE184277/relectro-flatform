'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Users, Download } from 'lucide-react';
import { useCollectorContext, type CollectorStatusFilter } from '@/contexts/collection-point/CollectorContext';
import CollectorList from '@/components/collection-point/collector/CollectorList';
import CollectorFilter from '@/components/collection-point/collector/CollectorFilter';
import CollectorBlock from '@/components/collection-point/collector/modal/CollectorBlock';
import CollectorApprove from '@/components/collection-point/collector/modal/CollectorApprove';
import SearchBox from '@/components/ui/SearchBox';
import ImportCollectorModal from '@/components/collection-point/collector/modal/ImportCollectorModal';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const CollectorPage: React.FC = () => {
    const {
        collectors,
        loading,
        actionLoading,
        fetchCollectors,
        importCollectors,
        activateCollector,
        deactivateCollector,
        page,
        totalPages,
        setPage,
        stats,
    } = useCollectorContext();
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<CollectorStatusFilter>('Đang hoạt động');
    const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);
    const [pendingActivateId, setPendingActivateId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        void fetchCollectors(filterStatus, page, ITEMS_PER_PAGE, true);
    }, [fetchCollectors, filterStatus, page]);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const configs = await getActiveSystemConfigs('Excel');
                setTemplateUrl(pickExcelTemplateUrl(configs, ['nhan vien', 'collector']));
            } catch {
                setTemplateUrl(null);
            }
        };

        void loadTemplate();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [filterStatus, search, setPage]);

    const handleFilterChange = (status: CollectorStatusFilter) => {
        setFilterStatus(status);
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        try {
            await importCollectors(file);
            void fetchCollectors(filterStatus, page, ITEMS_PER_PAGE, true);
            setToast({ open: true, type: 'success', message: 'Thêm dữ liệu hoàn tất' });
            return true;
        } catch {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
            return false;
        }
    };

    const filteredCollectors = collectors.filter((collector) => {
        const searchLower = search.toLowerCase();
        return (
            collector.name?.toLowerCase().includes(searchLower) ||
            collector.email?.toLowerCase().includes(searchLower) ||
            collector.phone?.toLowerCase().includes(searchLower) ||
            collector.collectorId?.toLowerCase().includes(searchLower)
        );
    });

    const handleToggleCollector = async (collectorId: string, isActive: boolean) => {
        try {
            if (isActive) {
                await deactivateCollector(collectorId);
                setToast({ open: true, type: 'success', message: 'Khóa nhân viên thu gom thành công' });
            } else {
                await activateCollector(collectorId);
                setToast({ open: true, type: 'success', message: 'Mở khóa nhân viên thu gom thành công' });
            }
        } catch {
            setToast({ open: true, type: 'error', message: 'Thao tác thất bại' });
        } finally {
            setPendingBlockId(null);
            setPendingActivateId(null);
        }
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Users className='text-white' size={20} />
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900'>
                            Nhân viên thu gom
                        </h1>
                    </div>
                </div>
                <div className='flex gap-3 items-center flex-1 justify-end'>
                    <a
                        href={templateUrl || '#'}
                        download
                        onClick={(e) => {
                            if (!templateUrl) e.preventDefault();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium shadow-sm ${
                            templateUrl
                                ? 'border-primary-300 text-primary-600 hover:bg-primary-50'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Download size={18} />
                        Tải file mẫu
                    </a>
                    <button
                        type='button'
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
                        onClick={() => setShowImportModal(true)}
                    >
                        <IoCloudUploadOutline size={20} />
                        Nhập từ Excel
                    </button>
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm nhân viên...'
                        />
                    </div>
                </div>
            </div>

            <CollectorFilter
                status={filterStatus}
                stats={{ active: stats.active, inactive: stats.inactive }}
                onFilterChange={handleFilterChange}
            />

            <div className='mt-6'>
                <CollectorList
                    collectors={filteredCollectors}
                    loading={loading}
                    filterStatus={filterStatus}
                    onBlock={(collector) => setPendingBlockId(collector.collectorId || null)}
                    onActivate={(collector) => setPendingActivateId(collector.collectorId || null)}
                    actionLoading={actionLoading}
                    page={page}
                    limit={ITEMS_PER_PAGE}
                />
            </div>

            <div className='mt-6'>
                <Pagination
                    page={page}
                    totalPages={Math.max(1, totalPages)}
                    onPageChange={setPage}
                />
            </div>

            {showImportModal && (
                <ImportCollectorModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}

            <CollectorBlock
                open={!!pendingBlockId}
                loading={actionLoading}
                onClose={() => setPendingBlockId(null)}
                onConfirm={async () => {
                    if (pendingBlockId) {
                        await handleToggleCollector(pendingBlockId, true);
                    }
                }}
            />

            <CollectorApprove
                open={!!pendingActivateId}
                loading={actionLoading}
                onClose={() => setPendingActivateId(null)}
                onConfirm={async () => {
                    if (pendingActivateId) {
                        await handleToggleCollector(pendingActivateId, false);
                    }
                }}
            />

            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
};

export default CollectorPage;
