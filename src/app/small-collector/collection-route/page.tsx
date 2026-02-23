'use client';

import React, { useState, useEffect } from 'react';
import { useCollectionRouteContext } from '@/contexts/small-collector/CollectionRouteContext';
import CollectorRouteDetail from '@/components/small-collector/collection-route/modal/CollectorRouteDetail';
import CollectionRouteFilter from '@/components/small-collector/collection-route/CollectionRouteFilter';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import SearchBox from '@/components/ui/SearchBox';
import { Route } from 'lucide-react';
import CollectionRouteList from '@/components/small-collector/collection-route/CollectionRouteList';
import { useRef } from 'react';
import Pagination from '@/components/ui/Pagination';

const CollectionRoutePage: React.FC = () => {
    const { 
        routes, 
        loading, 
        selectedDate, 
        setSelectedDate,
        filterStatus: contextFilterStatus,
        setFilterStatus: setContextFilterStatus,
        totalPages,
        currentPage,
        setCurrentPage,
        allStats,
        routeDetail,
        fetchRouteDetail,
        clearRouteDetail
    } = useCollectionRouteContext();

    const [search, setSearch] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const tableScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
    }, [setSelectedDate]);

    const filteredRoutes = routes.filter((route) => {
        const matchSearch =
            route.address?.toLowerCase().includes(search.toLowerCase()) ||
            route.sender?.name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleFilterChange = (status: string) => {
        setContextFilterStatus(status);
        setCurrentPage(1); // Reset về trang 1 khi đổi filter
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleViewDetail = async (id: string) => {
        setLoadingDetail(true);
        // Clear old data first
        clearRouteDetail();
        try {
            await fetchRouteDetail(id);
            setShowDetail(true);
        } catch (error) {
            console.error('Error fetching route detail:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        // Clear state when closing
        clearRouteDetail();
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Route className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Tuyến thu gom
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <div className='min-w-fit'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder='Chọn ngày thu gom'
                        />
                    </div>
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm tuyến thu gom...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6 space-y-4'>
                {/* Status Filter */}
                <CollectionRouteFilter
                    status={contextFilterStatus as any}
                    stats={allStats}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Main Content: List Only */}
            <div className='mb-6'>
                <CollectionRouteList
                    routes={filteredRoutes}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                    tableRef={tableScrollRef}
                    startIndex={(currentPage - 1) * 10}
                />
            </div>

            {/* Pagination */}
            <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {showDetail && routeDetail && (
                <CollectorRouteDetail
                    route={routeDetail}
                    onClose={handleCloseDetail}
                />
            )}

            {/* Loading Overlay */}
            {loadingDetail && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='bg-white rounded-lg p-6 shadow-xl'>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
                            <span className='text-gray-700 font-medium'>Đang tải chi tiết...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionRoutePage;
