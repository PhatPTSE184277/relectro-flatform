'use client';
import React, { useEffect, useState, useRef } from 'react';
import type { Post } from '@/types/post';

import PostList from '@/components/admin/post/PostList';
import PostFilter from '@/components/admin/post/PostFilter';
import PostDetail from '@/components/admin/post/modal/PostDetail';
import PostReject from '@/components/admin/post/modal/PostReject';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { usePostContext } from '@/contexts/admin/PostContext';
import { PostStatus } from '@/enums/PostStatus';
import { ClipboardList } from 'lucide-react';
import { filterPosts } from '@/services/admin/PostService';

type Stats = {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
};

const PostPage: React.FC = () => {
    const {
        posts,
        loading,
        selectedPost,
        setSelectedPost,
        fetchPosts,
        fetchPostById,
        handleApprove,
        handleReject,
        handleBulkApprove,
        handleBulkReject,
        filter,
        totalPages,
    } = usePostContext();

    const [filterStatus, setFilterStatus] = useState<PostStatus>(PostStatus.Pending);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    });
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
    const [isBulkRejectModalOpen, setIsBulkRejectModalOpen] = useState(false);
    const tableScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
        try {
            const approved = await filterPosts({ status: PostStatus.Approved, limit: 1, page: 1 });
            const rejected = await filterPosts({ status: PostStatus.Rejected, limit: 1, page: 1 });
            const pending = await filterPosts({ status: PostStatus.Pending, limit: 1, page: 1 });

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
}, [posts]);

    // Debounce search: mỗi lần search thay đổi thì fetch lại
    useEffect(() => {
        fetchPosts({ search, status: filterStatus, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filterStatus]);

    const handleFilter = (status: PostStatus) => {
        setFilterStatus(status);
        setSelectedPostIds([]);
    };

    const handleView = async (post: Post) => {
        await fetchPostById(post.id);
        setIsShowModalOpen(true);
    };

    const handleCloseShow = () => {
        setIsShowModalOpen(false);
        setSelectedPost(null);
    };

    const handlePageChange = (page: number) => {
        fetchPosts({ page, search, status: filterStatus });
        // Scroll to top of table when changing pages
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Không clear selectedPostIds khi chuyển trang để giữ lại các bài đã chọn
    };

    const handleToggleSelect = (postId: string) => {
        setSelectedPostIds(prev => 
            prev.includes(postId) 
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    const handleToggleSelectAll = () => {
        const currentPagePostIds = posts.map(p => p.id);
        const allSelected = currentPagePostIds.every(id => selectedPostIds.includes(id));
        
        if (allSelected) {
            setSelectedPostIds(prev => prev.filter(id => !currentPagePostIds.includes(id)));
        } else {
            setSelectedPostIds(prev => {
                const newIds = currentPagePostIds.filter(id => !prev.includes(id));
                return [...prev, ...newIds];
            });
        }
    };

    const handleBulkApproveClick = async () => {
        await handleBulkApprove(selectedPostIds);
        setSelectedPostIds([]);
    };

    const handleBulkRejectModalOpen = () => {
        setIsBulkRejectModalOpen(true);
    };

    const handleBulkRejectConfirm = async (reason: string) => {
        await handleBulkReject(selectedPostIds, reason);
        setSelectedPostIds([]);
        setIsBulkRejectModalOpen(false);
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <ClipboardList className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Bài đăng</h1>
                </div>
                <div className='w-full sm:max-w-md'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder="Tìm kiếm bài đăng..."
                    />
                </div>
            </div>

            <PostFilter
                status={filterStatus}
                stats={stats}
                onFilterChange={handleFilter}
            />

            <div className='mb-3'>
                <PostList
                    ref={tableScrollRef}
                    posts={posts}
                    loading={loading}
                    status={filterStatus}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                    selectedPostIds={selectedPostIds}
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

            {isShowModalOpen && selectedPost && (
                <PostDetail
                    post={selectedPost}
                    onClose={handleCloseShow}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}

            {isBulkRejectModalOpen && (
                <PostReject
                    open={isBulkRejectModalOpen}
                    onClose={() => setIsBulkRejectModalOpen(false)}
                    onConfirm={handleBulkRejectConfirm}
                />
            )}
        </div>
    );
};

export default PostPage;