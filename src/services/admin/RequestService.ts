
import axios from '@/lib/axios';
import type { Post } from '@/types/post';

export interface FilterRequestsResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: Post[];
}

export const filterRequests = async ({
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
}): Promise<FilterRequestsResponse> => {
    // Chỉ gửi params có giá trị
    const params: Record<string, any> = { page, limit };
    
    if (search && search.trim()) params.search = search.trim();
    if (order && order.trim()) params.order = order.trim();
    if (status && status.trim()) params.status = status.trim();

    const response = await axios.get<FilterRequestsResponse>('/posts/filter', {
        params
    });
    return response.data;
};


export const getRequestById = async (requestId: string): Promise<any> => {
    const response = await axios.get<Post>(`/posts/${requestId}`);
    return response.data;
};


export const approveRequest = async (requestIds: string[]) => {
    const response = await axios.put('/posts/approve', { postIds: requestIds });
    return response.data;
};


export const rejectRequest = async (requestIds: string[], rejectMessage: string) => {
    const response = await axios.put('/posts/reject', { postIds: requestIds, rejectMessage });
    return response.data;
};