'use client';

import React, { useState, useEffect } from 'react';
import { useProductQueryContext } from '@/contexts/company/ProductQueryContext';
import { Package, MapPin } from 'lucide-react';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import ProductList from '@/components/company/product-query/ProductList';
import Pagination from '@/components/ui/Pagination';
import PointSelectModal from '@/components/company/product-query/modal/PointSelectModal';
import { useAuth } from '@/hooks/useAuth';

const ProductQueryPage: React.FC = () => {
    const { user } = useAuth();
    const { loading, products, fetchProducts, smallPoints, loadingPoints, fetchSmallPoints } = useProductQueryContext();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [showPointModal, setShowPointModal] = useState(false);
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

    const handlePointSelect = (pointId: number) => {
        setSelectedPointId(pointId);
        setPage(1);
    };

    // Get products from selected point (from products response)
    const selectedPointData = points.find((point: any) => Number(point.smallPointId) === Number(selectedPointId));
    const pointProducts = selectedPointData?.products || [];
    
    // Get selected point info for display (from smallPoints)
    const selectedPoint = smallPoints.find((point: any) => Number(point.smallPointId) === Number(selectedPointId));
    
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
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Tra cứu sản phẩm
                    </h1>
                </div>

                {/* Date Picker and Point Selection Button */}
                <div className='flex items-center gap-6'>
                    <div className='w-full sm:max-w-md'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder='Chọn ngày'
                        />
                    </div>
                    <button
                        onClick={() => setShowPointModal(true)}
                        className='w-full px-10 py-3 bg-white border-2 border-primary-200 rounded-xl hover:border-primary-400 transition-all shadow-sm cursor-pointer flex items-center gap-6 text-center'
                    >
                        <MapPin className='text-primary-600' size={20} />
                        <div className='text-left flex-1'>
                            <div className='font-semibold text-gray-900'>
                                {selectedPoint ? (selectedPoint.name || selectedPoint.smallPointName || 'N/A') : 'Chọn điểm thu gom'}
                            </div>
                        </div>
                        <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Product List */}
            {!selectedPointId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn điểm thu gom để xem danh sách sản phẩm
                </div>
            ) : loading ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                    <div className='animate-pulse'>Đang tải dữ liệu...</div>
                </div>
            ) : pointProducts.length === 0 ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Không có sản phẩm nào trong điểm thu gom này
                </div>
            ) : (
                <>
                    <div className='mb-6'>
                        <ProductList
                            products={paginatedProducts}
                            loading={loading}
                            page={page}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            {/* Point Select Modal */}
            <PointSelectModal
                open={showPointModal}
                points={smallPoints}
                selectedPointId={selectedPointId}
                onClose={() => setShowPointModal(false)}
                onSelect={handlePointSelect}
            />
        </div>
    );
};

export default ProductQueryPage;
