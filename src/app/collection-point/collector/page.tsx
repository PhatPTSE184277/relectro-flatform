'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCollectorContext } from '@/contexts/collection-point/CollectorContext';
import CollectorList from '@/components/collection-point/collector/CollectorList';
import CollectorDetail from '@/components/collection-point/collector/modal/CollectorDetail';
import SearchBox from '@/components/ui/SearchBox';
import { Users, Download } from 'lucide-react';
import ImportCollectorModal from '@/components/collection-point/collector/modal/ImportCollectorModal';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const CollectorPage: React.FC = () => {
    const { user } = useAuth();
    const { collectors, loading, fetchCollectors, importCollectors } = useCollectorContext();
    const [selectedCollector, setSelectedCollector] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });

    // Use smallCollectionPointId for new API endpoint `/collectors/collectionUnit/{id}`
    const smallCollectionPointId = user?.smallCollectionPointId;

    // Client-side pagination: fetch full list (use large limit) and paginate locally
    const ITEMS_PER_PAGE = 10;
    const [localPage, setLocalPage] = useState<number>(1);

    useEffect(() => {
        if (smallCollectionPointId) {
            // Request a large limit so we get all collectors for client-side pagination
            void fetchCollectors(String(smallCollectionPointId), 1, 1000);
        }
    }, [fetchCollectors, smallCollectionPointId]);

    // Keep local page within bounds when collectors change (avoid synchronous setState)

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

    const handleViewDetail = (collector: any) => {
        setSelectedCollector(collector);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedCollector(null);
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        if (!smallCollectionPointId) {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
            return false;
        }
        try {
            await importCollectors(file);

            // Refresh full list after import
            await fetchCollectors(String(smallCollectionPointId), 1, 1000);
            setToast({ open: true, type: 'success', message: 'Thêm dữ liệu hoàn tất' });
            return true;
        } catch {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
            return false;
        }
    };

    // local pagination handled by `setLocalPage` below

    const filteredCollectors = collectors.filter((collector) => {
        const searchLower = search.toLowerCase();
        return (
            collector.name?.toLowerCase().includes(searchLower) ||
            collector.email?.toLowerCase().includes(searchLower) ||
            collector.phone?.toLowerCase().includes(searchLower) ||
            collector.collectorId?.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil((collectors?.length || 0) / ITEMS_PER_PAGE) || 1;

    const paginatedCollectors = collectors.slice((localPage - 1) * ITEMS_PER_PAGE, localPage * ITEMS_PER_PAGE);

    // If current local page is out of range after collectors change, reset to 1
    // Schedule the state update asynchronously to avoid synchronous setState in effect
    useEffect(() => {
        if (localPage > totalPages) {
            const id = window.setTimeout(() => setLocalPage(1), 0);
            return () => clearTimeout(id);
        }
        return undefined;
    }, [localPage, totalPages]);

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Users className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Nhân viên thu gom
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
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

            {/* Collector List */}
            <CollectorList
                collectors={filteredCollectors.filter(c => paginatedCollectors.includes(c))}
                loading={loading}
                onViewDetail={handleViewDetail}
                page={localPage}
                limit={ITEMS_PER_PAGE}
            />

            {/* Pagination */}
            <Pagination
                page={localPage}
                totalPages={totalPages}
                onPageChange={(p) => { setLocalPage(p); }}
            />

            {/* Detail Modal */}
            {showDetailModal && (
                <CollectorDetail
                    collector={selectedCollector}
                    onClose={handleCloseModal}
                />
            )}

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportCollectorModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}

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
