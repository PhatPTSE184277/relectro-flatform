'use client';
import React, { useEffect, useState, useRef } from 'react';
import type { Post } from '@/types/post';

import RequestList from '@/components/admin/request/RequestList';
import RequestFilter from '@/components/admin/request/RequestFilter';
import RequestDetail from '@/components/admin/request/modal/RequestDetail';
import RequestReject from '@/components/admin/request/modal/RequestReject';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { useRequestContext } from '@/contexts/admin/RequestContext';
import { PostStatus } from '@/enums/PostStatus';
import { ClipboardList } from 'lucide-react';
import { filterRequests } from '@/services/admin/RequestService';

type Stats = {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
};

const RequestPage: React.FC = () => {
    const {
        requests,
        loading,
        selectedRequest,
        setSelectedRequest,
        fetchRequests,
        fetchRequestById,
        handleApprove,
        handleReject,
        handleBulkApprove,
        handleBulkReject,
        filter,
        totalPages,
    } = useRequestContext();

    const [filterStatus, setFilterStatus] = useState<PostStatus>(PostStatus.Pending);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    });
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
    const [isBulkRejectModalOpen, setIsBulkRejectModalOpen] = useState(false);
    const tableScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
        try {
            const approved = await filterRequests({ status: PostStatus.Approved, limit: 1, page: 1 });
            const rejected = await filterRequests({ status: PostStatus.Rejected, limit: 1, page: 1 });
            const pending = await filterRequests({ status: PostStatus.Pending, limit: 1, page: 1 });

            setStats({
                total: approved.totalItems + rejected.totalItems + pending.totalItems,
                approved: approved.totalItems,
                rejected: rejected.totalItems,
                pending: pending.totalItems,
            });
        } catch (err) {
            console.error('Error loading stats', err);
        }
    };
    loadStats();
}, [requests]);

    // Debounce search: mỗi lần search thay đổi thì fetch lại
    useEffect(() => {
        // Nếu là Pending, sắp xếp theo ngày cũ nhất trước (ascending)
        const order = filterStatus === PostStatus.Pending ? 'asc' : '';
        fetchRequests({ search, status: filterStatus, page: 1, order });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filterStatus]);

    const handleFilter = (status: PostStatus) => {
        setFilterStatus(status);
        setSelectedRequestIds([]);
        // Nếu là Pending, sắp xếp theo ngày cũ nhất trước (ascending)
        const order = status === PostStatus.Pending ? 'asc' : '';
        fetchRequests({ status, page: 1, search, order });
    };

    const handleView = async (request: Post) => {
        await fetchRequestById(request.id);
        setIsShowModalOpen(true);
    };

    const handleCloseShow = () => {
        setIsShowModalOpen(false);
        setSelectedRequest(null);
    };

    const handlePageChange = (page: number) => {
        // Nếu là Pending, sắp xếp theo ngày cũ nhất trước (ascending)
        const order = filterStatus === PostStatus.Pending ? 'asc' : '';
        fetchRequests({ page, search, status: filterStatus, order });
        // Scroll to top of table when changing pages
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Không clear selectedRequestIds khi chuyển trang để giữ lại các bài đã chọn
    };

    const handleToggleSelect = (requestId: string) => {
        setSelectedRequestIds(prev => 
            prev.includes(requestId) 
                ? prev.filter(id => id !== requestId)
                : [...prev, requestId]
        );
    };

    const handleToggleSelectAll = () => {
        const currentPageRequestIds = requests.map(r => r.id);
        const allSelected = currentPageRequestIds.every(id => selectedRequestIds.includes(id));
        
        if (allSelected) {
            setSelectedRequestIds(prev => prev.filter(id => !currentPageRequestIds.includes(id)));
        } else {
            setSelectedRequestIds(prev => {
                const newIds = currentPageRequestIds.filter(id => !prev.includes(id));
                return [...prev, ...newIds];
            });
        }
    };

    const handleBulkApproveClick = async () => {
        await handleBulkApprove(selectedRequestIds);
        setSelectedRequestIds([]);
    };

    const handleBulkRejectModalOpen = () => {
        setIsBulkRejectModalOpen(true);
    };

    const handleBulkRejectConfirm = async (reason: string) => {
        await handleBulkReject(selectedRequestIds, reason);
        setSelectedRequestIds([]);
        setIsBulkRejectModalOpen(false);
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <ClipboardList className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Yêu cầu đăng bài</h1>
                </div>
                <div className='w-full sm:max-w-md'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder="Tìm kiếm yêu cầu..."
                    />
                </div>
            </div>

            <RequestFilter
                status={filterStatus}
                stats={stats}
                onFilterChange={handleFilter}
            />

            <div className='mb-3'>
                <RequestList
                    ref={tableScrollRef}
                    requests={requests}
                    loading={loading}
                    status={filterStatus}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                    selectedRequestIds={selectedRequestIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    onBulkApprove={handleBulkApproveClick}
                    onBulkReject={handleBulkRejectModalOpen}
                    page={filter.page}
                    pageSize={filter.limit || 10}
                />
            </div>

            <Pagination
                page={filter.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {isShowModalOpen && selectedRequest && (
                <RequestDetail
                    request={selectedRequest}
                    onClose={handleCloseShow}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}

            {isBulkRejectModalOpen && (
                <RequestReject
                    open={isBulkRejectModalOpen}
                    onClose={() => setIsBulkRejectModalOpen(false)}
                    onConfirm={handleBulkRejectConfirm}
                    showTags={true}
                />
            )}
        </div>
    );
};

export default RequestPage;
