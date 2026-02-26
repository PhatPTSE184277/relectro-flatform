'use client';

import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { useVehicleContext, VehicleStatusFilter } from '@/contexts/small-collector/VehicleContext';
import VehicleFilter from '@/components/small-collector/vehicle/VehicleFilter';
import VehicleList from '@/components/small-collector/vehicle/VehicleList';
import VehicleDetail from '@/components/small-collector/vehicle/modal/VehicleDetail';
import VehicleApprove from '@/components/small-collector/vehicle/modal/VehicleApprove';
import VehicleBlock from '@/components/small-collector/vehicle/modal/VehicleBlock';
import SearchBox from '@/components/ui/SearchBox';
import { VehicleItem } from '@/services/small-collector/VehicleService';

const VehiclePage: React.FC = () => {
    const { vehicles, loading, actionLoading, fetchVehicles, approveVehicle, blockVehicle } = useVehicleContext();
    const [filterStatus, setFilterStatus] = useState<VehicleStatusFilter>('Đang hoạt động');
    const [search, setSearch] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [pendingApproveId, setPendingApproveId] = useState<string | null>(null);
    const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);

    useEffect(() => {
        fetchVehicles(filterStatus);
    }, [fetchVehicles, filterStatus]);

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

    const filteredVehicles = vehicles.filter((v) => {
        const q = search.toLowerCase();
        return (
            v.plateNumber?.toLowerCase().includes(q) ||
            v.vehicleType?.toLowerCase().includes(q)
        );
    });

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
                vehicles={filteredVehicles}
                loading={loading}
                onViewDetail={handleViewDetail}
                onApprove={(id) => setPendingApproveId(id)}
                onBlock={(id) => setPendingBlockId(id)}
                actionLoading={actionLoading}
            />

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
