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
    filterIncomingWarehouseProducts,
    receiveProductAtWarehouse,
    getProductByQRCode,
    createIncomingWarehouseProduct,
    Product,
    CreateProductPayload
} from '@/services/collector/IWProductService';
import { toast } from 'react-toastify';

interface ProductFilter {
    page: number;
    limit: number;
    pickUpDate?: {
        year?: number;
        month?: number;
        day?: number;
        dayOfWeek?: number;
    };
    smallCollectionPointId?: number;
    status?: string;
}

interface IWProductContextType {
    products: Product[];
    loading: boolean;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    fetchProducts: (customFilter?: Partial<ProductFilter>) => Promise<void>;
    receiveProduct: (qrCode: string) => Promise<void>;
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

const IWProductContext = createContext<IWProductContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const IWProductProvider: React.FC<Props> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [allStats, setAllStats] = useState({
        total: 0,
        pending: 0,
        collected: 0,
        cancelled: 0,
        received: 0
    });

    const [filter, setFilterState] = useState<ProductFilter>({
        page: 1,
        limit: 10,
        pickUpDate: undefined,
        smallCollectionPointId: undefined,
        status: 'Chờ thu gom'
    });

    const setFilter = (newFilter: Partial<ProductFilter>) => {
        setFilterState((prev) => ({ ...prev, ...newFilter }));
    };

    const fetchProducts = useCallback(
        async (customFilter?: Partial<ProductFilter>) => {
            setLoading(true);
            try {
                const params: Record<string, any> = {
                    ...filter,
                    ...customFilter
                };
                Object.keys(params).forEach(
                    (key) => params[key] === undefined && delete params[key]
                );
                const response = await filterIncomingWarehouseProducts(params);

                setProducts(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);

                // Tính toán stats từ dữ liệu
                const allProductsResponse = await filterIncomingWarehouseProducts({
                    page: 1,
                    limit: 1000,
                    pickUpDate: params.pickUpDate,
                    smallCollectionPointId: params.smallCollectionPointId
                });

                const allProducts = allProductsResponse.data || [];
                setAllStats({
                    total: allProducts.length,
                    pending: allProducts.filter((p: any) =>
                        p.status?.toLowerCase().includes('chờ') || p.status?.toLowerCase() === 'pending'
                    ).length,
                    collected: allProducts.filter((p: any) =>
                        p.status?.toLowerCase().includes('đã thu') || p.status?.toLowerCase() === 'collected'
                    ).length,
                    cancelled: allProducts.filter((p: any) =>
                        p.status?.toLowerCase().includes('hủy') || p.status?.toLowerCase() === 'cancelled'
                    ).length,
                    received: allProducts.filter((p: any) =>
                        p.status?.toLowerCase().includes('nhập') || p.status?.toLowerCase() === 'received'
                    ).length
                });
            } catch (err) {
                console.error('fetchProducts error', err);
                toast.error('Lỗi khi tải danh sách sản phẩm');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        },
        [filter]
    );

    const receiveProduct = useCallback(
        async (qrCode: string) => {
            setLoading(true);
            try {
                await receiveProductAtWarehouse(qrCode);
                toast.success('Nhận sản phẩm tại kho thành công');
                await fetchProducts();
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
        [fetchProducts]
    );

    const getProductByQRCodeHandler = useCallback(
        async (qrCode: string) => {
            setLoading(true);
            try {
                const product = await getProductByQRCode(qrCode);
                setSelectedProduct(product);
                return product;
            } catch (err) {
                console.error('getProductByQRCode error', err);
                toast.error('Không tìm thấy sản phẩm với mã QR này');
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createProduct = useCallback(
        async (payload: CreateProductPayload) => {
            setLoading(true);
            try {
                await createIncomingWarehouseProduct(payload);
                toast.success('Tạo sản phẩm nhập kho thành công');
                await fetchProducts();
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
        [fetchProducts]
    );

    useEffect(() => {
        void fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const value: IWProductContextType = {
        products,
        loading,
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
        allStats
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