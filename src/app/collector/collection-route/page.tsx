'use client';

import React, { useState, useEffect } from 'react';
import { useCollectionRouteContext } from '@/contexts/collector/CollectionRouteContext';
import CollectionRouteMap from '@/components/collector/collection-route/CollectionRouteMap';
import CollectorRouteDetail from '@/components/collector/collection-route/modal/CollectorRouteDetail';
import { CollectionRouteStatus } from '@/components/collector/collection-route/CollectionRouteFilter';
import CollectionRouteFilter from '@/components/collector/collection-route/CollectionRouteFilter';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import SearchBox from '@/components/ui/SearchBox';
import { Route } from 'lucide-react';
import CollectionRouteList from '@/components/collector/collection-route/CollectionRouteList';

const CollectionRoutePage: React.FC = () => {
    const { routes, loading, selectedDate, setSelectedDate } =
        useCollectionRouteContext();

    const [filterStatus, setFilterStatus] =
        useState<CollectionRouteStatus>('Chưa bắt đầu');
    const [search, setSearch] = useState('');
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
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
        const matchStatus = route.status === filterStatus;
        const matchSearch =
            route.itemName.toLowerCase().includes(search.toLowerCase()) ||
            route.address.toLowerCase().includes(search.toLowerCase()) ||
            route.sender?.name.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const stats = {
        total: routes.length,
        notStarted: routes.filter((r) => r.status === 'Chưa bắt đầu').length,
        inProgress: routes.filter((r) => r.status === 'Đang tiến hành').length,
        completed: routes.filter((r) => r.status === 'Hoàn thành').length,
        cancelled: routes.filter((r) => r.status === 'Hủy bỏ').length
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
                    status={filterStatus}
                    stats={stats}
                    onFilterChange={setFilterStatus}
                />
            </div>

            {/* Main Content: List + Map */}
            <div className='flex gap-6 h-[calc(100vh-180px)]'>
                {/* Left Sidebar - List */}
                <div className='w-[420px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-y-auto h-full'>
                    <div className='p-4'>
                        <CollectionRouteList
                            routes={filteredRoutes}
                            loading={loading}
                            selectedRoute={selectedRoute}
                            onSelectRoute={setSelectedRoute}
                            onViewDetail={handleViewDetail}
                        />
                    </div>
                </div>

                {/* Right - Map */}
                <div className='flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full'>
                    <CollectionRouteMap
                        routes={routes}
                        filteredRoutes={filteredRoutes}
                        selectedRoute={selectedRoute}
                        setSelectedRoute={setSelectedRoute}
                        onViewDetail={handleViewDetail}
                    />
                </div>
            </div>
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
