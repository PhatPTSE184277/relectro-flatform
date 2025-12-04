'use client';

import React, { useState, useEffect } from 'react';
import { useProductQueryContext } from '@/contexts/company/ProductQueryContext';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import ProductList from '@/components/company/product-query/ProductList';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/hooks/useAuth';

const ProductQueryPage: React.FC = () => {
    const { user } = useAuth();
    const { loading, products, fetchProducts } = useProductQueryContext();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [expandedPoints, setExpandedPoints] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (user?.collectionCompanyId) {
            fetchProducts(user.collectionCompanyId, selectedDate);
        }
    }, [user?.collectionCompanyId, selectedDate, fetchProducts]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
        setExpandedPoints([]);
    };

    const togglePoint = (pointId: number) => {
        if (expandedPoints.includes(pointId)) {
            setExpandedPoints(expandedPoints.filter(id => id !== pointId));
        } else {
            setExpandedPoints([...expandedPoints, pointId]);
        }
    };

    // Lấy data từ context (giả sử products chứa full response)
    const responseData = (products as any);
    const points = responseData?.points || [];
    const totalProducts = responseData?.totalProducts || 0;
    const totalWeightKg = responseData?.totalWeightKg || 0;
    const totalVolumeM3 = responseData?.totalVolumeM3 || 0;

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                    <Package className='text-white' size={20} />
                </div>
                <h1 className='text-3xl font-bold text-gray-900'>
                    Tra cứu sản phẩm
                </h1>
            </div>

            {/* Date Picker và Thông tin tổng quan */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex-1 max-w-xs'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Chọn ngày làm việc
                        </label>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder='Chọn ngày'
                        />
                    </div>
                    {totalProducts > 0 && (
                        <div className='flex gap-6'>
                            <div className='text-center'>
                                <p className='text-sm text-gray-600'>Tổng sản phẩm</p>
                                <p className='text-2xl font-bold text-primary-600'>
                                    {totalProducts}
                                </p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm text-gray-600'>Tổng khối lượng</p>
                                <p className='text-2xl font-bold text-primary-600'>
                                    {totalWeightKg} kg
                                </p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm text-gray-600'>Tổng thể tích</p>
                                <p className='text-2xl font-bold text-primary-600'>
                                    {totalVolumeM3.toFixed(2)} m³
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Points List */}
            <div className='space-y-4'>
                {loading ? (
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                        <div className='animate-pulse'>Đang tải dữ liệu...</div>
                    </div>
                ) : points.length === 0 ? (
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                        Không có sản phẩm nào trong ngày này
                    </div>
                ) : (
                    points.map((point: any) => {
                        const isExpanded = expandedPoints.includes(point.smallPointId);
                        const paginatedProducts = point.products?.slice(
                            (page - 1) * itemsPerPage,
                            page * itemsPerPage
                        ) || [];
                        const totalPages = Math.ceil((point.products?.length || 0) / itemsPerPage);

                        return (
                            <div
                                key={point.smallPointId}
                                className={`border rounded-lg overflow-hidden transition-all ${
                                    isExpanded
                                        ? 'border-primary-500 shadow-md bg-white'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                {/* Point Header */}
                                <div
                                    className='p-4 flex items-center justify-between cursor-pointer hover:bg-primary-50/50 transition-colors'
                                    onClick={() => togglePoint(point.smallPointId)}
                                >
                                    <div className='flex items-center gap-3'>
                                        <Package className='text-primary-600' size={20} />
                                        <div>
                                            <p className='font-semibold text-gray-900'>
                                                {point.smallPointName}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                {point.total} sản phẩm • {point.totalWeightKg} kg • {point.totalVolumeM3.toFixed(2)} m³
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className='text-right text-sm text-gray-600'>
                                            <p>Bán kính: {point.radiusMaxConfigKm} km</p>
                                            <p>Đường đi tối đa: {point.maxRoadDistanceKm} km</p>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className='text-primary-600' size={20} />
                                        ) : (
                                            <ChevronDown className='text-gray-400' size={20} />
                                        )}
                                    </div>
                                </div>

                                {/* Point Content */}
                                {isExpanded && (
                                    <div className='p-4 bg-white border-t border-gray-100'>
                                        <ProductList
                                            products={paginatedProducts}
                                            loading={loading}
                                            page={page}
                                            itemsPerPage={itemsPerPage}
                                        />
                                        {totalPages > 1 && (
                                            <Pagination
                                                page={page}
                                                totalPages={totalPages}
                                                onPageChange={setPage}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProductQueryPage;
