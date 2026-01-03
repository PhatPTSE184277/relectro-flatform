'use client';

import React, { useState, useEffect } from 'react';
import { useVehicleContext } from '@/contexts/company/VehicleContext';
import VehicleList from '@/components/company/vehicle/VehicleList';
import VehicleDetail from '@/components/company/vehicle/modal/VehicleDetail';
import ImportVehicleModal from '@/components/company/vehicle/modal/ImportVehicleModal';
import VehicleFilter, { VehicleStatus } from '@/components/company/vehicle/VehicleFilter';
import SearchBox from '@/components/ui/SearchBox';
import { Truck } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';

const VehiclePage: React.FC = () => {
    const { user } = useAuth();
    const { vehicles, loading, fetchVehicles, importVehicles } = useVehicleContext();
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
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

    const handleImportExcel = async (file: File) => {
        if (!companyId) {
            return;
        }
        try {
            await importVehicles(file);
            await fetchVehicles({
                collectionCompanyId: companyId,
                status: filterStatus,
            });
        } catch (error) {
            console.log(error);
        }
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

            {/* Header + Import + Search */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Truck className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý phương tiện
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
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
                            placeholder='Tìm kiếm biển số, loại xe...'
                        />
                    </div>
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

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportVehicleModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}

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
