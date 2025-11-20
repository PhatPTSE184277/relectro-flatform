'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    ReactNode
} from 'react';
import {
    preAssignGrouping,
    assignDayGrouping,
    autoGroup,
    getVehicles,
    getGroupById,
    getGroupsByCollectionPointId,
    getPendingGroupingPosts,
    Vehicle,
    PreAssignGroupingPayload,
    AssignDayGroupingPayload,
    AutoGroupPayload
} from '@/services/small-collector/GroupingService';
import { toast } from 'react-toastify';

interface SuggestedVehicle {
    id: number;
    plate_Number: string;
    vehicle_Type: string;
    capacity_Kg: number;
    allowedCapacityKg: number;
}

interface PostInDay {
    postId: string;
    userName: string;
    address: string;
    weight: number;
    volume: number;
}

interface DaySuggestion {
    workDate: string;
    originalPostCount: number;
    totalWeight: number;
    totalVolume: number;
    suggestedVehicle: SuggestedVehicle;
    posts: PostInDay[];
}

interface PreAssignResponse {
    collectionPoint: string;
    loadThresholdPercent: number;
    days: DaySuggestion[];
}

interface PendingPost {
    postId: string;
    userName: string;
    address: string;
    productName: string;
    sizeTier: string;
    weight: number;
    volume: number;
    scheduleJson: string;
    status: string;
}

interface GroupingContextType {
    loading: boolean;
    groupDetailLoading: boolean;
    vehicles: Vehicle[];
    pendingPosts: PendingPost[];
    preAssignResult: PreAssignResponse | null;
    autoGroupResult: any | null;
    groupDetail: any | null;
    groups: any[];
    fetchVehicles: () => Promise<void>;
    fetchPendingPosts: () => Promise<void>;
    fetchGroups: () => Promise<void>;
    getPreAssignSuggestion: (loadThresholdPercent: number) => Promise<void>;
    createGrouping: (payload: AssignDayGroupingPayload) => Promise<void>;
    calculateRoute: (saveResult: boolean) => Promise<void>;
    fetchGroupDetail: (groupId: number) => Promise<void>;
}

const GroupingContext = createContext<GroupingContextType | undefined>(undefined);

type Props = { children: ReactNode };

export function GroupingProvider({ children }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [groupDetailLoading, setGroupDetailLoading] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
    const [preAssignResult, setPreAssignResult] = useState<PreAssignResponse | null>(null);
    const [autoGroupResult, setAutoGroupResult] = useState<any | null>(null);
    const [groupDetail, setGroupDetail] = useState<any | null>(null);
    const [groups, setGroups] = useState<any[]>([]);
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getGroupsByCollectionPointId(1);
            setGroups(data);
        } catch (err) {
            console.error('fetchGroups error', err);
            toast.error('Lỗi khi tải danh sách nhóm thu gom');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (err) {
            console.error('fetchVehicles error', err);
            toast.error('Lỗi khi tải danh sách phương tiện');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPendingPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPendingGroupingPosts();
            setPendingPosts(data);
        } catch (err) {
            console.error('fetchPendingPosts error', err);
            toast.error('Lỗi khi tải danh sách bài viết chờ gom nhóm');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPreAssignSuggestion = useCallback(
        async (loadThresholdPercent: number) => {
            setLoading(true);
            try {
                const payload: PreAssignGroupingPayload = {
                    loadThresholdPercent
                };
                const data = await preAssignGrouping(payload);
                setPreAssignResult(data);
                toast.success('Đã tải gợi ý gom nhóm thành công');
            } catch (err: any) {
                console.error('getPreAssignSuggestion error', err);
                toast.error(
                    err?.response?.data?.message || 'Lỗi khi tải gợi ý gom nhóm'
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createGrouping = useCallback(
        async (payload: AssignDayGroupingPayload) => {
            setLoading(true);
            try {
                await assignDayGrouping(payload);
                toast.success('Tạo nhóm thu gom thành công');
                // Refresh pending posts after creating grouping
                await fetchPendingPosts();
            } catch (err: any) {
                console.error('createGrouping error', err);
                toast.error(
                    err?.response?.data?.message || 'Lỗi khi tạo nhóm thu gom'
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchPendingPosts]
    );

    const calculateRoute = useCallback(async (saveResult: boolean) => {
        setLoading(true);
        try {
            const payload: AutoGroupPayload = { saveResult };
            const data = await autoGroup(payload);
            setAutoGroupResult(data);
            toast.success('Tính toán đoạn đường thành công');
        } catch (err: any) {
            console.error('calculateRoute error', err);
            toast.error(
                err?.response?.data?.message || 'Lỗi khi tính toán đoạn đường'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGroupDetail = useCallback(async (groupId: number) => {
        setGroupDetailLoading(true);
        try {
            const data = await getGroupById(groupId);
            setGroupDetail(data);
        } catch (err) {
            console.error('fetchGroupDetail error', err);
            toast.error('Lỗi khi tải chi tiết nhóm');
        } finally {
            setGroupDetailLoading(false);
        }
    }, []);

    const value: GroupingContextType = {
        loading,
        groupDetailLoading,
        vehicles,
        pendingPosts,
        preAssignResult,
        autoGroupResult,
        groupDetail,
        groups,
        fetchVehicles,
        fetchPendingPosts,
        fetchGroups,
        getPreAssignSuggestion,
        createGrouping,
        calculateRoute,
        fetchGroupDetail
    };

    return (
        <GroupingContext.Provider value={value}>
            {children}
        </GroupingContext.Provider>
    );
}

export const useGroupingContext = (): GroupingContextType => {
    const ctx = useContext(GroupingContext);
    if (!ctx)
        throw new Error('useGroupingContext must be used within GroupingProvider');
    return ctx;
};

export default GroupingContext;
