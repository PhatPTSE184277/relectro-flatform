'use client';
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/small-collector/dashboard/DashboardStats';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';
import ProductCategoryList from '@/components/small-collector/dashboard/ProductCategoryList';
import DailyPackageStats from '@/components/small-collector/dashboard/DailyPackageStats';
import { useDashboardContext } from '@/contexts/small-collector/DashboardContext';
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

const DashboardPage = () => {
    const { summary, loading, fetchSummary, fetchSummaryByDay, fetchPackageStats } = useDashboardContext();
    const [viewMode, setViewMode] = useState<'day' | 'range'>('range');
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [fromDate, setFromDate] = useState(getFirstDayOfMonthString());
    const [toDate, setToDate] = useState(getTodayString());
    const [packageStats, setPackageStats] = useState<any>(null);
    const [statsView, setStatsView] = useState<'package' | 'product'>('package');

    // Handler để chuyển đổi stats view
    const handleStatsViewChange = (view: 'package' | 'product') => {
        setStatsView(view);
        // Khi chọn package, force về range mode
        if (view === 'package') {
            setViewMode('range');
        }
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
                            <div className="w-full max-w-xs">
                                <CustomDatePicker
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    placeholder="Chọn ngày"
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-xl">
                                <CustomDateRangePicker
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    onFromDateChange={setFromDate}
                                    onToDateChange={setToDate}
                                />
                            </div>
                        )}

                        {/* Chỉ hiển thị day/range toggle khi ở product view */}
                        {statsView === 'product' && (
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Card thống kê */}
            <DashboardStats
                totalPackages={normalizeStatDetail(packageStats?.totalPackages || 0)}
                totalProducts={normalizeStatDetail(summary?.totalProducts)}
                loading={loading}
            />

            {/* Conditional Stats Display */}
            <div>
                {statsView === 'package' ? (
                    <DailyPackageStats
                        dailyStats={packageStats?.dailyStats || []}
                        loading={loading}
                    />
                ) : (
                    <ProductCategoryList
                        data={normalizeProductCategories(summary?.productCategories || [])}
                        total={normalizeStatDetail(summary?.totalProducts).currentValue}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
