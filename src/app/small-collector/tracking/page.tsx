'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ScanSearch } from 'lucide-react';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import TrackingProductFilter from '@/components/small-collector/tracking/TrackingProductFilter';
import TrackingProductList from '@/components/small-collector/tracking/TrackingProductList';
import TrackingModal from '@/components/small-collector/tracking/modal/TrackingModal';
import { useTrackingContext } from '@/contexts/small-collector/TrackingContext';
import { TrackingPackageItem } from '@/types/Tracking';

const TrackingPage: React.FC = () => {
    const {
        packages,
        loadingPackages,
        totalPages,
        filter,
        setFilter,
        clearPackageDetail
    } = useTrackingContext();

    const [search, setSearch] = useState(filter.packageId || '');
    const [selectedPackage, setSelectedPackage] = useState<TrackingPackageItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const paginatedPackages = useMemo(
        () =>
            packages.map((pkg, idx) => ({
                ...pkg,
                stt: ((filter.page || 1) - 1) * (filter.limit || 10) + idx + 1
            })),
        [packages, filter.page, filter.limit]
    );

    // use stats provided by tracking context (fetched from API)
    const { stats } = useTrackingContext();

    const handleFilterChange = useCallback((status: string) => {
        setFilter({ status, page: 1 });
    }, [setFilter]);

    const handlePageChange = useCallback((page: number) => {
        setFilter({ page });
    }, [setFilter]);

    const handleFromDateChange = useCallback((fromDate: string) => {
        setFilter({ fromDate, page: 1 });
    }, [setFilter]);

    const handleToDateChange = useCallback((toDate: string) => {
        setFilter({ toDate, page: 1 });
    }, [setFilter]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setFilter({ packageId: value.trim(), page: 1 });
    }, [setFilter]);

    const handlePackageClick = useCallback((pkg: TrackingPackageItem) => {
        setSelectedPackage(pkg);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedPackage(null);
        clearPackageDetail();
    }, [clearPackageDetail]);

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col gap-4 mb-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <ScanSearch className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>Theo dõi kiện hàng</h1>
                    </div>

                    <div className='flex gap-3 items-center flex-1 justify-end'>
                        <div className='w-full max-w-md'>
                            <SearchBox
                                value={search}
                                onChange={handleSearchChange}
                                placeholder='Tìm theo mã kiện hàng...'
                            />
                        </div>
                        <div className='min-w-fit'>
                            <CustomDateRangePicker
                                fromDate={filter.fromDate || ''}
                                toDate={filter.toDate || ''}
                                onFromDateChange={handleFromDateChange}
                                onToDateChange={handleToDateChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='mb-6'>
                <TrackingProductFilter
                    status={filter.status || 'Đang vận chuyển'}
                    stats={stats}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className='mb-6'>
                <TrackingProductList
                    packages={paginatedPackages}
                    loading={loadingPackages}
                    onPackageClick={handlePackageClick}
                />
            </div>

            <div className='flex justify-end'>
                <Pagination
                    page={filter.page || 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {showModal && selectedPackage && (
                <TrackingModal
                    pkg={selectedPackage}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default TrackingPage;
