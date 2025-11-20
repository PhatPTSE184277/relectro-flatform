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
} from '@/services/small-collector/PostService';
import type { Post } from '@/types/post';
import { toast } from 'react-toastify';

interface PostContextType {
    posts: Post[];
    loading: boolean;
    selectedPost: any;
    setSelectedPost: (post: any) => void;
    fetchPosts: (customFilter?: any) => Promise<void>;
    fetchPostById: (postId: string) => Promise<void>;
    handleApprove: (postId: string) => Promise<void>;
    handleReject: (postId: string, reason: string) => Promise<void>;
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
        status: 'Đã Duyệt'
    });

    const fetchPosts = useCallback(
        async (customFilter?: Partial<typeof filter>) => {
            setLoading(true);
            try {
                const params = { ...filter, ...customFilter };
                const response = await filterPosts(params);
                
                setPosts(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
                setFilter(params);
            } catch (err) {
                console.error('fetchPosts error', err);
                toast.error('Lỗi khi tải danh sách bài đăng');
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
            toast.error('Lỗi khi tải bài đăng');
            setSelectedPost(null);
        }
    }, []);

    const handleApprove = useCallback(
        async (postId: string) => {
            setLoading(true);
            try {
                await approvePost(postId);
                toast.success('Duyệt bài đăng thành công');
                await fetchPosts();
                if (selectedPost?.id === postId) await fetchPostById(postId);
            } catch (err: any) {
                console.error('approvePost error', err);
                toast.error(
                    err?.response?.data?.message || 'Lỗi khi duyệt bài đăng'
                );
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
                await rejectPost(postId, reason);
                toast.success('Từ chối bài đăng thành công');
                await fetchPosts();
                if (selectedPost?.id === postId) await fetchPostById(postId);
            } catch (err: any) {
                console.error('rejectPost error', err);
                toast.error(
                    err?.response?.data?.message || 'Lỗi khi từ chối bài đăng'
                );
            } finally {
                setLoading(false);
            }
        },
        [fetchPosts, selectedPost, fetchPostById]
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