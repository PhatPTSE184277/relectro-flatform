import axios from '@/lib/axios';
import type { Post } from '@/types/post';

export interface FilterPostsResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: Post[];
}

export const filterPosts = async ({
    page = 1,
    limit = 10,
    search,
    order,
    status
}: {
    page?: number;
    limit?: number;
    search?: string;
    order?: string;
    status?: string;
}): Promise<FilterPostsResponse> => {
    // Chỉ gửi params có giá trị
    const params: Record<string, any> = { page, limit };
    
    if (search && search.trim()) params.search = search.trim();
    if (order && order.trim()) params.order = order.trim();
    if (status && status.trim()) params.status = status.trim();

    const response = await axios.get<FilterPostsResponse>('/posts/filter', {
        params
    });
    return response.data;
};

export const getPostById = async (postId: string): Promise<any> => {
    const response = await axios.get<Post>(`/posts/${postId}`);
    return response.data;
};

export const approvePost = async (postIds: string[]) => {
    const response = await axios.put('/posts/approve', { postIds });
    return response.data;
};

export const rejectPost = async (postIds: string[], rejectMessage: string) => {
    const response = await axios.put('/posts/reject', { postIds, rejectMessage });
    return response.data;
};