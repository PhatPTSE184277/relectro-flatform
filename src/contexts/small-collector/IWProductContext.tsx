'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect,
    ReactNode
} from 'react';
import type { Product, CreateProductPayload } from '@/types/Product';
import {
    filterIncomingWarehouseProducts,
    receiveProductAtWarehouse,
    getProductByQRCode,
    createIncomingWarehouseProduct,
    getProductById
} from '@/services/small-collector/IWProductService';
import { useAuth } from '@/hooks/useAuth';

interface ProductFilter {
    page: number;
    limit: number;
    fromDate?: string;
    toDate?: string;
    status?: string;
    search?: string;
}

interface IWProductContextType {
    products: Product[];
    loading: boolean;
    detailLoading: boolean;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    fetchProducts: (fromDate?: string, toDate?: string) => Promise<void>;
    receiveProduct: (
        qrCode: string,
        productId?: string,
        description?: string | null,
        point?: number
    ) => Promise<void>;
    getProductByQRCode: (qrCode: string) => Promise<Product | null>;
    createProduct: (payload: CreateProductPayload) => Promise<void>;
    filter: ProductFilter;
    setFilter: (filter: Partial<ProductFilter>) => void;
    totalPages: number;
    totalItems: number;
    allStats: {
        total: number;
        pending: number;
        collected: number;
        cancelled: number;
        received: number;
    };
}

const IWProductContext = createContext<IWProductContextType | undefined>(
    undefined
);

type Props = { children: ReactNode };

export const IWProductProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [allStats, setAllStats] = useState({
        total: 0,
        pending: 0,
        collected: 0,
        cancelled: 0,
        received: 0
    });

    // Cache toàn bộ data đã fetch từ API
    const [allProductsData, setAllProductsData] = useState<Product[]>([]);
    const [filter, setFilterState] = useState<ProductFilter>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const firstDay = `${year}-${month}-01`;
        const currentDay = `${year}-${month}-${String(today.getDate()).padStart(
            2,
            '0'
        )}`;

        return {
            page: 1,
            limit: 10,
            fromDate: firstDay,
            toDate: currentDay,
            status: 'Chờ thu gom',
            search: ''
        };
    });

    // Chỉ reset page về 1 khi đổi filter khác ngoài page
    const setFilter = useCallback((newFilter: Partial<ProductFilter>) => {
        setFilterState((prev) => {
            // Nếu có thuộc tính page thì chỉ đổi page, giữ nguyên các filter khác
            if (Object.keys(newFilter).length === 1 && newFilter.page !== undefined) {
                return { ...prev, page: newFilter.page };
            }
            // Nếu đổi filter khác (status/search/fromDate/toDate/limit) thì reset page về 1
            return { ...prev, ...newFilter, page: 1 };
        });
    }, []);

    // Hàm apply filter và pagination TRÊN DATA ĐÃ CÓ
    const applyFilterAndPagination = useCallback(
        (allData: Product[], currentFilter: ProductFilter) => {
            // Filter theo status
            let filtered: Product[] = allData;

            if (currentFilter.status) {
                const statusLower = currentFilter.status.toLowerCase();
                filtered = filtered.filter((p) => {
                    const pStatus = p.status?.toLowerCase() || '';
                    if (statusLower.includes('chờ')) {
                        return pStatus.includes('chờ') || pStatus === 'pending';
                    }
                    if (statusLower.includes('đã thu')) {
                        return (
                            pStatus.includes('đã thu') ||
                            pStatus === 'collected'
                        );
                    }
                    if (statusLower.includes('hủy')) {
                        return (
                            pStatus.includes('hủy') || pStatus === 'cancelled'
                        );
                    }
                    if (statusLower.includes('nhập')) {
                        return (
                            pStatus.includes('nhập') || pStatus === 'received'
                        );
                    }
                    return false;
                });
            }

            // Filter theo search
            if (currentFilter.search && currentFilter.search.trim()) {
                const searchLower = currentFilter.search.toLowerCase();
                filtered = filtered.filter((p) => {
                    return (
                        p.categoryName?.toLowerCase().includes(searchLower) ||
                        p.brandName?.toLowerCase().includes(searchLower) ||
                        p.description?.toLowerCase().includes(searchLower) ||
                        p.qrCode?.toLowerCase().includes(searchLower)
                    );
                });
            }

            // Tính stats từ data sau khi filter theo date và search
            const dateAndSearchFiltered = allData.filter((p) => {
                if (currentFilter.search && currentFilter.search.trim()) {
                    const searchLower = currentFilter.search.toLowerCase();
                    const matchesSearch =
                        p.categoryName?.toLowerCase().includes(searchLower) ||
                        p.brandName?.toLowerCase().includes(searchLower) ||
                        p.description?.toLowerCase().includes(searchLower) ||
                        p.qrCode?.toLowerCase().includes(searchLower);
                    if (!matchesSearch) return false;
                }
                return true;
            });

            const stats = {
                total: dateAndSearchFiltered.length,
                pending: dateAndSearchFiltered.filter(
                    (p) =>
                        p.status?.toLowerCase().includes('chờ') ||
                        p.status === 'pending'
                ).length,
                collected: dateAndSearchFiltered.filter(
                    (p) =>
                        p.status?.toLowerCase().includes('đã thu') ||
                        p.status === 'collected'
                ).length,
                cancelled: dateAndSearchFiltered.filter(
                    (p) =>
                        p.status?.toLowerCase().includes('hủy') ||
                        p.status === 'cancelled'
                ).length,
                received: dateAndSearchFiltered.filter(
                    (p) =>
                        p.status?.toLowerCase().includes('nhập') ||
                        p.status === 'received'
                ).length
            };

            // Phân trang
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / currentFilter.limit);
            const startIndex = (currentFilter.page - 1) * currentFilter.limit;
            const endIndex = startIndex + currentFilter.limit;
            const paginatedProducts = filtered.slice(startIndex, endIndex);

            return { paginatedProducts, totalPages, totalItems, stats };
        },
        []
    );

    const fetchProducts = useCallback(
        async (fromDate?: string, toDate?: string) => {
            if (!user?.smallCollectionPointId) {
                console.warn('No smallCollectionPointId found in user profile');
                return;
            }
            setLoading(true);
            try {
                // Fetch toàn bộ data từ API - CHỈ DỰA VÀO fromDate/toDate
                const response = await filterIncomingWarehouseProducts({
                    fromDate: fromDate,
                    toDate: toDate,
                    smallCollectionPointId: user.smallCollectionPointId
                });

                const allData = Array.isArray(response) ? response : [];
                setAllProductsData(allData);
            } catch (err) {
                console.error('fetchProducts error', err);
                setProducts([]);
                setAllProductsData([]);
            } finally {
                setLoading(false);
            }
        },
        [user?.smallCollectionPointId]
    );

    const receiveProduct = useCallback(
        async (
            qrCode: string,
            productId?: string,
            description?: string | null,
            point?: number
        ) => {
            setLoading(true);
            try {
                await receiveProductAtWarehouse(
                    qrCode,
                    productId,
                    description,
                    point
                );
                await fetchProducts();
            } catch (err: any) {
                console.error('receiveProduct error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchProducts]
    );

    const getProductByQRCodeHandler = useCallback(async (qrCode: string) => {
        setDetailLoading(true);
        try {
            const product = await getProductByQRCode(qrCode);
            setSelectedProduct(product);
            return product;
        } catch (err) {
            console.error('getProductByQRCode error', err);
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const createProduct = useCallback(
        async (payload: CreateProductPayload) => {
            setLoading(true);
            try {
                await createIncomingWarehouseProduct(payload);
                await fetchProducts();
            } catch (err: any) {
                console.error('createProduct error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchProducts]
    );

    const getProductByIdHandler = useCallback(async (id: string) => {
        setDetailLoading(true);
        try {
            const product = await getProductById(id);
            setSelectedProduct(product);
            return product;
        } catch (err) {
            console.error('getProductById error', err);
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    // Fetch data từ API chỉ khi fromDate/toDate thay đổi
    useEffect(() => {
        if (filter.fromDate && filter.toDate) {
            void fetchProducts(filter.fromDate, filter.toDate);
        }
    }, [filter.fromDate, filter.toDate, fetchProducts]);

    // Apply filter và pagination khi page/status/search thay đổi (không fetch lại)
    useEffect(() => {
        if (allProductsData.length > 0) {
            const { paginatedProducts, totalPages, totalItems, stats } =
                applyFilterAndPagination(allProductsData, filter);

            setProducts(paginatedProducts);
            setTotalPages(totalPages);
            setTotalItems(totalItems);
            setAllStats(stats);
        } else if (allProductsData.length === 0 && !loading) {
            // Khi không có data, reset về state rỗng
            setProducts([]);
            setTotalPages(1);
            setTotalItems(0);
            setAllStats({
                total: 0,
                pending: 0,
                collected: 0,
                cancelled: 0,
                received: 0
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filter.page,
        filter.status,
        filter.search,
        filter.limit,
        allProductsData,
        applyFilterAndPagination,
        loading
    ]);

    const value = {
        products,
        loading,
        detailLoading,
        selectedProduct,
        setSelectedProduct,
        fetchProducts,
        receiveProduct,
        getProductByQRCode: getProductByQRCodeHandler,
        createProduct,
        filter,
        setFilter,
        totalPages,
        totalItems,
        allStats,
        getProductById: getProductByIdHandler
    };

    return (
        <IWProductContext.Provider value={value}>
            {children}
        </IWProductContext.Provider>
    );
};

export const useIWProductContext = (): IWProductContextType => {
    const ctx = useContext(IWProductContext);
    if (!ctx)
        throw new Error(
            'useIWProductContext must be used within IWProductProvider'
        );
    return ctx;
};

export default IWProductContext;
