'use client';
import React, { useEffect, useState } from 'react';
import LineChart from '@/components/charts/LineChart';
import LineChartSkeleton from '@/components/charts/LineChartSkeleton';
import ProductCategoryChart from '@/components/charts/ProductCategoryChart';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import { DashboardProvider, useDashboardContext } from '@/contexts/admin/DashboardContext';
import { Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';

const BarChartSkeleton = dynamic(
    () => import('@/components/charts/BarChartSkereton'),
    { ssr: false }
);

const chartTabs = [
    { key: 'user', label: 'Người dùng' },
    { key: 'product', label: 'Sản phẩm' },
    { key: 'shipping', label: 'Vận chuyển' }
];

const DashboardContent = () => {
    const { summary, loading, fetchSummary } = useDashboardContext();
    const [activeTab, setActiveTab] = useState('user');
    const [year, setYear] = useState('2025');
    const [fromDate, setFromDate] = useState('2025-12-01');
    const [toDate, setToDate] = useState('2025-12-31');

    useEffect(() => {
        fetchSummary(fromDate, toDate);
    }, [fromDate, toDate, fetchSummary]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
            {/* Date Range Picker - style giống tracking, căn phải trên desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                        <Calendar className="text-white" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Thống kê tổng quan</h1>
                </div>
                <div className="flex-1 flex justify-end max-w-xl w-full">
                    <CustomDateRangePicker
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                    />
                </div>
            </div>

            {/* Card thống kê */}
            <DashboardStats
                totalUsers={summary?.totalUsers || 0}
                totalCompanies={summary?.totalCompanies || 0}
                totalProducts={summary?.totalProducts || 0}
                loading={loading}
            />
            
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-6">
                        {chartTabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`text-sm font-medium border-b-2 pb-1 transition ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500'
                                }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="px-2 py-1 rounded border border-gray-200 bg-white text-gray-900 outline-none"
                        >
                            <option value="2025">Năm</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>
                </div>
                <div>
                    {loading ? <LineChartSkeleton /> : <LineChart tab={activeTab} year={year} />}
                </div>
            </div>

            <div>
                {loading ? (
                    <BarChartSkeleton />
                ) : (
                    <ProductCategoryChart data={summary?.productCategories || []} />
                )}
            </div>
        </div>
    );
};

const DashboardPage = () => {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
};

export default DashboardPage;