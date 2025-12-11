'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useShiftContext } from '@/contexts/company/ShiftContext';
import ShiftList from '@/components/company/shift/ShiftList';
import ShiftDetail from '@/components/company/shift/modal/ShiftDetail';
import ShiftFilter, { ShiftStatus } from '@/components/company/shift/ShiftFilter';
import SearchBox from '@/components/ui/SearchBox';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import { toast } from 'react-toastify';
import { CalendarClock } from 'lucide-react';
import ImportShiftModal from '@/components/company/shift/modal/ImportShiftModal';
import { useAuth } from '@/hooks/useAuth';

const ShiftPage: React.FC = () => {
    const { user } = useAuth();
    const { shifts, loading, fetchShifts, importShifts } = useShiftContext();
    const [selectedShift, setSelectedShift] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ShiftStatus>('active');

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

    // fromDate/toDate are initialized lazily above to avoid synchronous setState in effect

    useEffect(() => {
        if (companyId && fromDate && toDate) {
            fetchShifts({ 
                collectionCompanyId: companyId,
                fromDate,
                toDate,
                status: filterStatus === 'active' ? 'Active' : 'InActive'
            });
        }
    }, [fetchShifts, companyId, fromDate, toDate, filterStatus]);

    const handleViewDetail = (shift: any) => {
        setSelectedShift(shift);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedShift(null);
    };

    const handleImportExcel = async (file: File) => {
        if (!companyId) {
            toast.error('Không tìm thấy thông tin công ty');
            return;
        }
        try {
            await importShifts(file);
            toast.success('Import thành công');
            await fetchShifts({ 
                collectionCompanyId: companyId,
                fromDate,
                toDate,
                status: filterStatus === 'active' ? 'Active' : 'InActive'
            });
        } catch (error) {
            console.log(error);
            toast.error('Import thất bại');
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
                <div className='max-w-xl w-full'>
                    <CustomDateRangePicker
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                    />
                </div>

                <div className='flex gap-3 w-full sm:w-auto justify-end'>
                    <button
                        type='button'
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer whitespace-nowrap'
                        onClick={() => setShowImportModal(true)}
                    >
                        <IoCloudUploadOutline size={20} />
                        Import từ Excel
                    </button>
                </div>
            </div>

            {/* Filter */}
            <ShiftFilter
                status={filterStatus}
                onFilterChange={setFilterStatus}
            />

            {/* Shift List */}
            <ShiftList
                shifts={filteredShifts}
                loading={loading}
                onViewDetail={handleViewDetail}
            />

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
        </div>
    );
};

export default ShiftPage;
