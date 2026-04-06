'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Download } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useVehicleContext, VehicleStatusFilter } from '@/contexts/collection-point/VehicleContext';
import VehicleFilter from '@/components/collection-point/vehicle/VehicleFilter';
import VehicleList from '@/components/collection-point/vehicle/VehicleList';
import VehicleDetail from '@/components/collection-point/vehicle/modal/VehicleDetail';
import VehicleApprove from '@/components/collection-point/vehicle/modal/VehicleApprove';
import VehicleBlock from '@/components/collection-point/vehicle/modal/VehicleBlock';
import ImportVehicleModal from '@/components/collection-point/vehicle/modal/ImportVehicleModal';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';
import { VehicleItem } from '@/services/collection-point/VehicleService';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const VehiclePage: React.FC = () => {
    const { vehicles, loading, actionLoading, fetchVehicles, approveVehicle, blockVehicle, importVehicles, page, totalPages, setPage, stats } = useVehicleContext();
    const [filterStatus, setFilterStatus] = useState<VehicleStatusFilter>('Đang hoạt động');
    const [search, setSearch] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [pendingApproveId, setPendingApproveId] = useState<string | null>(null);
    const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchVehicles(filterStatus, page, ITEMS_PER_PAGE, search.trim());
    }, [fetchVehicles, filterStatus, page, search]);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const configs = await getActiveSystemConfigs('Excel');
                setTemplateUrl(pickExcelTemplateUrl(configs, ['phuong tien', 'vehicle']));
            } catch {
                setTemplateUrl(null);
            }
        };

        void loadTemplate();
    }, []);

    const handleFilterChange = (status: VehicleStatusFilter) => {
        setFilterStatus(status);
    };

    const handleViewDetail = (vehicle: VehicleItem) => {
        setSelectedVehicle(vehicle);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        setSelectedVehicle(null);
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        try {
            await importVehicles(file);
            await fetchVehicles(filterStatus, page, ITEMS_PER_PAGE, search.trim());
            setToast({ open: true, type: 'success', message: 'Thêm dữ liệu hoàn tất' });
            return true;
        } catch {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
            return false;
        }
    };

    useEffect(() => {
        setPage(1);
    }, [filterStatus, search, setPage]);

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Truck className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Quản lý phương tiện</h1>
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
                            placeholder='Tìm kiếm biển số, loại xe...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter */}
            <VehicleFilter
                status={filterStatus}
                stats={{ active: stats.active, inactive: stats.inactive }}
                onFilterChange={handleFilterChange}
            />

            {/* List */}
            <VehicleList
                vehicles={vehicles}
                loading={loading}
                onViewDetail={handleViewDetail}
                onApprove={(id) => setPendingApproveId(id)}
                onBlock={(id) => setPendingBlockId(id)}
                actionLoading={actionLoading}
                page={page}
                limit={ITEMS_PER_PAGE}
            />

            <div className="mt-4">
                <Pagination
                    page={page}
                    totalPages={Math.max(1, totalPages)}
                    onPageChange={setPage}
                />
            </div>

            {/* Detail modal */}
            {showDetail && (
                <VehicleDetail vehicle={selectedVehicle} onClose={handleCloseDetail} />
            )}

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportVehicleModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}

            {/* Confirm approve (from table row) */}
            <VehicleApprove
                open={!!pendingApproveId}
                onClose={() => setPendingApproveId(null)}
                onConfirm={async () => {
                    if (pendingApproveId) await approveVehicle(pendingApproveId);
                    setPendingApproveId(null);
                }}
                loading={actionLoading}
            />

            {/* Confirm block (from table row) */}
            <VehicleBlock
                open={!!pendingBlockId}
                onClose={() => setPendingBlockId(null)}
                onConfirm={async () => {
                    if (pendingBlockId) await blockVehicle(pendingBlockId);
                    setPendingBlockId(null);
                }}
                loading={actionLoading}
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

export default VehiclePage;
