'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MapPin, Download } from 'lucide-react';
import { useSmallCollectionContext } from '@/contexts/company/SmallCollectionContext';
import SmallCollectionList from '@/components/company/small-collection/SmallCollectionList';
import SmallCollectionDetail from '@/components/company/small-collection/modal/SmallCollectionDetail';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import ImportSmallCollectionModal from '@/components/company/small-collection/modal/ImportSmallCollectionModal';
import SmallCollectionFilter from '@/components/company/small-collection/SmallCollectionFilter';
import { SmallCollectionPoint } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const SmallCollectionPage: React.FC = () => {
    const { user } = useAuth();
    const {
        smallCollections,
        loading,
        importSmallCollection,
        fetchSmallCollections,
        fetchSmallCollectionById,
        pageInfo
    } = useSmallCollectionContext();

    const [selectedSmallCollection, setSelectedSmallCollection] =
        useState<SmallCollectionPoint | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('active');
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'success',
        message: ''
    });

    const companyId = user?.collectionCompanyId;

    useEffect(() => {
        if (!companyId) return;
        // Gọi rõ ràng từ page để tải danh sách (cùng tham số với context)
        fetchSmallCollections({ companyId, page: 1, limit: 10 }).catch(() => {});
    }, [companyId, fetchSmallCollections]);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const configs = await getActiveSystemConfigs('Excel');
                setTemplateUrl(
                    pickExcelTemplateUrl(configs, ['kho', 'small collection', 'diem thu gom'])
                );
            } catch {
                setTemplateUrl(null);
            }
        };

        void loadTemplate();
    }, []);
    const handleViewDetail = async (point: SmallCollectionPoint) => {
        try {
            const res = await fetchSmallCollectionById(point.id);
            setSelectedSmallCollection(res || point);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setSelectedSmallCollection(point);
        }
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedSmallCollection(null);
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        if (!companyId) {
            setToast({
                open: true,
                type: 'error',
                message: 'Không xác định được công ty để import.'
            });
            return false;
        }
        try {
            const res = await importSmallCollection(file);
            const isSuccess = Boolean(res?.success);
            const messages = Array.isArray(res?.messages)
                ? res.messages.filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
                : [];

            // If API marked overall success but returned messages (warnings/errors per row),
            // treat as partial failure so user can review/fix the file.
            if (!isSuccess) {
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

            if (messages.length > 0) {
                // Partial success: some rows imported, some rows had issues.
                setToast({
                    open: true,
                    type: 'error',
                    message: messages.join('\n')
                });
                // do not close modal — let user fix file and re-import
                return false;
            }

            // Fully successful import: close modal silently (no success toast)
            await fetchSmallCollections({ companyId, page: 1, limit: 10 });
            return true;
        } catch (error) {
            const errMessage =
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                    : 'Import thất bại. Vui lòng thử lại.';

            setToast({
                open: true,
                type: 'error',
                message: errMessage || 'Import thất bại. Vui lòng thử lại.'
            });
            return false;
        }
    };

    const filteredCollections = smallCollections.filter((point) => {
        const searchLower = search.toLowerCase();
        const matchSearch =
            point.name?.toLowerCase().includes(searchLower) ||
            point.address?.toLowerCase().includes(searchLower);
        if (filterStatus === 'active') {
            return matchSearch && point.status === 'DANG_HOAT_DONG';
        }
        if (filterStatus === 'inactive') {
            return matchSearch && point.status !== 'DANG_HOAT_DONG';
        }
        return matchSearch;
    });

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <MapPin className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Điểm thu gom nhỏ
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
                            placeholder='Tìm kiếm điểm thu gom...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6'>
                <SmallCollectionFilter status={filterStatus} onFilterChange={setFilterStatus} />
            </div>

            {/* Main Content: List */}
            <SmallCollectionList
                collections={filteredCollections}
                loading={loading}
                onViewDetail={handleViewDetail}
                page={pageInfo?.page ?? 1}
                limit={pageInfo?.limit ?? 10}
            />

            {/* Pagination */}
            {pageInfo && pageInfo.totalPages > 1 && (
                <Pagination
                    page={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    onPageChange={(p) => {
                        if (!companyId) return;
                        void fetchSmallCollections({ companyId, page: p, limit: pageInfo.limit });
                    }}
                />
            )}

            {/* Detail Modal */}
            {showDetailModal && (
                <SmallCollectionDetail
                    point={selectedSmallCollection}
                    onClose={handleCloseModal}
                />
            )}

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportSmallCollectionModal
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

export default SmallCollectionPage;
