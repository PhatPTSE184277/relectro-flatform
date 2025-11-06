import React from 'react';
import { Route, Search } from 'lucide-react';
import CollectionRouteFilter, {
    CollectionRouteStatus
} from './CollectionRouteFilter';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CollectionRouteList from './CollectionRouteList';

interface SidebarProps {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    filterStatus: CollectionRouteStatus;
    setFilterStatus: (status: CollectionRouteStatus) => void;
    search: string;
    setSearch: (val: string) => void;
    stats: {
        total: number;
        notStarted: number;
        collecting: number;
        completed: number;
        cancelled: number;
    };
    filteredRoutes: any[];
    loading: boolean;
    selectedRoute: string | null;
    setSelectedRoute: (id: string) => void;
    handleViewDetail: (id: string) => void;
}

const CollectionRouteSidebar: React.FC<SidebarProps> = ({
    selectedDate,
    setSelectedDate,
    filterStatus,
    setFilterStatus,
    search,
    setSearch,
    stats,
    filteredRoutes,
    loading,
    selectedRoute,
    setSelectedRoute,
    handleViewDetail
}) => {
    return (
        <div className='w-[420px] bg-white overflow-y-auto shadow-xl flex flex-col'>
            <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'>
                            <Route className='text-white' size={20} />
                        </div>
                        <h1 className='text-xl font-bold text-gray-900'>
                            TUYẾN THU GOM
                        </h1>
                    </div>
                </div>
                <div className='mb-4'>
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder='Chọn ngày thu gom'
                    />
                </div>
                <div className='relative mb-4'>
                    <Search
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                        size={18}
                    />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Tìm kiếm tuyến thu gom...'
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none'
                    />
                </div>
                <CollectionRouteFilter
                    status={filterStatus}
                    stats={stats}
                    onFilterChange={setFilterStatus}
                />
            </div>
            <div className='flex-1 overflow-y-auto'>
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
        </div>
    );
};

export default CollectionRouteSidebar;
