'use client';

import React, { useState } from 'react';
import { useShipperPackageContext } from '@/contexts/shipper/PackageContext';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';
import PackageList from '@/components/shipper/package/PackageList';
import PackageDetail from '@/components/shipper/package/modal/PackageDetail';
import ScanPackageModal from '@/components/shipper/package/modal/ScanPackageModal';
import PackageFilter from '@/components/shipper/package/PackageFilter';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { Package, ScanLine } from 'lucide-react';

const ShipperPackagePage: React.FC = () => {
    const {
        packages,
        loading,
        selectedPackage,
        setSelectedPackage,
        filter,
        setFilter,
        totalPages,
        fetchPackageDetail,
        handleDeliverPackage,
        allStats
    } = useShipperPackageContext();

    const [search, setSearch] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showScanModal, setShowScanModal] = useState(false);

    const filteredPackages = packages.filter((pkg) => {
        const matchSearch =
            pkg.packageId.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleViewDetail = async (pkg: PackageType) => {
        setShowDetailModal(true);
        await fetchPackageDetail(pkg.packageId, 1, 10);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedPackage(null);
    };

    const handlePageChange = (page: number) => {
        setFilter({ page });
    };

    const handleScanPackage = async (packageId: string) => {
        await handleDeliverPackage(packageId);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý Package
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <button
                        onClick={() => setShowScanModal(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md cursor-pointer'
                    >
                        <ScanLine size={20} />
                        Quét mã giao hàng
                    </button>
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
            <div className='mb-6 space-y-4'>
                <PackageFilter
                    status={
                        (filter.status as PackageStatus) || PackageStatus.Closed
                    }
                    stats={allStats}
                    onFilterChange={(status: PackageStatus) =>
                        setFilter({ status, page: 1 })
                    }
                />
            </div>

            {/* Main Content: List */}
            <div className='mb-6'>
                <PackageList
                    packages={filteredPackages}
                    loading={loading}
                    onViewDetail={handleViewDetail}
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

                    onClose={handleCloseModal}
                />
            )}

            {/* Scan Package Modal */}
            <ScanPackageModal
                open={showScanModal}
                onClose={() => setShowScanModal(false)}
                onConfirm={handleScanPackage}
                title='Giao hàng'
                confirmText='Xác nhận giao'
            />
        </div>
    );
};

export default ShipperPackagePage;
