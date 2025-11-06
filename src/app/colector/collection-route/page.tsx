'use client';

import React, { useState, useEffect } from 'react';
import { useCollectionRouteContext } from '@/contexts/colector/CollectionRouteContext';
import CollectionRouteSidebar from '@/components/colector/collection-route/CollectionRouteSidebar';
import CollectionRouteMap from '@/components/colector/collection-route/CollectionRouteMap';
import CollectorRouteDetail from '@/components/colector/collection-route/modal/CollectorRouteDetail';
import { CollectionRouteStatus } from '@/components/colector/collection-route/CollectionRouteFilter';

const CollectionRoutePage: React.FC = () => {
    const {
        routes,
        loading,
        selectedDate,
        setSelectedDate,
    } = useCollectionRouteContext();

    const [filterStatus, setFilterStatus] = useState<CollectionRouteStatus>('Chưa bắt đầu');
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

    const filteredRoutes = routes.filter(route => {
        const matchStatus = route.status === filterStatus;
        const matchSearch = 
            route.itemName.toLowerCase().includes(search.toLowerCase()) ||
            route.address.toLowerCase().includes(search.toLowerCase()) ||
            route.sender?.name.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const stats = {
        total: routes.length,
        notStarted: routes.filter(r => r.status === 'Chưa bắt đầu').length,
        inProgress: routes.filter(r => r.status === 'Đang tiến hành').length,
        completed: routes.filter(r => r.status === 'Hoàn thành').length,
        cancelled: routes.filter(r => r.status === 'Hủy bỏ').length,
    };

    const handleViewDetail = (id: string) => {
        setDetailRouteId(id);
        setShowDetail(true);
    };

    const detailRoute = filteredRoutes.find(r => r.collectionRouteId === detailRouteId);

    return (
        <div className='flex h-screen bg-gray-50'>
            <CollectionRouteSidebar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                search={search}
                setSearch={setSearch}
                stats={stats}
                filteredRoutes={filteredRoutes}
                loading={loading}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
                handleViewDetail={handleViewDetail}
            />
            <div className='flex-1 relative'>
                <CollectionRouteMap
                    routes={routes}
                    filteredRoutes={filteredRoutes}
                    selectedRoute={selectedRoute}
                    setSelectedRoute={setSelectedRoute}
                    onViewDetail={handleViewDetail}
                />
                {showDetail && detailRoute && (
                    <CollectorRouteDetail
                        route={detailRoute}
                        onClose={() => setShowDetail(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CollectionRoutePage;