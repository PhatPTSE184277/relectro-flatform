'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useShiftContext } from '@/contexts/company/ShiftContext';
import ShiftList from '@/components/company/shift/ShiftList';
import ShiftDetail from '@/components/company/shift/modal/ShiftDetail';
import ShiftFilter, { ShiftStatus } from '@/components/company/shift/ShiftFilter';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import { CalendarClock, Download } from 'lucide-react';
import ImportShiftModal from '@/components/company/shift/modal/ImportShiftModal';
import { useAuth } from '@/hooks/useAuth';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const ShiftPage: React.FC = () => {
    const { user } = useAuth();
    const { shifts, loading, fetchShifts, importShifts, page, limit, totalPages, setPage } = useShiftContext();
    const [selectedShift, setSelectedShift] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ShiftStatus>('active');
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });

    const [fromDate, setFromDate] = useState<string>(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const year = firstDayOfMonth.getFullYear();
        const month = String(firstDayOfMonth.getMonth() + 1).padStart(2, '0');
        const day = String(firstDayOfMonth.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const [toDate, setToDate] = useState<string>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const companyId = user?.collectionCompanyId;

    const lastCoreFilterKeyRef = useRef<string>('');

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleFromDateChange = (nextFromDate: string) => {
        setPage(1);
        setFromDate(nextFromDate);
    };

    const handleToDateChange = (nextToDate: string) => {
        setPage(1);
        setToDate(nextToDate);
    };

    // Fetch when page or filters change.
    // Important: when core filters change, force page=1 FIRST, then fetch (avoid race fetching old page).
    useEffect(() => {
        if (!companyId || !fromDate || !toDate) return;

        const coreFilterKey = `${companyId}|${fromDate}|${toDate}|${filterStatus}|${limit}`;
        const coreFiltersChanged = coreFilterKey !== lastCoreFilterKeyRef.current;

        if (coreFiltersChanged) {
            lastCoreFilterKeyRef.current = coreFilterKey;
            if (page !== 1) {
                setPage(1);
                return;
            }
        }

        fetchShifts({
            page,
            limit,
            collectionCompanyId: companyId,
            fromDate,
            toDate,
            status: filterStatus,
        });
    }, [fetchShifts, companyId, fromDate, toDate, filterStatus, page, limit, setPage]);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const configs = await getActiveSystemConfigs('Excel');
                setTemplateUrl(pickExcelTemplateUrl(configs, ['ca lam', 'shift']));
            } catch {
                setTemplateUrl(null);
            }
        };

        void loadTemplate();
    }, []);

    const handleViewDetail = (shift: any) => {
        setSelectedShift(shift);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedShift(null);
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        if (!companyId) {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
            return false;
        }
        try {
            await importShifts(file);

            await fetchShifts({ 
                page,
                limit,
                collectionCompanyId: companyId,
                fromDate,
                toDate,
                status: filterStatus
            });
            setToast({ open: true, type: 'success', message: 'Thêm dữ liệu hoàn tất' });
            return true;
        } catch {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
            return false;
        }
    };

    const filteredShifts = shifts.filter((shift) => {
        const searchLower = search.toLowerCase();
        return (
            shift.collectorName?.toLowerCase().includes(searchLower) ||
            shift.plate_Number?.toLowerCase().includes(searchLower) ||
            shift.shiftId?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:gap-6'>
                <div className='flex items-center gap-3 shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <CalendarClock className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý ca làm việc
                    </h1>
                </div>
                <div className='flex-1 max-w-md w-full sm:ml-auto'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm ca, biển số, mã ca...'
                    />
                </div>
            </div>

            {/* Date Range Picker + Actions */}
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='min-w-fit'>
                    <CustomDateRangePicker
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={handleFromDateChange}
                        onToDateChange={handleToDateChange}
                    />
                </div>

                <div className='flex gap-3 w-full sm:w-auto justify-end'>
                    <a
                        href={templateUrl || '#'}
                        download
                        onClick={(e) => {
                            if (!templateUrl) e.preventDefault();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium shadow-sm whitespace-nowrap ${
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
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer whitespace-nowrap'
                        onClick={() => setShowImportModal(true)}
                    >
                        <IoCloudUploadOutline size={20} />
                        Nhập từ Excel
                    </button>
                </div>
            </div>

            {/* Filter */}
            <ShiftFilter
                status={filterStatus}
                onFilterChange={(nextStatus) => {
                    setFilterStatus(nextStatus);
                    setPage(1);
                }}
            />

            {/* Shift List */}
            <ShiftList
                shifts={filteredShifts}
                loading={loading}
                onViewDetail={handleViewDetail}
                page={page}
                limit={limit}
            />

            <Pagination page={page} totalPages={Number(totalPages)} onPageChange={handlePageChange} />

            {/* Detail Modal */}
            {showDetailModal && (
                <ShiftDetail
                    shift={selectedShift}
                    onClose={handleCloseModal}
                />
            )}

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportShiftModal
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

export default ShiftPage;
