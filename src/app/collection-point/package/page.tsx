'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePackageContext } from '@/contexts/collection-point/PackageContext';
import PackageList from '@/components/collection-point/package/PackageList';
import PackageDetail from '@/components/collection-point/package/modal/PackageDetail';
import ScanDeliveryQRModal from '@/components/collection-point/package/modal/ScanDeliveryQRModal';
import CreatePackage from '@/components/collection-point/package/modal/CreatePackage';
import UpdatePackage from '@/components/collection-point/package/modal/UpdatePackage';
import ConfirmStatusChange from '@/components/collection-point/package/modal/ConfirmStatusChange';
import PackageFilter from '@/components/collection-point/package/PackageFilter';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { Package, Plus, QrCode } from 'lucide-react';
import type { PackageType } from '@/types/Package';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';

const PackagePage: React.FC = () => {
    const {
        packages,
        loadingList,
        selectedPackage,
        setSelectedPackage,
        filter,
        setFilter,
        totalPages,
        allStats,
        createNewPackage,
        updateExistingPackage,
        updateStatus,
        fetchPackageDetail: fetchPackageDetailForPackage,
        fetchPackages
    } = usePackageContext();

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTrackingPackage, setSelectedTrackingPackage] = useState<PackageType | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [packageToUpdateStatus, setPackageToUpdateStatus] = useState<string | null>(null);
    const [showScanDeliveryModal, setShowScanDeliveryModal] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    const paginatedPackages = useMemo(
        () =>
            packages.map((pkg, idx) => ({
                ...pkg,
                stt: ((filter.page || 1) - 1) * (filter.limit || 10) + idx + 1
            })),
        [packages, filter.page, filter.limit]
    );

    const filteredPackages = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) return paginatedPackages;

        return paginatedPackages.filter((pkg) =>
            String(pkg?.packageId || '').toLowerCase().includes(keyword)
        );
    }, [paginatedPackages, searchKeyword]);

    const handleViewDetail = (pkg: PackageType) => {
        setSelectedTrackingPackage(pkg);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedTrackingPackage(null);
    };

    const isDeliveredFilter = (filter.status || 'Đã giao') === 'Đã giao';
    const showActionButtons = !isDeliveredFilter;

    const handlePageChange = useCallback((page: number) => {
        setFilter({ page });
    }, [setFilter]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchKeyword(value);
    }, []);

    const handleFromDateChange = useCallback((fromDate: string) => {
        setFilter({ fromDate, page: 1 });
    }, [setFilter]);

    const handleToDateChange = useCallback((toDate: string) => {
        setFilter({ toDate, page: 1 });
    }, [setFilter]);

    const handleStatusFilterChange = useCallback((status: string) => {
        setFilter({ status, page: 1 });
    }, [setFilter]);

    useEffect(() => {
        if (!filter.fromDate || !filter.toDate) {
            setFilter({
                fromDate: filter.fromDate || getFirstDayOfMonthString(),
                toDate: filter.toDate || getTodayString()
            });
        }
    }, [filter.fromDate, filter.toDate, setFilter]);

    // Ensure default status is 'Đang đóng gói' when first entering the page
    useEffect(() => {
        if (!filter.status || filter.status !== 'Đang đóng gói') {
            setFilter({ status: 'Đang đóng gói', page: 1 });
        }
    }, [filter.status, setFilter]);

    useEffect(() => {
        if (filter.packageId) {
            setFilter({ packageId: '' });
        }
    }, [filter.packageId, setFilter]);

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
            await fetchPackages({ page: filter.page || 1 });
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
            await fetchPackages({ page: filter.page || 1 });
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
            await fetchPackages({ page: filter.page || 1 });
            setShowDetailModal(false);
            setSelectedPackage(null);
            setPackageToUpdateStatus(null);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleOpenUpdate = async (pkg: PackageType) => {
        try {
            await fetchPackageDetailForPackage(pkg.packageId, 1, 1000);
            setShowDetailModal(false);
            setShowUpdateModal(true);
        } catch (error) {
            console.error('Error fetching package detail:', error);
        }
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:gap-6'>
                <div className='flex items-center gap-3 shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý kiện hàng
                    </h1>
                </div>
                <div className='flex-1 flex flex-wrap lg:flex-nowrap items-center gap-3 lg:justify-end'>
                    <div className='flex items-center gap-3 min-h-[42px] shrink-0'>
                        {showActionButtons && (
                            <>
                                <button
                                    onClick={() => setShowScanDeliveryModal(true)}
                                    className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md cursor-pointer whitespace-nowrap'
                                >
                                    <QrCode size={20} />
                                    Quét QR
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md cursor-pointer whitespace-nowrap'
                                >
                                    <Plus size={20} />
                                    Tạo kiện hàng
                                </button>
                            </>
                        )}
                        {isDeliveredFilter && (
                            <div className='min-w-fit'>
                                <CustomDateRangePicker
                                    fromDate={filter.fromDate || ''}
                                    toDate={filter.toDate || ''}
                                    onFromDateChange={handleFromDateChange}
                                    onToDateChange={handleToDateChange}
                                />
                            </div>
                        )}
                    </div>
                    <div className='w-full lg:w-lg lg:min-w-sm lg:max-w-lg lg:ml-auto'>
                        <SearchBox
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            placeholder='Tìm theo mã kiện hàng...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6'>
                <PackageFilter
                    status={filter.status || 'Đã giao'}
                    stats={allStats}
                    onFilterChange={handleStatusFilterChange}
                />
            </div>

            {/* Main Content: List */}
            <div className='mb-6'>
                <PackageList
                    packages={filteredPackages}
                    loading={loadingList}
                    onPackageClick={handleViewDetail}
                    onUpdatePackage={(pkg) => handleOpenUpdate(pkg as unknown as PackageType)}
                    onUpdateStatus={handleUpdateStatus}
                    showDeliveryTime={isDeliveredFilter}
                />
            </div>

            {/* Pagination */}
            <Pagination
                page={filter.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedTrackingPackage && (
                <PackageDetail
                    pkg={selectedTrackingPackage}
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
                        productsQrCode: selectedPackage.products.data.map(p => p.qrCode).filter(Boolean) as string[]
                    }}
                    maxHeight={56}
                />
            )}

            {/* Confirm Status Change Modal */}
            {(() => {
                const pkgForConfirm = packageToUpdateStatus
                    ? filteredPackages.find((p) => p.packageId === packageToUpdateStatus) as unknown as PackageType
                    : selectedPackage;

                return (
                    <ConfirmStatusChange
                        open={showConfirmModal}
                        onClose={() => {
                            setShowConfirmModal(false);
                            setPackageToUpdateStatus(null);
                        }}
                        onConfirm={handleConfirmUpdateStatus}
                        packageId={packageToUpdateStatus ?? pkgForConfirm?.packageId}
                        productCount={pkgForConfirm?.products?.totalItems}
                        status={pkgForConfirm?.status}
                    />
                );
            })()}

            <ScanDeliveryQRModal
                open={showScanDeliveryModal}
                onClose={() => setShowScanDeliveryModal(false)}
            />
        </div>
    );
};

export default PackagePage;
