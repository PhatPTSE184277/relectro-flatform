'use client';

import React, { useState, useEffect } from 'react';
import { useVehicleContext } from '@/contexts/company/VehicleContext';
import VehicleList from '@/components/company/vehicle/VehicleList';
import VehicleDetail from '@/components/company/vehicle/modal/VehicleDetail';
import VehicleFilter, { VehicleStatus } from '@/components/company/vehicle/VehicleFilter';
import SearchBox from '@/components/ui/SearchBox';
import { Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const VehiclePage: React.FC = () => {
    const { user } = useAuth();
    const { vehicles, loading, fetchVehicles } = useVehicleContext();
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<VehicleStatus>('active');

    const companyId = user?.collectionCompanyId;

    useEffect(() => {
        if (companyId) {
            fetchVehicles({
                collectionCompanyId: companyId,
                status: filterStatus,
            });
        }
    }, [fetchVehicles, companyId, filterStatus]);

    const handleViewDetail = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedVehicle(null);
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        const searchLower = search.toLowerCase();
        return (
            vehicle.plateNumber?.toLowerCase().includes(searchLower) ||
            vehicle.vehicleType?.toLowerCase().includes(searchLower) ||
            vehicle.smallCollectionPointName?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:gap-6'>
                <div className='flex items-center gap-3 shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Truck className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý phương tiện
                    </h1>
                </div>
                <div className='flex-1 max-w-md w-full sm:ml-auto'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm biển số, loại xe...'
                    />
                </div>
            </div>

            {/* Filter */}
            <VehicleFilter
                status={filterStatus}
                onFilterChange={setFilterStatus}
            />

            {/* Vehicle List */}
            <VehicleList
                vehicles={filteredVehicles}
                loading={loading}
                onViewDetail={handleViewDetail}
            />

            {/* Detail Modal */}
            {showDetailModal && (
                <VehicleDetail
                    vehicle={selectedVehicle}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default VehiclePage;
