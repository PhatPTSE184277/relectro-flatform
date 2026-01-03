'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect,
    ReactNode
} from 'react';
import {
    filterPosts,
    getPostById,
    approvePost,
    rejectPost
} from '@/services/admin/PostService';
import type { Post } from '@/types/post';

interface PostContextType {
    posts: Post[];
    loading: boolean;
    selectedPost: any;
    setSelectedPost: (post: any) => void;
    fetchPosts: (customFilter?: any) => Promise<void>;
    fetchPostById: (postId: string) => Promise<void>;
    handleApprove: (postId: string) => Promise<void>;
    handleReject: (postId: string, reason: string) => Promise<void>;
    handleBulkApprove: (postIds: string[]) => Promise<void>;
    handleBulkReject: (postIds: string[], reason: string) => Promise<void>;
    filter: {
        page: number;
        limit: number;
        search: string;
        order: string;
        status: string;
    };
    setFilter: (filter: any) => void;
    totalPages: number;
    totalItems: number;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const PostProvider: React.FC<Props> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        search: '',
        order: '',
        status: 'Chờ duyệt'
    });

    const fetchPosts = useCallback(
        async (customFilter?: Partial<typeof filter>) => {
            setLoading(true);
            try {
                const params = { ...filter, ...customFilter };
                const response = await filterPosts({
                    page: params.page,
                    limit: params.limit,
                    search: params.search,
                    order: params.order,
                    status: params.status
                });
                
                setPosts(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
                setFilter(params);
            } catch (err) {
                console.error('fetchPosts error', err);
                // ...existing code...
                setPosts([]);
            } finally {
                setLoading(false);
            }
        },
        [filter]
    );

    const fetchPostById = useCallback(async (postId: string) => {
        try {
            const data = await getPostById(postId);
            setSelectedPost({
                ...data,
                images:
                    data.imageUrls && data.imageUrls.length > 0
                        ? data.imageUrls
                        : [data.thumbnailUrl || '/placeholder.png']
            });
        } catch (err) {
            console.error('fetchPostById error', err);
            // ...existing code...
            setSelectedPost(null);
        }
    }, []);

    const handleApprove = useCallback(
        async (postId: string) => {
            setLoading(true);
            try {
                await approvePost([postId]);
                // ...existing code...
                await fetchPosts();
                if (selectedPost?.id === postId) await fetchPostById(postId);
            } catch (err: any) {
                console.error('approvePost error', err);
                // ...existing code...
            } finally {
                setLoading(false);
            }
        },
        [fetchPosts, selectedPost, fetchPostById]
    );

    const handleReject = useCallback(
        async (postId: string, reason: string) => {
            setLoading(true);
            try {
                await rejectPost([postId], reason);
                // ...existing code...
                await fetchPosts();
                if (selectedPost?.id === postId) await fetchPostById(postId);
            } catch (err: any) {
                console.error('rejectPost error', err);
                // ...existing code...
            } finally {
                setLoading(false);
            }
        },
        [fetchPosts, selectedPost, fetchPostById]
    );

    const handleBulkApprove = useCallback(
        async (postIds: string[]) => {
            if (postIds.length === 0) {
                // ...existing code...
                return;
            }
            setLoading(true);
            try {
                await approvePost(postIds);
                // ...existing code...
                await fetchPosts();
            } catch (err: any) {
                console.error('bulkApprove error', err);
                // ...existing code...
            } finally {
                setLoading(false);
            }
        },
        [fetchPosts]
    );

    const handleBulkReject = useCallback(
        async (postIds: string[], reason: string) => {
            if (postIds.length === 0) {
                // ...existing code...
                return;
            }
            setLoading(true);
            try {
                await rejectPost(postIds, reason);
                // ...existing code...
                await fetchPosts();
            } catch (err: any) {
                console.error('bulkReject error', err);
                // ...existing code...
            } finally {
                setLoading(false);
            }
        },
        [fetchPosts]
    );

    useEffect(() => {
        void fetchPosts();
    }, []);

    const value: PostContextType = {
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
        setFilter,
        totalPages,
        totalItems,
    };

    return (
        <PostContext.Provider value={value}>{children}</PostContext.Provider>
    );
};

export const usePostContext = (): PostContextType => {
    const ctx = useContext(PostContext);
    if (!ctx)
        throw new Error('usePostContext must be used within PostProvider');
    return ctx;
};

export default PostContext;