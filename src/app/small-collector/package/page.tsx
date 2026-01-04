'use client';

import React, { useState, useRef } from 'react';
import { usePackageContext } from '@/contexts/small-collector/PackageContext';
import PackageList from '@/components/small-collector/package/PackageList';
import PackageDetail from '@/components/small-collector/package/modal/PackageDetail';
import CreatePackage from '@/components/small-collector/package/modal/CreatePackage';
import UpdatePackage from '@/components/small-collector/package/modal/UpdatePackage';
import ConfirmStatusChange from '@/components/small-collector/package/modal/ConfirmStatusChange';
import PackageFilter from '@/components/small-collector/package/PackageFilter';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { Package } from 'lucide-react';
import type { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

const PackagePage: React.FC = () => {
    const {
        packages,
        loading,
        selectedPackage,
        setSelectedPackage,
        filter,
        setFilter,
        totalPages,
        allStats,
        createNewPackage,
        updateExistingPackage,
        updateStatus
    } = usePackageContext();

    const [search, setSearch] = useState('');
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [packageToUpdateStatus, setPackageToUpdateStatus] = useState<string | null>(null);

    const filteredPackages = packages.filter((pkg) => {
        const matchSearch =
            pkg.packageId.toLowerCase().includes(search.toLowerCase()) ||
            pkg.products.some(
                (p) =>
                    p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
                    p.brandName.toLowerCase().includes(search.toLowerCase())
            );
        return matchSearch;
    });

    const handleViewDetail = (pkg: PackageType) => {
        setSelectedPackage(pkg);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedPackage(null);
    };

    const handlePageChange = (page: number) => {
        setFilter({ page });
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCreatePackage = async (packageData: {
        packageId: string;
        // packageName: string; // Removed, not in PackageType
        productsQrCode: string[];
    }) => {
        try {
            const payload = {
                packageId: packageData.packageId,
                smallCollectionPointsId: String(filter.smallCollectionPointId || 1),
                productsQrCode: packageData.productsQrCode
            };
            await createNewPackage(payload);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating package:', error);
        }
    };

    const handleUpdatePackage = async (packageData: {
        // packageName: string; // Removed, not in PackageType
        productsQrCode: string[];
    }) => {
        if (!selectedPackage) return;
        try {
            const payload = {
                smallCollectionPointsId: String(filter.smallCollectionPointId || 1),
                productsQrCode: packageData.productsQrCode
            };
            await updateExistingPackage(selectedPackage.packageId, payload);
            setShowUpdateModal(false);
            setShowDetailModal(false);
            setSelectedPackage(null);
        } catch (error) {
            console.error('Error updating package:', error);
        }
    };

    const handleUpdateStatus = async (packageId: string) => {
        setPackageToUpdateStatus(packageId);
        setShowConfirmModal(true);
    };

    const handleConfirmUpdateStatus = async () => {
        if (!packageToUpdateStatus) return;
        try {
            await updateStatus(packageToUpdateStatus);
            setShowDetailModal(false);
            setSelectedPackage(null);
            setPackageToUpdateStatus(null);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleOpenUpdate = (pkg: PackageType) => {
        setSelectedPackage(pkg);
        setShowDetailModal(false);
        setShowUpdateModal(true);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý Package
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm package...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6'>
                <PackageFilter
                    status={filter.status as PackageStatus || PackageStatus.Packing}
                    stats={allStats}
                    onFilterChange={(status: PackageStatus) => setFilter({ status, page: 1 })}
                />
            </div>

            {/* Main Content: List */}
            <div className='mb-6'>
                <PackageList
                    packages={filteredPackages}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                    onUpdate={handleOpenUpdate}
                    onUpdateStatus={handleUpdateStatus}
                    ref={tableScrollRef}
                />
            </div>

            {/* Pagination */}
            <Pagination
                page={filter.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedPackage && (
                <PackageDetail
                    package={selectedPackage}
                    onClose={handleCloseModal}
                />
            )}

            {/* Create Package Modal */}
            <CreatePackage
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onConfirm={handleCreatePackage}
            />

            {/* Update Package Modal */}
            {showUpdateModal && selectedPackage && (
                <UpdatePackage
                    open={showUpdateModal}
                    onClose={() => {
                        setShowUpdateModal(false);
                        setSelectedPackage(null);
                    }}
                    onConfirm={handleUpdatePackage}
                    initialData={{
                        productsQrCode: selectedPackage.products.map(p => p.qrCode).filter(Boolean) as string[]
                    }}
                />
            )}

            {/* Confirm Status Change Modal */}
            <ConfirmStatusChange
                open={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setPackageToUpdateStatus(null);
                }}
                onConfirm={handleConfirmUpdateStatus}
            />
        </div>
    );
};

export default PackagePage;
