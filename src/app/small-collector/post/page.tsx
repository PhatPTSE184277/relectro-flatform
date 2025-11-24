'use client';
import React, { useEffect, useState } from 'react';
import type { Post } from '@/types/post';

import PostList from '@/components/small-collector/post/PostList';
import PostFilter from '@/components/small-collector/post/PostFilter';
import PostDetail from '@/components/small-collector/post/modal/PostDetail';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { usePostContext } from '@/contexts/small-collector/PostContext';
import { PostStatus } from '@/enums/PostStatus';
import { ClipboardList } from 'lucide-react';

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

  useEffect(() => {
    const loadStats = async () => {
        try {
            const approvedRes = await fetch(`/api/posts/filter?status=${encodeURIComponent(PostStatus.Approved)}&limit=1`);
            const rejectedRes = await fetch(`/api/posts/filter?status=${encodeURIComponent(PostStatus.Rejected)}&limit=1`);
            const pendingRes = await fetch(`/api/posts/filter?status=${encodeURIComponent(PostStatus.Pending)}&limit=1`);
            
            const approved = await approvedRes.json();
            const rejected = await rejectedRes.json();
            const pending = await pendingRes.json();

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
    };

    return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'>
                        <ClipboardList className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Bài đăng</h1>
                </div>
            </div>

            <div className="mb-4 max-w-md">
                <SearchBox
                    value={search}
                    onChange={setSearch}
                    placeholder="Tìm kiếm bài đăng..."
                />
            </div>

            <PostFilter
                status={filterStatus}
                stats={stats}
                onFilterChange={handleFilter}
            />

            <div className='mb-6'>
                <PostList
                    posts={posts}
                    loading={loading}
                    status={filterStatus}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
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
        </div>
    );
};

export default PostPage;