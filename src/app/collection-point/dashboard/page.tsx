'use client';
import { useEffect, useState } from 'react';
import DashboardStats from '@/components/collection-point/dashboard/DashboardStats';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';
import ProductCategoryList from '@/components/collection-point/dashboard/ProductCategoryList';
import PackageList from '@/components/collection-point/dashboard/PackageList';
import BrandList from '@/components/collection-point/dashboard/BrandList';
import TopUsersList from '@/components/collection-point/dashboard/TopUsersList';
import TopUserDetail from '@/components/collection-point/dashboard/modal/TopUserDetail';
import DashboardProductDetailModal from '@/components/collection-point/dashboard/modal/DashboardProductDetailModal';
import BrandDetail from '@/components/collection-point/dashboard/modal/BrandDetail';
import { useDashboardContext } from '@/contexts/collection-point/DashboardContext';
import { LayoutDashboard } from 'lucide-react';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

// Helper to normalize stat data
const normalizeStatDetail = (data: any) => {
    if (typeof data === 'object' && data !== null) return data;
    return {
        currentValue: Number(data) || 0,
        previousValue: 0,
        absoluteChange: Number(data) || 0,
        percentChange: 100,
        trend: 'Increase' as const
    };
};

// Helper to normalize product categories
const normalizeProductCategories = (categories: any[]) => {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat: any) => ({
        categoryName: cat.categoryName,
        currentValue: typeof cat.currentValue === 'number' ? cat.currentValue : (cat.count ?? 0),
        previousValue: typeof cat.previousValue === 'number' ? cat.previousValue : 0,
        absoluteChange: typeof cat.absoluteChange === 'number' ? cat.absoluteChange : (cat.count ?? 0),
        percentChange: typeof cat.percentChange === 'number' ? cat.percentChange : 100,
        trend: cat.trend ?? 'Increase'
    }));
};

// Helper to normalize brand stats
const normalizeBrands = (brands: any[]) => {
    if (!Array.isArray(brands)) return [];
    return brands.map((brand: any) => ({
        brandName: brand.brandName,
        currentValue: typeof brand.currentValue === 'number' ? brand.currentValue : 0,
        previousValue: typeof brand.previousValue === 'number' ? brand.previousValue : 0,
        absoluteChange: typeof brand.absoluteChange === 'number' ? brand.absoluteChange : 0,
        percentChange: typeof brand.percentChange === 'number' ? brand.percentChange : 0,
        trend: brand.trend ?? 'Increase'
    }));
};

const DashboardPage = () => {
    const {
        summary,
        brandSummary,
        topUsers,
          userProducts,
          brandDetails,
                selectedProductDetail,
                productDetailLoading,
                pointUpdateLoading,
        loading,
        fetchSummary,
        fetchSummaryByDay,
        fetchBrandSummary,
        fetchBrandSummaryByDay,
        fetchTopUsers,
          fetchUserProducts,
                fetchProductDetail,
                clearSelectedProductDetail,
                updateProductPoint,
          fetchBrandDetails,
        fetchPackageStats
    } = useDashboardContext();
    const [viewMode, setViewMode] = useState<'day' | 'range'>('range');
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [fromDate, setFromDate] = useState(getFirstDayOfMonthString());
    const [toDate, setToDate] = useState(getTodayString());
    const [packageStats, setPackageStats] = useState<any>(null);
    const [statsView, setStatsView] = useState<'package' | 'product' | 'brand' | 'top-users'>('package');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedBrandName, setSelectedBrandName] = useState<string | null>(null);
    const [showBrandDetailModal, setShowBrandDetailModal] = useState(false);
    const [showProductDetailModal, setShowProductDetailModal] = useState(false);
    const [, setBrandDetailPage] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getCurrentRange = () => {
        if (viewMode === 'day') {
            return { from: selectedDate, to: selectedDate };
        }
        return { from: fromDate, to: toDate };
    };

    // Handler để chuyển đổi stats view
    const handleStatsViewChange = (view: 'package' | 'product' | 'brand' | 'top-users') => {
        setStatsView(view);
        // Khi chọn package, force về range mode
        if (view === 'package') {
            setViewMode('range');
        }
    };

    // Handler để mở/đóng modal chi tiết user
    const handleOpenUserDetail = (user: any) => {
        setSelectedUser(user);
        setShowDetailModal(true);
           fetchUserProducts(user.userId);
    };

    const handleOpenProductDetail = async (productId: string) => {
        await fetchProductDetail(productId);
        setShowProductDetailModal(true);
    };

    const handleCloseUserDetail = () => {
        setShowDetailModal(false);
        setSelectedUser(null);
    };

    const handleOpenBrandDetail = async (brandName: string) => {
        const range = getCurrentRange();
        setSelectedBrandName(brandName);
        setBrandDetailPage(1);
        setShowBrandDetailModal(true);
        await fetchBrandDetails(brandName, range.from, range.to, 1, 10);
    };

    const handleCloseBrandDetail = () => {
        setShowBrandDetailModal(false);
        setSelectedBrandName(null);
        setBrandDetailPage(1);
    };

    const handleCloseProductDetail = () => {
        setShowProductDetailModal(false);
        clearSelectedProductDetail();
    };

    const handleConfirmProductPoint = async (productId: string, newPointValue: number, reasonForUpdate: string) => {
        const updated = await updateProductPoint(productId, newPointValue, reasonForUpdate);
        if (updated) {
            await fetchProductDetail(productId);
            setShowProductDetailModal(false);
            clearSelectedProductDetail();
        }
    };

    const handleBrandDetailPageChange = async (page: number) => {
        if (!selectedBrandName) return;
        const range = getCurrentRange();
        setBrandDetailPage(page);
        await fetchBrandDetails(selectedBrandName, range.from, range.to, page, 10);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch product stats theo mode được chọn
            if (statsView === 'product') {
                if (viewMode === 'day') {
                        await fetchSummaryByDay(selectedDate);
                } else {
                        await fetchSummary(fromDate, toDate);
                }
            }

            if (statsView === 'brand') {
                if (viewMode === 'day') {
                    await fetchBrandSummaryByDay(selectedDate);
                } else {
                    await fetchBrandSummary(fromDate, toDate);
                }
            }

            if (statsView === 'top-users') {
                await fetchTopUsers(fromDate, toDate, 20);
            }

            // Fetch package stats chỉ theo range
            if (statsView === 'package') {
                    await fetchSummary(fromDate, toDate);
                    const pkgStats = await fetchPackageStats(fromDate, toDate);
                    setPackageStats(pkgStats);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, selectedDate, fromDate, toDate, statsView]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
            {/* Header with Mode Toggle and Date Picker */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Thống kê</h1>
                    </div>
                    <div className="flex gap-4 items-center flex-1 justify-end">
                        {viewMode === 'day' ? (
                            <div className="max-w-xs">
                                <CustomDatePicker
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    placeholder="Chọn ngày"
                                />
                            </div>
                        ) : (
                            <div className="min-w-fit">
                                <CustomDateRangePicker
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    onFromDateChange={setFromDate}
                                    onToDateChange={setToDate}
                                />
                            </div>
                        )}

                        {/* Chỉ hiển thị day/range toggle khi ở product hoặc brand view */}
                        {statsView !== 'package' && statsView !== 'top-users' && (
                            <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => setViewMode('day')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                        viewMode === 'day'
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Theo ngày
                                </button>
                                <button
                                    onClick={() => setViewMode('range')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                        viewMode === 'range'
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Theo khoảng
                                </button>
                            </div>
                        )}

                        {/* Toggle View: Package vs Product */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => handleStatsViewChange('package')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    statsView === 'package'
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Kiện hàng
                            </button>
                            <button
                                onClick={() => handleStatsViewChange('product')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    statsView === 'product'
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Sản phẩm
                            </button>
                            <button
                                onClick={() => handleStatsViewChange('brand')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    statsView === 'brand'
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Thương hiệu
                            </button>
                            <button
                                onClick={() => handleStatsViewChange('top-users')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    statsView === 'top-users'
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Top người dùng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card thống kê */}
            <DashboardStats
                totalPackages={normalizeStatDetail(packageStats?.totalPackages || 0)}
                totalProducts={normalizeStatDetail(
                    statsView === 'brand' ? brandSummary?.totalProducts : summary?.totalProducts
                )}
                loading={loading}
                viewMode={
                    statsView === 'package'
                        ? 'package'
                        : statsView === 'product'
                        ? 'product'
                        : 'all'
                }
            />

            {/* Conditional Stats Display */}
            <div>
                {statsView === 'package' ? (
                    <PackageList
                        dailyStats={packageStats?.dailyStats || []}
                        loading={loading}
                    />
                ) : statsView === 'brand' ? (
                    <BrandList
                        data={normalizeBrands(brandSummary?.brands || [])}
                        total={normalizeStatDetail(brandSummary?.totalProducts).currentValue}
                        loading={loading}
                        onViewDetail={handleOpenBrandDetail}
                    />
                ) : statsView === 'top-users' ? (
                    <TopUsersList
                        data={topUsers?.topUsers || []}
                        loading={loading}
                        onUserClick={handleOpenUserDetail}
                    />
                ) : (
                    <ProductCategoryList
                        data={normalizeProductCategories(summary?.productCategories || [])}
                        total={normalizeStatDetail(summary?.totalProducts).currentValue}
                        loading={loading}
                    />
                )}
            </div>

            {/* Top User Detail Modal */}
            <TopUserDetail
                user={selectedUser}
                onClose={handleCloseUserDetail}
                products={userProducts}
                loading={loading}
                startIndex={0}
                onViewProductDetail={handleOpenProductDetail}
            />

            <DashboardProductDetailModal
                open={showProductDetailModal}
                product={selectedProductDetail}
                loading={productDetailLoading}
                submitting={pointUpdateLoading}
                onClose={handleCloseProductDetail}
                onConfirm={handleConfirmProductPoint}
                onRefreshProduct={fetchProductDetail}
            />

            <BrandDetail
                open={showBrandDetailModal}
                brandName={selectedBrandName || ''}
                detail={brandDetails}
                loading={loading}
                onClose={handleCloseBrandDetail}
                onPageChange={handleBrandDetailPageChange}
            />
        </div>
    );
};

export default DashboardPage;
