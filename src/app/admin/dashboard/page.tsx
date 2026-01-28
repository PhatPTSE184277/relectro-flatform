'use client';
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';
import ProductCategoryList from '@/components/admin/dashboard/ProductCategoryList';
import { useDashboardContext } from '@/contexts/admin/DashboardContext';
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
    const { summary, loading, fetchSummary, fetchSummaryByDay } = useDashboardContext();
    const [viewMode, setViewMode] = useState<'day' | 'range'>('range');
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [fromDate, setFromDate] = useState(getFirstDayOfMonthString());
    const [toDate, setToDate] = useState(getTodayString());

    useEffect(() => {
        if (viewMode === 'day') {
            fetchSummaryByDay(selectedDate);
        } else {
            fetchSummary(fromDate, toDate);
        }
    }, [viewMode, selectedDate, fromDate, toDate, fetchSummary, fetchSummaryByDay]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
            {/* Header with Mode Toggle and Date Picker */}
            <div className="mb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Thống kê</h1>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:gap-4 sm:items-center sm:justify-end">
                        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:gap-4 sm:items-center">
                            {viewMode === 'day' ? (
                                <div className="w-full max-w-xs mx-auto sm:mx-0">
                                    <CustomDatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        placeholder="Chọn ngày"
                                    />
                                </div>
                            ) : (
                                <div className="w-full max-w-xl mx-auto sm:mx-0">
                                    <CustomDateRangePicker
                                        fromDate={fromDate}
                                        toDate={toDate}
                                        onFromDateChange={setFromDate}
                                        onToDateChange={setToDate}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center bg-gray-100 rounded-lg w-full justify-center sm:w-auto sm:justify-start">
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
                    </div>
                </div>
            </div>

            {/* Card thống kê */}
            <DashboardStats
                totalUsers={normalizeStatDetail(summary?.totalUsers)}
                totalCompanies={normalizeStatDetail(summary?.totalCompanies)}
                totalProducts={normalizeStatDetail(summary?.totalProducts)}
                loading={loading}
            />
            {/* Danh sách danh mục sản phẩm */}
            <div>
                <ProductCategoryList
                    data={normalizeProductCategories(summary?.productCategories || [])}
                    total={normalizeStatDetail(summary?.totalProducts).currentValue}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default DashboardPage;