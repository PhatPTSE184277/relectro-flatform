"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import DashboardStats from "@/components/collection-point/dashboard/DashboardStats";
import { getFirstDayOfMonthString, getTodayString } from "@/utils/getDayString";
import ProductCategoryList from "@/components/collection-point/dashboard/ProductCategoryList";
import PackageList from "@/components/collection-point/dashboard/PackageList";
import BrandList from "@/components/collection-point/dashboard/BrandList";
import TopUsersList from "@/components/collection-point/dashboard/TopUsersList";
import TopUserDetail from "@/components/collection-point/dashboard/modal/TopUserDetail";
import DashboardProductDetailModal from "@/components/collection-point/dashboard/modal/DashboardProductDetailModal";
import BrandDetail from "@/components/collection-point/dashboard/modal/BrandDetail";
import CustomDateRangePicker from "@/components/ui/CustomDateRangePicker";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { useDashboardContext } from "@/contexts/collection-point/DashboardContext";

const normalizeStatDetail = (data: any) => {
  if (typeof data === "object" && data !== null) return data;
  return {
    currentValue: Number(data) || 0,
    previousValue: 0,
    absoluteChange: Number(data) || 0,
    percentChange: 100,
    trend: "Increase" as const,
  };
};

const normalizeProductCategories = (categories: any[]) => {
  if (!Array.isArray(categories)) return [];
  return categories.map((cat: any) => ({
    categoryName: cat.categoryName,
    currentValue:
      typeof cat.currentValue === "number"
        ? cat.currentValue
        : (cat.count ?? 0),
    previousValue:
      typeof cat.previousValue === "number" ? cat.previousValue : 0,
    absoluteChange:
      typeof cat.absoluteChange === "number"
        ? cat.absoluteChange
        : (cat.count ?? 0),
    percentChange:
      typeof cat.percentChange === "number" ? cat.percentChange : 100,
    trend: cat.trend ?? "Increase",
  }));
};

const normalizeBrands = (brands: any[]) => {
  if (!Array.isArray(brands)) return [];
  return brands.map((brand: any) => ({
    brandName: brand.brandName,
    currentValue:
      typeof brand.currentValue === "number" ? brand.currentValue : 0,
    previousValue:
      typeof brand.previousValue === "number" ? brand.previousValue : 0,
    absoluteChange:
      typeof brand.absoluteChange === "number" ? brand.absoluteChange : 0,
    percentChange:
      typeof brand.percentChange === "number" ? brand.percentChange : 0,
    trend: brand.trend ?? "Increase",
  }));
};

export default function DashboardPage() {
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
    fetchBrandDetails,
    fetchProductDetail,
    clearSelectedProductDetail,
    updateProductPoint,
    fetchPackageStats,
  } = useDashboardContext();

  const [viewMode, setViewMode] = useState<"day" | "range">("range");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [fromDate, setFromDate] = useState(getFirstDayOfMonthString());
  const [toDate, setToDate] = useState(getTodayString());
  const [statsView, setStatsView] = useState<
    "package" | "product" | "brand" | "top-users"
  >("product");
  const [packageStats, setPackageStats] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedBrandName, setSelectedBrandName] = useState<string | null>(
    null,
  );
  const [showBrandDetailModal, setShowBrandDetailModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [brandDetailPage, setBrandDetailPage] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);

  const currentRange = useMemo(
    () =>
      viewMode === "day"
        ? { from: selectedDate, to: selectedDate }
        : { from: fromDate, to: toDate },
    [viewMode, selectedDate, fromDate, toDate],
  );

  const handleStatsViewChange = (
    view: "package" | "product" | "brand" | "top-users",
  ) => {
    setStatsView(view);
    if (view === "package" || view === "top-users") setViewMode("range");
  };

  const handleOpenUserDetail = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
    fetchUserProducts(user.userId);
  };
  const handleCloseUserDetail = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };
  const handleOpenBrandDetail = async (brandName: string) => {
    setSelectedBrandName(brandName);
    setBrandDetailPage(1);
    setShowBrandDetailModal(true);
    await fetchBrandDetails(
      brandName,
      currentRange.from,
      currentRange.to,
      1,
      10,
    );
  };
  const handleCloseBrandDetail = () => {
    setShowBrandDetailModal(false);
    setSelectedBrandName(null);
  };
  const handleOpenProductDetail = async (productId: string) => {
    await fetchProductDetail(productId);
    setShowProductDetailModal(true);
  };
  const handleCloseProductDetail = () => {
    setShowProductDetailModal(false);
    clearSelectedProductDetail();
  };
  const handleConfirmProductPoint = async (
    productId: string,
    newPointValue: number,
    reasonForUpdate: string,
  ) => {
    const updated = await updateProductPoint(
      productId,
      newPointValue,
      reasonForUpdate,
    );
    if (updated) {
      await fetchProductDetail(productId);
      handleCloseProductDetail();
    }
  };
  const handleBrandDetailPageChange = async (page: number) => {
    if (!selectedBrandName) return;
    setBrandDetailPage(page);
    await fetchBrandDetails(
      selectedBrandName,
      currentRange.from,
      currentRange.to,
      page,
      10,
    );
  };


  useEffect(() => {
    const run = async () => {
      if (statsView === "product") {
        if (viewMode === "day") await fetchSummaryByDay(selectedDate);
        else await fetchSummary(fromDate, toDate);
      }
      if (statsView === "brand") {
        if (viewMode === "day") await fetchBrandSummaryByDay(selectedDate);
        else await fetchBrandSummary(fromDate, toDate);
      }
      if (statsView === "top-users") await fetchTopUsers(fromDate, toDate, 20);
      if (statsView === "package")
        setPackageStats(await fetchPackageStats(fromDate, toDate));
    };
    void run();
  }, [
    viewMode,
    selectedDate,
    fromDate,
    toDate,
    statsView,
    fetchSummary,
    fetchSummaryByDay,
    fetchBrandSummary,
    fetchBrandSummaryByDay,
    fetchTopUsers,
    fetchPackageStats,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Thống kê</h1>
          </div>
          <div className="flex gap-4 items-center flex-1 justify-end">
            {viewMode === "day" ? (
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
            {statsView !== "package" && statsView !== "top-users" && (
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode("day")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === "day" ? "bg-primary-600 text-white" : "text-gray-600"}`}
                  >
                    Theo ngày
                  </button>
                  <button
                    onClick={() => setViewMode("range")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === "range" ? "bg-primary-600 text-white" : "text-gray-600"}`}
                  >
                    Theo khoảng
                  </button>
                </div>
              )}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-wrap gap-1">
              <button
                onClick={() => handleStatsViewChange("package")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${statsView === "package" ? "bg-primary-600 text-white" : "text-gray-600"}`}
              >
                Kiện hàng
              </button>
              <button
                onClick={() => handleStatsViewChange("product")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${statsView === "product" ? "bg-primary-600 text-white" : "text-gray-600"}`}
              >
                Sản phẩm
              </button>
              <button
                onClick={() => handleStatsViewChange("brand")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${statsView === "brand" ? "bg-primary-600 text-white" : "text-gray-600"}`}
              >
                Thương hiệu
              </button>
              <button
                onClick={() => handleStatsViewChange("top-users")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${statsView === "top-users" ? "bg-primary-600 text-white" : "text-gray-600"}`}
              >
                Top người dùng
              </button>
            </div>
          </div>
        </div>
      </div>

      <DashboardStats
        totalPackages={normalizeStatDetail(packageStats?.totalPackages || 0)}
        totalProducts={normalizeStatDetail(
          statsView === "brand"
            ? brandSummary?.totalProducts
            : summary?.totalProducts,
        )}
        loading={loading}
        viewMode={
          statsView === "package"
            ? "package"
            : statsView === "product"
              ? "product"
              : "all"
        }
      />

      <div>
        {statsView === "package" ? (
          <PackageList
            dailyStats={packageStats?.dailyStats || []}
            loading={loading}
          />
        ) : statsView === "brand" ? (
          <BrandList
            data={normalizeBrands(brandSummary?.brands || [])}
            total={
              normalizeStatDetail(brandSummary?.totalProducts).currentValue
            }
            loading={loading}
            onViewDetail={handleOpenBrandDetail}
          />
        ) : statsView === "top-users" ? (
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

      <TopUserDetail
        user={showUserModal ? selectedUser : null}
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
        brandName={selectedBrandName || ""}
        detail={brandDetails}
        loading={loading}
        onClose={handleCloseBrandDetail}
        onPageChange={handleBrandDetailPageChange}
      />
    </div>
  );
}
