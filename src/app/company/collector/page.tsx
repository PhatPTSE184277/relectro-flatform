'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCollectorContext } from '@/contexts/company/CollectorContext';
import CollectorList from '@/components/company/collector/CollectorList';
import CollectorDetail from '@/components/company/collector/modal/CollectorDetail';
import SearchBox from '@/components/ui/SearchBox';
import { Users, Download } from 'lucide-react';
import ImportCollectorModal from '@/components/company/collector/modal/ImportCollectorModal';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const CollectorPage: React.FC = () => {
    const { user } = useAuth();
    const { collectors, loading, fetchCollectors, importCollectors, page, limit, total, setPage } = useCollectorContext();
    const [selectedCollector, setSelectedCollector] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });

    const companyId = user?.collectionCompanyId;

    useEffect(() => {
        if (companyId) {
            fetchCollectors(companyId, page, limit);
        }
    }, [fetchCollectors, companyId, page, limit]);

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
        if (!companyId) {
            setToast({ open: true, type: 'error', message: 'Không xác định được công ty để import.' });
            return false;
        }
        try {
            const res = await importCollectors(file);
            const isSuccess = Boolean(res?.success);
            const messages = Array.isArray(res?.messages)
                ? res.messages.filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
                : [];

            if (!isSuccess || messages.length > 0) {
                setToast({
                    open: true,
                    type: 'error',
                    message:
                        messages.length > 0
                            ? messages.join('\n')
                            : (res?.message || 'Import thất bại. Vui lòng kiểm tra lại file Excel.')
                });
                return false;
            }

            await fetchCollectors(companyId, page, limit);
            return true;
        } catch (error) {
            const errMessage =
                typeof error === 'object' && error !== null && 'response' in error
                    ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Import thất bại. Vui lòng thử lại.')
                    : 'Import thất bại. Vui lòng thử lại.';
            setToast({ open: true, type: 'error', message: errMessage });
            return false;
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
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

    const totalPages = Math.ceil(total / limit);

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
                        Import từ Excel
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
                collectors={filteredCollectors}
                loading={loading}
                onViewDetail={handleViewDetail}
                page={page}
                limit={limit}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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
