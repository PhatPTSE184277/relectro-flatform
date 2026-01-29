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
    PreviewProductsPagingResponse,
    previewVehicles as previewVehiclesAPI
} from '@/services/small-collector/GroupingService';
import { useAuth } from '@/hooks/useAuth';
import { getTodayString } from '@/utils/getDayString';

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


const GroupingContext = createContext<any | undefined>(undefined);

type Props = { children: ReactNode };

export function GroupingProvider({ children }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [groupDetailLoading, setGroupDetailLoading] = useState<boolean>(false);
    const [reassignLoading, setReassignLoading] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
    const [pendingProductsData, setPendingProductsData] = useState<PendingProductsResponse | null>(null);
    const [pendingProductsPage, setPendingProductsPage] = useState<number>(1);
    const [pendingProductsLimit, setPendingProductsLimit] = useState<number>(10);
    const [pendingProductsTotalPages, setPendingProductsTotalPages] = useState<number>(1);
    const [allProductIds, setAllProductIds] = useState<string[]>([]);
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
    const [previewVehicles, setPreviewVehicles] = useState<any[]>([]);

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

    const fetchVehicles = useCallback(async (workDate?: string) => {
        if (!user?.smallCollectionPointId) return;
        setLoading(true);
        try {
            const date = workDate || getTodayString();
            const data = await getVehicles(String(user.smallCollectionPointId), date);
            setVehicles(data);
        } catch (err) {
            console.error('fetchVehicles error', err);
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId]);
    const fetchAllProductIds = useCallback(async (workDate?: string) => {
        if (!user?.smallCollectionPointId) {
            console.log('No smallCollectionPointId', user);
            return;
        }
        
        try {
            const data = await getPendingGroupingProducts(
                String(user.smallCollectionPointId),
                workDate || getTodayString(),
                1,
                999999 // Get all products
            );
            const ids = data.products?.map((p: any) => p.productId) || [];
            setAllProductIds(ids);
        } catch (err) {
            console.error('fetchAllProductIds error', err);
            setAllProductIds([]);
        }
    }, [user]);
    const fetchPendingProducts = useCallback(async (workDate?: string, page?: number, limit?: number) => {
        if (!user?.smallCollectionPointId) {
            console.warn('No smallCollectionPointId found in user profile:', user);
            return;
        }
        
        const currentPage = page ?? pendingProductsPage;
        const currentLimit = limit ?? pendingProductsLimit;
        
        setLoading(true);
        try {
            const today = workDate || new Date().toISOString().split('T')[0];
            console.log('Fetching products for:', { smallPointId: user.smallCollectionPointId, workDate: today, page: currentPage, limit: currentLimit });
            const data = await getPendingGroupingProducts(user.smallCollectionPointId, today, currentPage, currentLimit);
            console.log('Products data received:', data);
            setPendingProductsData(data);
            setPendingProducts(data.products || []);
            setPendingProductsTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('fetchPendingProducts error', err);
        } finally {
            setLoading(false);
        }
    }, [user, pendingProductsPage, pendingProductsLimit]);

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
        async (assignments: { workDate: string; vehicleId: string; productIds: string[] }[]) => {
            if (!user?.smallCollectionPointId) {
                return;
            }
            setLoading(true);
            try {
                // Nhóm tất cả assignments theo workDate
                const groupedByDate: { [key: string]: typeof assignments } = {};
                assignments.forEach(assignment => {
                    if (!groupedByDate[assignment.workDate]) {
                        groupedByDate[assignment.workDate] = [];
                    }
                    groupedByDate[assignment.workDate].push(assignment);
                });
                
                // Gửi từng batch theo ngày
                for (const [workDateStr, dateAssignments] of Object.entries(groupedByDate)) {
                    const payload: AssignDayGroupingPayload = {
                        workDate: workDateStr,
                        assignments: dateAssignments.map(a => ({
                            vehicleId: String(a.vehicleId),
                            productIds: a.productIds
                        }))
                    };
                    
                    await assignDayGrouping(payload, user.smallCollectionPointId);
                }
                
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
            workDate: string,
            page: number = 1,
            pageSize: number = 10
        ) => {
            setLoading(true);
            try {
                const data = await previewProducts(vehicleId, workDate, page, pageSize);
                setPreviewProductsPaging(data);
                return data; // Return data for direct usage
            } catch (err) {
                console.error('fetchPreviewProducts error', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchPreviewVehicles = useCallback(
        async (workDate: string) => {
            if (!user?.smallCollectionPointId) return;
            setLoading(true);
            try {
                const data = await previewVehiclesAPI(String(user.smallCollectionPointId), workDate);
                setPreviewVehicles(data);
            } catch (err) {
                console.error('fetchPreviewVehicles error', err);
                setPreviewVehicles([]);
            } finally {
                setLoading(false);
            }
        },
        [user?.smallCollectionPointId]
    );

    const value: any = {
        loading,
        groupDetailLoading,
        reassignLoading,
        vehicles,
        pendingProducts,
        pendingProductsData,
        pendingProductsPage,
        pendingProductsLimit,
        pendingProductsTotalPages,
        allProductIds,
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
        previewVehicles,
        fetchVehicles,
        fetchPendingProducts,
        fetchAllProductIds,
        setPendingProductsPage,
        fetchGroups,
        setGroupsPage,
        setGroupsLimit,
        getPreAssignSuggestion,
        createGrouping,
        calculateRoute,
        fetchGroupDetail,
        fetchDriverCandidates,
        reassignDriver,
        fetchPreviewProducts,
        fetchPreviewVehicles
    };

    return (
        <GroupingContext.Provider value={value}>
            {children}
        </GroupingContext.Provider>
    );
}

export const useGroupingContext = (): any => {
    const ctx = useContext(GroupingContext);
    if (!ctx)
        throw new Error('useGroupingContext must be used within GroupingProvider');
    return ctx;
};

export default GroupingContext;
