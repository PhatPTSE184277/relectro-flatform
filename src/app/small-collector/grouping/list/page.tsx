'use client';

import React, { useState, useEffect } from 'react';
import { Plus, GitBranch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GroupingListComponent from '@/components/small-collector/grouping/list/GroupingList';

import Pagination from '@/components/ui/Pagination';
import GroupingDetail from '@/components/small-collector/grouping/list/modal/GroupingDetail';
import ReassignDriverModal from '@/components/small-collector/grouping/list/modal/ReassignDriverModal';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';

const GroupingListPage: React.FC = () => {
    const router = useRouter();
    const { groups, loading, groupDetailLoading, fetchGroups, fetchGroupDetail, groupDetail } = useGroupingContext();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        page: 1,
        status: 'all'
    });
    const [totalPages, setTotalPages] = useState(1);
    const [selectedGrouping, setSelectedGrouping] = useState<any | null>(null);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [reassignGrouping, setReassignGrouping] = useState<any | null>(null);

    // Fetch groups on mount
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const filteredGroupings = groups.filter((group: any) => {
        const matchSearch =
            group.groupCode?.toLowerCase().includes(search.toLowerCase()) ||
            group.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
            group.collector?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handlePageChange = (page: number) => {
        setFilter({ ...filter, page });
    };

    const handleCreateNew = () => {
        router.push('/small-collector/grouping');
    };

    const handleViewDetail = async (grouping: any) => {
        setSelectedGrouping(grouping);
        await fetchGroupDetail(grouping.groupId);
    };

    const handleReassignDriver = (grouping: any) => {
        setReassignGrouping(grouping);
        setShowReassignModal(true);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                                            <GitBranch className='text-white' size={20} />
                                        </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Danh sách nhóm thu gom
                    </h1>
                </div>
                <button
                    onClick={handleCreateNew}
                    className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer'
                >
                    <Plus size={20} />
                    Tạo nhóm mới
                </button>
            </div>

            {/* Filter */}
            {/* <GroupingFilter
                status={filter.status}
                onFilterChange={(status) => setFilter({ ...filter, status, page: 1 })}
            /> */}

            {/* Search */}
            {/* <SearchBox
                value={search}
                onChange={setSearch}
                placeholder='Tìm kiếm theo mã nhóm, phương tiện, người thu gom...'
            /> */}

            {/* List */}
            <GroupingListComponent
                groupings={filteredGroupings}
                loading={loading}
                onViewDetail={handleViewDetail}
                onReassignDriver={handleReassignDriver}
            />

            {/* Pagination */}
            <Pagination
                page={filter.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {selectedGrouping && (
                <GroupingDetail
                    grouping={groupDetailLoading ? selectedGrouping : groupDetail}
                    onClose={() => setSelectedGrouping(null)}
                />
            )}

            {/* Reassign Driver Modal */}
            {showReassignModal && reassignGrouping && (
                <ReassignDriverModal
                    open={showReassignModal}
                    grouping={reassignGrouping}
                    onClose={() => {
                        setShowReassignModal(false);
                        setReassignGrouping(null);
                    }}
                />
            )}
        </div>
    );
};

export default GroupingListPage;
