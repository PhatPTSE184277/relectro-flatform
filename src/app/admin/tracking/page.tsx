'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import TrackingProductList from '@/components/admin/tracking/TrackingProductList';
import TrackingModal from '@/components/admin/tracking/modal/TrackingModal';
import TrackingProductFilter from '@/components/admin/tracking/TrackingProductFilter';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';
import SearchBox from '@/components/ui/SearchBox';

const TrackingPage: React.FC = () => {
    const { companies, packages, loadingPackages, fetchPackages } = useTrackingContext();
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    // const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('Đang đóng gói');
    const [search, setSearch] = useState<string>("");
    const [fromDate, setFromDate] = useState(getFirstDayOfMonthString);
    const [toDate, setToDate] = useState(getTodayString);

    // Auto-select first company when companies load
    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            const firstCompanyId = companies[0].id || companies[0].companyId || String(companies[0].collectionCompanyId);
            setTimeout(() => setSelectedCompanyId(firstCompanyId), 0); // Avoid cascading renders
        }
    }, [companies, selectedCompanyId]);

    // Fetch packages when company or date changes
    useEffect(() => {
        if (selectedCompanyId) {
            fetchPackages(selectedCompanyId, fromDate, toDate, statusFilter);
        }
    }, [selectedCompanyId, fromDate, toDate, statusFilter, fetchPackages]);

    const handleCompanySelect = (companyId: string) => {
        setSelectedCompanyId(companyId);
    };



    const handlePackageClick = (pkg: any) => {
        setSelectedPackage(pkg);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPackage(null);
    };

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
    };

    // Search locally and add stt
    const searchTerm = search.trim().toLowerCase();
    const displayPackages = searchTerm
        ? packages.filter((pkg: any) =>
            (pkg.packageId || '').toLowerCase().includes(searchTerm)
        )
        : packages;

    const paginatedPackages = displayPackages.map((pkg, idx) => ({
        ...pkg,
        stt: idx + 1
    }));



    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header + Date Range Picker */}
            <div className='flex flex-col gap-4 mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <MapPin className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>Theo dõi package</h1>
                    </div>
                    <div className='flex gap-4 items-center flex-1 justify-end'>
                        <div className='w-72'>
                            <SearchableSelect
                                options={companies}
                                value={selectedCompanyId ?? ''}
                                onChange={handleCompanySelect}
                                getLabel={(c: any) => c.name || c.companyName || 'N/A'}
                                getValue={(c: any) => c.id || c.companyId || String(c.collectionCompanyId)}
                                placeholder='Chọn công ty...'
                            />
                        </div>
                        <div className='flex-1 max-w-md'>
                            <SearchBox
                                value={search}
                                onChange={setSearch}
                                placeholder="Tìm kiếm package..."
                            />
                        </div>
                        <div className='min-w-fit'>
                            <CustomDateRangePicker
                                fromDate={fromDate}
                                toDate={toDate}
                                onFromDateChange={setFromDate}
                                onToDateChange={setToDate}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            {selectedCompanyId && (
                <div className='mb-6'>
                    <TrackingProductFilter
                        status={statusFilter}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            )}

            {/* Package List */}
            {!selectedCompanyId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn công ty để xem danh sách package
                </div>
            ) : (
                <>  
                    <div className='mb-6'>
                        <TrackingProductList
                            packages={paginatedPackages}
                            loading={loadingPackages}
                            onPackageClick={handlePackageClick}
                        />
                    </div>
                </>
            )}



            {/* Tracking Modal */}
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
