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
    getProductByQRCode
} from '@/services/collector/IWProductService';
import { toast } from 'react-toastify';

interface ProductContextType {
    products: any[];
    loading: boolean;
    selectedProduct: any;
    setSelectedProduct: (product: any) => void;
    fetchProducts: (customFilter?: Partial<ProductFilter>) => Promise<void>;
    receiveProduct: (qrCode: string) => Promise<void>;
    getProductByQRCode: (qrCode: string) => Promise<any>;
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

const ProductContext = createContext<ProductContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const ProductProvider: React.FC<Props> = ({ children }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
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

    // Chỉ cập nhật filter khi thực sự muốn thay đổi filter gốc
    const setFilter = (newFilter: Partial<ProductFilter>) => {
        setFilterState((prev) => ({ ...prev, ...newFilter }));
    };

    // Nếu truyền customFilter thì chỉ filter tạm thời, không set lại filter gốc
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

    // Thêm hàm lấy sản phẩm theo QR code
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

    useEffect(() => {
        void fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const value: ProductContextType = {
        products,
        loading,
        selectedProduct,
        setSelectedProduct,
        fetchProducts,
        receiveProduct,
        getProductByQRCode: getProductByQRCodeHandler,
        filter,
        setFilter,
        totalPages,
        totalItems,
        allStats
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = (): ProductContextType => {
    const ctx = useContext(ProductContext);
    if (!ctx)
        throw new Error(
            'useProductContext must be used within ProductProvider'
        );
    return ctx;
};

export default ProductContext;