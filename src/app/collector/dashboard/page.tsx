'use client';
import React, { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StateCard';
import StatCardSkeleton from '@/components/ui/StatCardSkeleton';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
const BarChartSkeleton = dynamic(
    () => import('@/components/charts/BarChartSkereton'),
    { ssr: false }
);

import LineChartSkeleton from '@/components/charts/LineChartSkeleton';
import PieChart from '@/components/charts/PieChart';
import PieChartSkeleton from '@/components/charts/PieChartSkeleton';
import dynamic from 'next/dynamic';

const chartTabs = [
    { key: 'user', label: 'Người dùng' },
    { key: 'product', label: 'Sản phẩm' },
    { key: 'shipping', label: 'Vận chuyển' }
];

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('user');
    const [year, setYear] = useState('2025');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-16">
            {/* Card thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {loading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Yêu cầu"
                            value="7,265"
                            change="+11.01%"
                            isPositive={true}
                            variant="blue"
                        />
                        <StatCard
                            title="Người dùng"
                            value="3,671"
                            change="-0.03%"
                            isPositive={false}
                            variant="dark"
                        />
                        <StatCard
                            title="Sản phẩm"
                            value="256"
                            change="+15.03%"
                            isPositive={true}
                            variant="blue"
                        />
                        <StatCard
                            title="Vận chuyển"
                            value="2,318"
                            change="+6.08%"
                            isPositive={true}
                            variant="dark"
                        />
                    </>
                )}
            </div>
            
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="font-semibold text-blue-600 mb-2">Sản phẩm</div>
                    {loading ? <BarChartSkeleton /> : <BarChart />}
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="font-semibold text-green-600 mb-2">Địa điểm thu mua</div>
                    {loading ? <PieChartSkeleton /> : <PieChart />}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;