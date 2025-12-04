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
    Vehicle,
    PreAssignGroupingPayload,
    AssignDayGroupingPayload,
    AutoGroupPayload,
    PendingProductsResponse
} from '@/services/small-collector/GroupingService';
import { toast } from 'react-toastify';
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
    vehicles: Vehicle[];
    pendingProducts: PendingProduct[];
    pendingProductsData: PendingProductsResponse | null;
    preAssignResult: PreAssignResponse | null;
    autoGroupResult: any | null;
    groupDetail: any | null;
    groups: any[];
    fetchVehicles: () => Promise<void>;
    fetchPendingProducts: (workDate?: string) => Promise<void>;
    fetchGroups: () => Promise<void>;
    getPreAssignSuggestion: (loadThresholdPercent: number) => Promise<void>;
    createGrouping: (payload: AssignDayGroupingPayload) => Promise<void>;
    calculateRoute: (saveResult: boolean) => Promise<void>;
    fetchGroupDetail: (groupId: number) => Promise<void>;
}

const GroupingContext = createContext<GroupingContextType | undefined>(undefined);

type Props = { children: ReactNode };

export function GroupingProvider({ children }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [groupDetailLoading, setGroupDetailLoading] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
    const [pendingProductsData, setPendingProductsData] = useState<PendingProductsResponse | null>(null);
    const [preAssignResult, setPreAssignResult] = useState<PreAssignResponse | null>(null);
    const [autoGroupResult, setAutoGroupResult] = useState<any | null>(null);
    const [groupDetail, setGroupDetail] = useState<any | null>(null);
    const [groups, setGroups] = useState<any[]>([]);
    const fetchGroups = useCallback(async () => {
        if (!user?.smallCollectionPointId) return;
        setLoading(true);
        try {
            const data = await getGroupsByCollectionPointId(user.smallCollectionPointId);
            setGroups(data);
        } catch (err) {
            console.error('fetchGroups error', err);
            toast.error('Lỗi khi tải danh sách nhóm thu gom');
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId]);

    const fetchVehicles = useCallback(async () => {
        if (!user?.smallCollectionPointId) return;
        setLoading(true);
        try {
            const data = await getVehicles(user.smallCollectionPointId);
            setVehicles(data);
        } catch (err) {
            console.error('fetchVehicles error', err);
            toast.error('Lỗi khi tải danh sách phương tiện');
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
            toast.error('Lỗi khi tải danh sách sản phẩm chờ gom nhóm');
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId]);

    const getPreAssignSuggestion = useCallback(
        async (loadThresholdPercent: number) => {
            if (!user?.smallCollectionPointId) {
                toast.error('Không tìm thấy thông tin điểm thu gom');
                return;
            }
            setLoading(true);
            try {
                const payload: PreAssignGroupingPayload = {
                    loadThresholdPercent
                };
                const data = await preAssignGrouping(payload, user.smallCollectionPointId);
                console.log('PreAssign result:', data);
                console.log('Days structure:', data?.days);
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
        [user?.smallCollectionPointId]
    );

    const createGrouping = useCallback(
        async (payload: AssignDayGroupingPayload) => {
            if (!user?.smallCollectionPointId) {
                toast.error('Không tìm thấy thông tin điểm thu gom');
                return;
            }
            setLoading(true);
            try {
                await assignDayGrouping(payload, user.smallCollectionPointId);
                toast.success('Tạo nhóm thu gom thành công');
                // Refresh pending products after creating grouping
                await fetchPendingProducts();
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
        [user?.smallCollectionPointId, fetchPendingProducts]
    );

    const calculateRoute = useCallback(async (saveResult: boolean) => {
        if (!user?.smallCollectionPointId) {
            toast.error('Không tìm thấy thông tin điểm thu gom');
            return;
        }
        setLoading(true);
        try {
            const payload: AutoGroupPayload = { saveResult };
            const data = await autoGroup(payload, user.smallCollectionPointId);
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
    }, [user?.smallCollectionPointId]);

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
        pendingProducts,
        pendingProductsData,
        preAssignResult,
        autoGroupResult,
        groupDetail,
        groups,
        fetchVehicles,
        fetchPendingProducts,
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
