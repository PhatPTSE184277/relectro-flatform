'use client';

import React, { useState, useEffect } from 'react';
import { useCollectionRouteContext } from '@/contexts/collector/CollectionRouteContext';
import CollectorRouteDetail from '@/components/collector/collection-route/modal/CollectorRouteDetail';
import CollectionRouteFilter from '@/components/collector/collection-route/CollectionRouteFilter';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import SearchBox from '@/components/ui/SearchBox';
import { Route } from 'lucide-react';
import CollectionRouteList from '@/components/collector/collection-route/CollectionRouteList';
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
        allStats
    } = useCollectionRouteContext();

    const [search, setSearch] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [detailRouteId, setDetailRouteId] = useState<string | null>(null);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
    }, [setSelectedDate]);

    const filteredRoutes = routes.filter((route) => {
        const matchSearch =
            route.itemName.toLowerCase().includes(search.toLowerCase()) ||
            route.address.toLowerCase().includes(search.toLowerCase()) ||
            route.sender?.name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleFilterChange = (status: string) => {
        setContextFilterStatus(status);
        setCurrentPage(1); // Reset về trang 1 khi đổi filter
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetail = (id: string) => {
        setDetailRouteId(id);
        setShowDetail(true);
    };

    const detailRoute = filteredRoutes.find(
        (r) => r.collectionRouteId === detailRouteId
    );

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'>
                        <Route className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Tuyến thu gom
                    </h1>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6 space-y-4'>
                {/* Search (left) & Date Picker (right) */}
                <div className='flex gap-4 items-center'>
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm tuyến thu gom...'
                        />
                    </div>
                    <div className='w-64'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder='Chọn ngày thu gom'
                        />
                    </div>
                </div>

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
                />
            </div>

            {/* Pagination */}
            <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {showDetail && detailRoute && (
                <CollectorRouteDetail
                    route={detailRoute}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </div>
    );
};

export default CollectionRoutePage;
