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
import { Package, Plus } from 'lucide-react';

const ShipperPackagePage: React.FC = () => {
    const {
        packages,
        loading,
        selectedPackage,
        setSelectedPackage,
        filter,
        setFilter,
        totalPages,
        handleDeliverPackage,
        allStats
    } = useShipperPackageContext();

    const [search, setSearch] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showScanModal, setShowScanModal] = useState(false);

    const filteredPackages = packages.filter((pkg) => {
        const matchSearch =
            pkg.packageId.toLowerCase().includes(search.toLowerCase()) ||
            pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
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
    };

    const handleScanPackage = async (packageId: string) => {
        await handleDeliverPackage(packageId);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý Package
                    </h1>
                </div>
                
                <button
                    onClick={() => setShowScanModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md cursor-pointer'
                >
                    <Plus size={20} />
                    Quét mã giao hàng
                </button>
            </div>

            {/* Filter Section */}
            <div className='mb-6 space-y-4'>
                <PackageFilter
                    status={filter.status as PackageStatus || PackageStatus.Closed}
                    stats={allStats}
                    onFilterChange={(status: PackageStatus) => setFilter({ status, page: 1 })}
                />
                <div className='max-w-md'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm package...'
                    />
                </div>
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
                    package={selectedPackage}
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
