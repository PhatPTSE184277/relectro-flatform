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
    filterRequests,
    getRequestById,
    approveRequest,
    rejectRequest
} from '@/services/admin/RequestService';
import type { Post } from '@/types/post';

interface RequestContextType {
    requests: Post[];
    loading: boolean;
    selectedRequest: any;
    setSelectedRequest: (request: any) => void;
    fetchRequests: (customFilter?: any) => Promise<void>;
    fetchRequestById: (requestId: string) => Promise<void>;
    handleApprove: (requestId: string) => Promise<void>;
    handleReject: (requestId: string, reason: string) => Promise<void>;
    handleBulkApprove: (requestIds: string[]) => Promise<void>;
    handleBulkReject: (requestIds: string[], reason: string) => Promise<void>;
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

const RequestContext = createContext<RequestContextType | undefined>(undefined);

type Props = { children: ReactNode };


export const RequestProvider: React.FC<Props> = ({ children }) => {
    const [requests, setRequests] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        search: '',
        order: '',
        status: 'Chờ duyệt'
    });

    const fetchRequests = useCallback(
        async (customFilter?: Partial<typeof filter>) => {
            setLoading(true);
            try {
                const params = { ...filter, ...customFilter };
                const response = await filterRequests({
                    page: params.page,
                    limit: params.limit,
                    search: params.search,
                    order: params.order,
                    status: params.status
                });
                setRequests(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
                setFilter(params);
            } catch (err) {
                console.error('fetchRequests error', err);
                setRequests([]);
            } finally {
                setLoading(false);
            }
        },
        [filter]
    );

    const fetchRequestById = useCallback(async (requestId: string) => {
        try {
            const data = await getRequestById(requestId);
            setSelectedRequest({
                ...data,
                images:
                    data.imageUrls && data.imageUrls.length > 0
                        ? data.imageUrls
                        : [data.thumbnailUrl || '/placeholder.png']
            });
        } catch (err) {
            console.error('fetchRequestById error', err);
            setSelectedRequest(null);
        }
    }, []);

    const handleApprove = useCallback(
        async (requestId: string) => {
            setLoading(true);
            try {
                await approveRequest([requestId]);
                await fetchRequests();
                if (selectedRequest?.id === requestId) await fetchRequestById(requestId);
            } catch (err: any) {
                console.error('approveRequest error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchRequests, selectedRequest, fetchRequestById]
    );

    const handleReject = useCallback(
        async (requestId: string, reason: string) => {
            setLoading(true);
            try {
                await rejectRequest([requestId], reason);
                await fetchRequests();
                if (selectedRequest?.id === requestId) await fetchRequestById(requestId);
            } catch (err: any) {
                console.error('rejectRequest error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchRequests, selectedRequest, fetchRequestById]
    );

    const handleBulkApprove = useCallback(
        async (requestIds: string[]) => {
            if (requestIds.length === 0) {
                return;
            }
            setLoading(true);
            try {
                await approveRequest(requestIds);
                await fetchRequests();
            } catch (err: any) {
                console.error('bulkApprove error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchRequests]
    );

    const handleBulkReject = useCallback(
        async (requestIds: string[], reason: string) => {
            if (requestIds.length === 0) {
                return;
            }
            setLoading(true);
            try {
                await rejectRequest(requestIds, reason);
                await fetchRequests();
            } catch (err: any) {
                console.error('bulkReject error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchRequests]
    );

    useEffect(() => {
        void fetchRequests();
    }, []);

    const value: RequestContextType = {
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
        setFilter,
        totalPages,
        totalItems,
    };

    return (
        <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
    );
};

export const useRequestContext = (): RequestContextType => {
    const ctx = useContext(RequestContext);
    if (!ctx)
        throw new Error('useRequestContext must be used within RequestProvider');
    return ctx;
};

export default RequestContext;