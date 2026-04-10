'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScanSearch } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import TrackingProductList from '@/components/admin/tracking/TrackingProductList';
import TrackingModal from '@/components/admin/tracking/modal/TrackingModal';
import TrackingProductFilter from '@/components/admin/tracking/TrackingProductFilter';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';

const TrackingPage: React.FC = () => {
    const {
        companies,
        warehouses,
        packages,
        loadingPackages,
        totalPages,
        stats,
        filter,
        setFilter,
        loadingWarehouses,
        clearPackageDetail
    } = useTrackingContext();

    const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    const getWarehouseId = useCallback((warehouse: any): string => {
        return String(
            warehouse?.collectionUnitId ||
            warehouse?.smallCollectionPointId ||
            warehouse?.smallCollectionPointsId ||
            warehouse?.pointId ||
            warehouse?.smallPointId ||
            warehouse?.id ||
            ''
        );
    }, []);

    const belongsToSelectedCompany = useCallback((warehouse: any, companyId?: string): boolean => {
        if (!companyId) return false;

        const warehouseCompanyId = warehouse?.companyId ?? warehouse?.collectionCompanyId;
        if (warehouseCompanyId === undefined || warehouseCompanyId === null || warehouseCompanyId === '') {
            return true;
        }

        return String(warehouseCompanyId) === String(companyId);
    }, []);

    // Auto-select first company when companies load
    useEffect(() => {
        if (companies.length > 0 && !filter.companyId) {
            const firstCompanyId = companies[0].id || companies[0].companyId || String(companies[0].collectionCompanyId);
            setFilter({ companyId: firstCompanyId, page: 1 });
        }
    }, [companies, filter.companyId, setFilter]);

    // Auto-select first warehouse when warehouses for selected company are ready
    useEffect(() => {
        if (!filter.companyId || loadingWarehouses || warehouses.length === 0) return;

        const companyWarehouses = warehouses.filter((w) => belongsToSelectedCompany(w, filter.companyId));
        const normalizedWarehouses = companyWarehouses.length > 0 ? companyWarehouses : warehouses;

        const currentWarehouseId = String(filter.smallCollectionPointId || '');
        const hasValidSelection = normalizedWarehouses.some((w) => getWarehouseId(w) === currentWarehouseId);

        if (!hasValidSelection) {
            const firstWarehouseId = getWarehouseId(normalizedWarehouses[0]);
            if (firstWarehouseId) {
                setFilter({ smallCollectionPointId: firstWarehouseId, page: 1 });
            }
        }
    }, [
        filter.companyId,
        filter.smallCollectionPointId,
        loadingWarehouses,
        warehouses,
        belongsToSelectedCompany,
        getWarehouseId,
        setFilter
    ]);

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

    // Sanitize companies to avoid exposing phone numbers in the dropdown
    // Keep address/city so they still appear under company name
    const sanitizedCompanies = useMemo(() =>
        companies.map((c: any) => ({
            id: c.id || c.companyId || String(c.collectionCompanyId),
            name: c.name || c.companyName || 'N/A',
            address: c.address || c.addressLine || c.street || '',
            city: c.city || c.province || c.district || ''
        })),
    [companies]);

    const handleCompanySelect = useCallback((companyId: string) => {
        setFilter({
            companyId,
            smallCollectionPointId: undefined,
            page: 1
        });
    }, [setFilter]);

    const handleWarehouseSelect = useCallback((smallCollectionPointId: string) => {
        setFilter({ smallCollectionPointId, page: 1 });
    }, [setFilter]);

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
        setSearchKeyword(value);
    }, []);

    const handlePackageClick = useCallback((pkg: any) => {
        setSelectedPackage(pkg);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedPackage(null);
        clearPackageDetail();
    }, [clearPackageDetail]);

    const isDeliveredFilter = (filter.status || 'Đã giao') === 'Đã giao';

    useEffect(() => {
        if (!filter.fromDate || !filter.toDate) {
            setFilter({
                fromDate: filter.fromDate || getFirstDayOfMonthString(),
                toDate: filter.toDate || getTodayString()
            });
        }
    }, [filter.fromDate, filter.toDate, setFilter]);

    useEffect(() => {
        if (filter.packageId) {
            setFilter({ packageId: '' });
        }
    }, [filter.packageId, setFilter]);

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex flex-col gap-2 mb-4 lg:flex-row lg:items-center lg:gap-6'>
                <div className='flex items-center gap-3 shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <ScanSearch className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Theo dõi kiện hàng</h1>
                </div>
                <div className='flex-1 flex flex-wrap lg:flex-nowrap items-center gap-3 lg:justify-end'>
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
                    <div className='w-full lg:w-lg lg:min-w-sm lg:max-w-lg lg:ml-auto'>
                        <SearchBox
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            placeholder='Tìm theo mã kiện hàng...'
                        />
                    </div>
                </div>
            </div>

            {/* Selectors + Status Filter (single row) */}
            <div className='mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                <div className='flex items-center gap-3'>
                    {filter.companyId && (
                        <TrackingProductFilter
                            status={filter.status || 'Đã giao'}
                            stats={stats}
                            onFilterChange={(s) => handleFilterChange(s)}
                        />
                    )}
                </div>

                <div className='flex gap-3 w-full sm:w-auto justify-end'>
                    <div className='w-80'>
                        <SearchableSelect
                            options={sanitizedCompanies}
                            value={filter.companyId ?? ''}
                            onChange={handleCompanySelect}
                            getLabel={(c: any) => c.name}
                            getValue={(c: any) => String(c.id)}
                            placeholder='Chọn công ty...'
                        />
                    </div>
                    <div className='w-80'>
                        <SearchableSelect
                            options={warehouses}
                            value={filter.smallCollectionPointId ?? ''}
                            onChange={handleWarehouseSelect}
                            getLabel={(w: any) => w.collectionUnitName || w.name || w.pointName || w.smallCollectionPointName || 'N/A'}
                            getValue={getWarehouseId}
                            placeholder={loadingWarehouses ? 'Đang tải đơn vị thu gom...' : 'Chọn đơn vị thu gom...'}
                            disabled={!filter.companyId || loadingWarehouses}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section removed (now displayed with selectors) */}

            {/* Main Content */}
            {!filter.companyId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn công ty để xem danh sách kiện hàng
                </div>
            ) : !filter.smallCollectionPointId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn đơn vị thu gom để xem danh sách kiện hàng
                </div>
            ) : (
                <div className='mb-6'>
                    <TrackingProductList
                        packages={filteredPackages}
                        loading={loadingPackages}
                        onPackageClick={handlePackageClick}
                        showDeliveryTime={isDeliveredFilter}
                    />
                </div>
            )}

            {/* Pagination */}
            <div className='flex justify-center'>
                <Pagination
                    page={filter.page || 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modal */}
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
