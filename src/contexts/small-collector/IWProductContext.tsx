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
import { toast } from 'react-toastify';

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
    fetchProducts: (customFilter?: Partial<ProductFilter>) => Promise<void>;
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

    const [allProductsData, setAllProductsData] = useState<Product[]>([]);
    const [filter, setFilterState] = useState<ProductFilter>({
        page: 1,
        limit: 10,
        fromDate: undefined,
        toDate: undefined,
        status: 'Chờ thu gom',
        search: ''
    });

    const setFilter = (newFilter: Partial<ProductFilter>) => {
        setFilterState((prev) => ({ ...prev, ...newFilter }));
    };

    const fetchProducts = useCallback(
        async (customFilter?: Partial<ProductFilter>) => {
            setLoading(true);
            try {
                // Merge filter
                const mergedFilter = { ...filter, ...customFilter };

                // Fetch toàn bộ data từ API với fromDate, toDate, smallCollectionPointId
                const response = await filterIncomingWarehouseProducts({
                    fromDate: mergedFilter.fromDate,
                    toDate: mergedFilter.toDate,
                    smallCollectionPointId: 1
                });

                // Nếu API trả về mảng, dùng trực tiếp:
                const allData = Array.isArray(response) ? response : [];
                setAllProductsData(allData);

                // Filter trên FE theo fromDate, toDate, status
                let filtered: Product[] = allData;

                // Filter theo status
                if (mergedFilter.status) {
                    const statusLower = mergedFilter.status.toLowerCase();
                    filtered = filtered.filter((p) => {
                        const pStatus = p.status?.toLowerCase() || '';
                        if (statusLower.includes('chờ')) {
                            return (
                                pStatus.includes('chờ') || pStatus === 'pending'
                            );
                        }
                        if (statusLower.includes('đã thu')) {
                            return (
                                pStatus.includes('đã thu') ||
                                pStatus === 'collected'
                            );
                        }
                        if (statusLower.includes('hủy')) {
                            return (
                                pStatus.includes('hủy') ||
                                pStatus === 'cancelled'
                            );
                        }
                        if (statusLower.includes('nhập')) {
                            return (
                                pStatus.includes('nhập') ||
                                pStatus === 'received'
                            );
                        }
                        return false;
                    });
                }

                // Filter theo search (TRƯỚC KHI PHÂN TRANG)
                if (mergedFilter.search && mergedFilter.search.trim()) {
                    const searchLower = mergedFilter.search.toLowerCase();
                    filtered = filtered.filter((p) => {
                        return (
                            p.categoryName
                                ?.toLowerCase()
                                .includes(searchLower) ||
                            p.brandName?.toLowerCase().includes(searchLower) ||
                            p.description
                                ?.toLowerCase()
                                .includes(searchLower) ||
                            p.qrCode?.toLowerCase().includes(searchLower)
                        );
                    });
                }

                // Tính stats từ ALL data (không phải filtered)
                const stats = {
                    total: allData.length,
                    pending: allData.filter(
                        (p) =>
                            p.status?.toLowerCase().includes('chờ') ||
                            p.status === 'pending'
                    ).length,
                    collected: allData.filter(
                        (p) =>
                            p.status?.toLowerCase().includes('đã thu') ||
                            p.status === 'collected'
                    ).length,
                    cancelled: allData.filter(
                        (p) =>
                            p.status?.toLowerCase().includes('hủy') ||
                            p.status === 'cancelled'
                    ).length,
                    received: allData.filter(
                        (p) =>
                            p.status?.toLowerCase().includes('nhập') ||
                            p.status === 'received'
                    ).length
                };
                setAllStats(stats);

                // Phân trang trên FE
                const totalItems = filtered.length;
                const totalPages = Math.ceil(totalItems / mergedFilter.limit);
                const startIndex = (mergedFilter.page - 1) * mergedFilter.limit;
                const endIndex = startIndex + mergedFilter.limit;
                const paginatedProducts = filtered.slice(startIndex, endIndex);

                console.log(paginatedProducts);

                setProducts(paginatedProducts);
                setTotalPages(totalPages);
                setTotalItems(totalItems);
            } catch (err) {
                console.error('fetchProducts error', err);
                toast.error('Lỗi khi tải danh sách sản phẩm');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        },
        []
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
                toast.success('Nhận sản phẩm tại kho thành công');
                await fetchProducts(filter);
            } catch (err: any) {
                console.error('receiveProduct error', err);
                toast.error(
                    err?.response?.data?.message ||
                        'Lỗi khi nhận sản phẩm tại kho'
                );
            } finally {
                setLoading(false);
            }
        },
        [fetchProducts, filter]
    );

    const getProductByQRCodeHandler = useCallback(async (qrCode: string) => {
        setDetailLoading(true);
        try {
            const product = await getProductByQRCode(qrCode);
            setSelectedProduct(product);
            return product;
        } catch (err) {
            console.error('getProductByQRCode error', err);
            toast.error('Không tìm thấy sản phẩm với mã QR này');
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
                toast.success('Tạo sản phẩm nhập kho thành công');
                await fetchProducts(filter);
            } catch (err: any) {
                console.error('createProduct error', err);
                toast.error(
                    err?.response?.data?.message ||
                        'Lỗi khi tạo sản phẩm nhập kho'
                );
            } finally {
                setLoading(false);
            }
        },
        [fetchProducts, filter]
    );

    // Add getProductById handler
    const getProductByIdHandler = useCallback(async (id: string) => {
        setDetailLoading(true);
        try {
            const product = await getProductById(id);
            setSelectedProduct(product);
            return product;
        } catch (err) {
            console.error('getProductById error', err);
            toast.error('Không tìm thấy sản phẩm với ID này');
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProducts(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filter.page,
        filter.status,
        filter.search,
        filter.fromDate,
        filter.toDate
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
