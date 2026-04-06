'use client';

import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { useVehicleContext, VehicleStatusFilter } from '@/contexts/collection-point/VehicleContext';
import VehicleFilter from '@/components/collection-point/vehicle/VehicleFilter';
import VehicleList from '@/components/collection-point/vehicle/VehicleList';
import VehicleDetail from '@/components/collection-point/vehicle/modal/VehicleDetail';
import VehicleApprove from '@/components/collection-point/vehicle/modal/VehicleApprove';
import VehicleBlock from '@/components/collection-point/vehicle/modal/VehicleBlock';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { VehicleItem } from '@/services/collection-point/VehicleService';

const VehiclePage: React.FC = () => {
    const { vehicles, loading, actionLoading, fetchVehicles, approveVehicle, blockVehicle, page, totalPages, setPage } = useVehicleContext();
    const [filterStatus, setFilterStatus] = useState<VehicleStatusFilter>('Đang hoạt động');
    const [search, setSearch] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [pendingApproveId, setPendingApproveId] = useState<string | null>(null);
    const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchVehicles(filterStatus, page, ITEMS_PER_PAGE, search.trim());
    }, [fetchVehicles, filterStatus, page, search]);

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
                <div className='flex-1 max-w-md ml-6'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm biển số, loại xe...'
                    />
                </div>
            </div>

            {/* Filter */}
            <VehicleFilter status={filterStatus} onFilterChange={handleFilterChange} />

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
        </div>
    );
};

export default VehiclePage;
