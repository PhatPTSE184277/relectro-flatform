'use client';

import React, { useState, useEffect } from 'react';
import { useProductQueryContext } from '@/contexts/company/ProductQueryContext';
import { Package } from 'lucide-react';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import ProductList from '@/components/company/product-query/ProductList';
import Pagination from '@/components/ui/Pagination';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useAuth } from '@/hooks/useAuth';

const ProductQueryPage: React.FC = () => {
    const { user } = useAuth();
    const { loading, products, fetchProducts, smallPoints, fetchSmallPoints } = useProductQueryContext();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch small points when component mounts
    useEffect(() => {
        if (user?.collectionCompanyId) {
            fetchSmallPoints(user.collectionCompanyId);
        }
    }, [user?.collectionCompanyId, fetchSmallPoints]);

    useEffect(() => {
        if (user?.collectionCompanyId) {
            fetchProducts(user.collectionCompanyId, selectedDate);
        }
    }, [user?.collectionCompanyId, selectedDate, fetchProducts]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
    };

    // Lấy data từ context (giả sử products chứa full response)
    const responseData = (products as any);
    const points = responseData?.points || [];

    // Auto-select first point when small points load
    useEffect(() => {
        if (smallPoints.length > 0 && !selectedPointId) {
            setSelectedPointId(Number(smallPoints[0].smallPointId));
        }
    }, [smallPoints, selectedPointId]);

    const handlePointSelect = (pointId: string) => {
        setSelectedPointId(Number(pointId));
        setPage(1);
    }

    // Get products from selected point (from products response)
    const selectedPointData = points.find((point: any) => Number(point.smallPointId) === Number(selectedPointId));
    const pointProducts = selectedPointData?.products || [];
    
    // Paginate products
    const paginatedProducts = pointProducts.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
    
    const totalPages = Math.ceil(pointProducts.length / itemsPerPage);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between gap-6 mb-6'>
                <div className='flex flex-col w-full gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-3 justify-center sm:justify-start'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Package className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>
                            Tra cứu sản phẩm
                        </h1>
                    </div>
                    <div className='flex items-center gap-4 justify-center sm:justify-end w-full sm:w-auto'>
                        <div className='min-w-fit'>
                            <CustomDatePicker
                                value={selectedDate}
                                onChange={handleDateChange}
                                placeholder='Chọn ngày'
                            />
                        </div>
                        <div className='min-w-fit'>
                            <SearchableSelect
                                options={smallPoints}
                                value={selectedPointId ? String(selectedPointId) : ''}
                                onChange={handlePointSelect}
                                getLabel={(p: any) => p.name || p.smallPointName || 'N/A'}
                                getValue={(p: any) => String(p.smallPointId)}
                                placeholder='Chọn điểm thu gom'
                                className='w-72'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product List */}
            {!selectedPointId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn điểm thu gom để xem danh sách sản phẩm
                </div>
            ) : (
                <>
                    <div className='mb-6'>
                        <ProductList
                            products={loading ? Array.from({ length: 6 }) : paginatedProducts}
                            loading={loading}
                            page={page}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            {/* Point Select Modal removed, now using SearchableSelect above */}
        </div>
    );
};

export default ProductQueryPage;
