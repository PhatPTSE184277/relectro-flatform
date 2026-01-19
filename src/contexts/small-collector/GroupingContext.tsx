'use client';

import {
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
    getPendingGroupingProducts,
    getReassignDriverCandidates,
    confirmReassignDriver,
    Vehicle,
    PreAssignGroupingPayload,
    AssignDayGroupingPayload,
    AutoGroupPayload,
    PendingProductsResponse,
    GroupingPageResponse,
    previewProducts,
    PreviewProductsPagingResponse
} from '@/services/small-collector/GroupingService';
import { useAuth } from '@/hooks/useAuth';

interface SuggestedVehicle {
    id: number;
    plate_Number: string;
    vehicle_Type: string;
    capacity_Kg: number;
    allowedCapacityKg: number;
}

interface ProductInDay {
    productId: string;
    userName: string;
    address: string;
    weight: number;
    volume: number;
    categoryName?: string;
    brandName?: string;
}

interface DaySuggestion {
    workDate: string;
    originalProductCount: number;
    totalWeight: number;
    totalVolume: number;
    suggestedVehicle: SuggestedVehicle;
    products: ProductInDay[];
}

interface PreAssignResponse {
    collectionPoint: string;
    loadThresholdPercent: number;
    days: DaySuggestion[];
}

interface PendingProduct {
    productId: string;
    userName: string;
    address: string;
    productName: string;
    sizeTier: string;
    weight: number;
    volume: number;
    scheduleJson: string;
    status: string;
    categoryName?: string;
    brandName?: string;
}

interface GroupingContextType {
    loading: boolean;
    groupDetailLoading: boolean;
    reassignLoading: boolean;
    vehicles: Vehicle[];
    pendingProducts: PendingProduct[];
    pendingProductsData: PendingProductsResponse | null;
    preAssignResult: PreAssignResponse | null;
    autoGroupResult: any | null;
    groupDetail: any | null;
    groups: any[];
    groupsPaging: GroupingPageResponse | null;
    groupsPage: number;
    groupsLimit: number;
    groupsTotalPage: number;
    driverCandidates: any[];
    previewProductsPaging: PreviewProductsPagingResponse | null;
    fetchVehicles: () => Promise<void>;
    fetchPendingProducts: (workDate?: string) => Promise<void>;
    fetchGroups: (page?: number, limit?: number) => Promise<void>;
    setGroupsPage: (page: number) => void;
    setGroupsLimit: (limit: number) => void;
    getPreAssignSuggestion: (loadThresholdPercent: number, selectedProductIds?: string[]) => Promise<void>;
    createGrouping: (payload: AssignDayGroupingPayload) => Promise<void>;
    calculateRoute: (saveResult: boolean) => Promise<void>;
    fetchGroupDetail: (groupId: number, page?: number, limit?: number) => Promise<void>;
    fetchDriverCandidates: (date: string) => Promise<void>;
    reassignDriver: (groupId: number, newCollectorId: string) => Promise<void>;
    fetchPreviewProducts: (
        vehicleId: string,
        workDate: { year: number; month: number; day: number; dayOfWeek: number },
        page?: number,
        pageSize?: number
    ) => Promise<void>;
}

const GroupingContext = createContext<GroupingContextType | undefined>(undefined);

type Props = { children: ReactNode };

export function GroupingProvider({ children }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [groupDetailLoading, setGroupDetailLoading] = useState<boolean>(false);
    const [reassignLoading, setReassignLoading] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
    const [pendingProductsData, setPendingProductsData] = useState<PendingProductsResponse | null>(null);
    const [preAssignResult, setPreAssignResult] = useState<PreAssignResponse | null>(null);
    const [autoGroupResult, setAutoGroupResult] = useState<any | null>(null);
    const [groupDetail, setGroupDetail] = useState<any | null>(null);
    const [groups, setGroups] = useState<any[]>([]);
    const [groupsPaging, setGroupsPaging] = useState<GroupingPageResponse | null>(null);
    const [groupsPage, setGroupsPage] = useState<number>(1);
    const [groupsLimit, setGroupsLimit] = useState<number>(10);
    const [groupsTotalPage, setGroupsTotalPage] = useState<number>(1);
    const [driverCandidates, setDriverCandidates] = useState<any[]>([]);
    const [previewProductsPaging, setPreviewProductsPaging] = useState<PreviewProductsPagingResponse | null>(null);

    const fetchGroups = useCallback(async (page: number = groupsPage, limit: number = groupsLimit) => {
        if (!user?.smallCollectionPointId) return;
        setLoading(true);
        try {
            const data = await getGroupsByCollectionPointId(user.smallCollectionPointId, page, limit);
            setGroupsPaging(data);
            setGroups(data.data || []);
            setGroupsPage(data.page || 1);
            setGroupsLimit(data.limit || 10);
            setGroupsTotalPage(data.totalPages || 1);
        } catch (err) {
            console.error('fetchGroups error', err);
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId, groupsPage, groupsLimit]);

    const fetchVehicles = useCallback(async () => {
        if (!user?.smallCollectionPointId) return;
        setLoading(true);
        try {
            const data = await getVehicles(user.smallCollectionPointId);
            setVehicles(data);
        } catch (err) {
            console.error('fetchVehicles error', err);
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId]);

    const fetchPendingProducts = useCallback(async (workDate?: string) => {
        if (!user?.smallCollectionPointId) {
            console.warn('No smallCollectionPointId found in user profile:', user);
            return;
        }
        setLoading(true);
        try {
            const today = workDate || new Date().toISOString().split('T')[0];
            console.log('Fetching products for:', { smallPointId: user.smallCollectionPointId, workDate: today });
            const data = await getPendingGroupingProducts(user.smallCollectionPointId, today);
            console.log('Products data received:', data);
            setPendingProductsData(data);
            setPendingProducts(data.products || []);
        } catch (err) {
            console.error('fetchPendingProducts error', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const getPreAssignSuggestion = useCallback(
        async (loadThresholdPercent: number, selectedProductIds?: string[]) => {
            if (!user?.smallCollectionPointId) {
                return;
            }
            setLoading(true);
            try {
                const payload: PreAssignGroupingPayload = {
                    loadThresholdPercent,
                    productIds: selectedProductIds
                };
                const data = await preAssignGrouping(payload, user.smallCollectionPointId);
                console.log('PreAssign result:', data);
                console.log('Days structure:', data?.days);
                setPreAssignResult(data);
            } catch (err: any) {
                console.error('getPreAssignSuggestion error', err);
            } finally {
                setLoading(false);
            }
        },
        [user?.smallCollectionPointId]
    );

    const createGrouping = useCallback(
        async (payload: AssignDayGroupingPayload) => {
            if (!user?.smallCollectionPointId) {
                return;
            }
            setLoading(true);
            try {
                await assignDayGrouping(payload, user.smallCollectionPointId);
                // Refresh pending products after creating grouping
                await fetchPendingProducts();
            } catch (err: any) {
                console.error('createGrouping error', err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [user?.smallCollectionPointId, fetchPendingProducts]
    );

    const calculateRoute = useCallback(async (saveResult: boolean) => {
        if (!user?.smallCollectionPointId) {
            return;
        }
        setLoading(true);
        try {
            const payload: AutoGroupPayload = { saveResult };
            const data = await autoGroup(payload, user.smallCollectionPointId);
            setAutoGroupResult(data);
        } catch (err: any) {
            console.error('calculateRoute error', err);
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId]);

    const fetchGroupDetail = useCallback(async (groupId: number, page: number = 1, limit: number = 10) => {
        setGroupDetailLoading(true);
        try {
            const data = await getGroupById(groupId, page, limit);
            setGroupDetail(data);
        } catch (err) {
            console.error('fetchGroupDetail error', err);
        } finally {
            setGroupDetailLoading(false);
        }
    }, []);

    const fetchDriverCandidates = useCallback(async (date: string) => {
        if (!user?.smallCollectionPointId) {
            console.warn('No smallCollectionPointId found in user profile:', user);
            return;
        }
        setReassignLoading(true);
        try {
            const smallCollectionPointId = user.smallCollectionPointId as string; // Ensure type safety
            const data = await getReassignDriverCandidates(smallCollectionPointId, date);
            setDriverCandidates(data || []);
        } catch (error) {
            console.error('Error fetching driver candidates:', error);
            setDriverCandidates([]);
        } finally {
            setReassignLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.smallCollectionPointId]);

    const reassignDriver = useCallback(async (groupId: number, newCollectorId: string) => {
        setReassignLoading(true);
        try {
            await confirmReassignDriver(groupId, newCollectorId);
            await fetchGroups();
        } catch (error: any) {
            console.error('Error reassigning driver:', error);
        } finally {
            setReassignLoading(false);
        }
    }, [fetchGroups]);

    const fetchPreviewProducts = useCallback(
        async (
            vehicleId: string,
            workDate: { year: number; month: number; day: number; dayOfWeek: number },
            page: number = 1,
            pageSize: number = 10
        ) => {
            setLoading(true);
            try {
                const data = await previewProducts(vehicleId, workDate, page, pageSize);
                setPreviewProductsPaging(data);
            } catch (err) {
                console.error('fetchPreviewProducts error', err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const value: GroupingContextType = {
        loading,
        groupDetailLoading,
        reassignLoading,
        vehicles,
        pendingProducts,
        pendingProductsData,
        preAssignResult,
        autoGroupResult,
        groupDetail,
        groups,
        groupsPaging,
        groupsPage,
        groupsLimit,
        groupsTotalPage,
        driverCandidates,
        previewProductsPaging,
        fetchVehicles,
        fetchPendingProducts,
        fetchGroups,
        setGroupsPage,
        setGroupsLimit,
        getPreAssignSuggestion,
        createGrouping,
        calculateRoute,
        fetchGroupDetail,
        fetchDriverCandidates,
        reassignDriver,
        fetchPreviewProducts
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
