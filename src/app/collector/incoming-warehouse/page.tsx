'use client';

import React, { useState, useEffect } from 'react';
import { useIWProductContext } from '@/contexts/collector/IWProductContext';
import IWProductFilter from '@/components/collector/incoming-warehouse/IWProductFilter';
import IWProductList from '@/components/collector/incoming-warehouse/IWProductList';
import ProductDetail from '@/components/collector/incoming-warehouse/modal/ProductDetail';
import CreateProduct from '@/components/collector/incoming-warehouse/modal/CreateProduct';
import ReceiveProduct from '@/components/collector/incoming-warehouse/modal/ReceiveProduct';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { Warehouse, ScanLine, Plus } from 'lucide-react';

const IncomingWarehousePage: React.FC = () => {
    const {
        products,
        loading,
        filter,
        setFilter,
        totalPages,
        allStats,
        receiveProduct,
        selectedProduct,
        setSelectedProduct,
        createProduct
    } = useIWProductContext();

    const [search, setSearch] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);

    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    useEffect(() => {
        const today = new Date();
        const dateObj = new Date(today);
        setFilter({
            pickUpDate: {
                year: dateObj.getFullYear(),
                month: dateObj.getMonth() + 1,
                day: dateObj.getDate(),
                dayOfWeek: dateObj.getDay()
            },
            page: 1
        });
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchSearch =
            product.categoryName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            product.brandName?.toLowerCase().includes(search.toLowerCase()) ||
            product.description?.toLowerCase().includes(search.toLowerCase()) ||
            product.qrCode?.toLowerCase().includes(search.toLowerCase()) ||
            product.smallCollectionPointName
                ?.toLowerCase()
                .includes(search.toLowerCase());
        return matchSearch;
    });

    const handleFilterChange = (status: string) => {
        setFilter({ status, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilter({ page });
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const dateObj = new Date(date);
        setFilter({
            pickUpDate: {
                year: dateObj.getFullYear(),
                month: dateObj.getMonth() + 1,
                day: dateObj.getDate(),
                dayOfWeek: dateObj.getDay()
            },
            page: 1
        });
    };

    const handleViewDetail = (product: any) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedProduct(null);
    };

    const handleReceive = async (data: { qrCode: string; productId: string; description: string; point: number }) => {
        await receiveProduct(data.qrCode, data.productId, data.description, data.point);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'>
                        <Warehouse className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Nhận hàng về kho
                    </h1>
                </div>

                <button
                    onClick={() => setShowReceiveModal(true)}
                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 cursor-pointer'
                >
                    <ScanLine size={18} />
                    Nhận Hàng Nhập Kho
                </button>
            </div>

            {/* Filter Section */}
            <div className='mb-6 space-y-4'>
                {/* Search, Date Picker, Tạo mới cùng hàng */}
                <div className='flex flex-col md:flex-row gap-4 items-center'>
                    <div className='flex-1 max-w-md w-full'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm sản phẩm...'
                        />
                    </div>
                    <div className='w-64'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder='Chọn ngày thu gom'
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 cursor-pointer'
                    >
                        <Plus size={18} />
                        Tạo Sản Phẩm Mới
                    </button>
                </div>

                {/* Status Filter */}
                <IWProductFilter
                    status={filter.status as any}
                    stats={allStats}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Main Content: List Only */}
            <div className='mb-6'>
                <IWProductList
                    products={filteredProducts}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                />
            </div>

            {/* Pagination */}
            <Pagination
                page={filter.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Product Detail Modal */}
            {showDetailModal && selectedProduct && (
                <ProductDetail
                    product={selectedProduct}
                    onClose={handleCloseModal}
                />
            )}

            {/* Create Product Modal */}
            {showCreateModal && (
                <CreateProduct
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onConfirm={async (productData) => {
                        await createProduct(productData);
                        setShowCreateModal(false);
                    }}
                />
            )}

            {/* Receive Product Modal */}
            {showReceiveModal && (
                <ReceiveProduct
                    open={showReceiveModal}
                    onClose={() => setShowReceiveModal(false)}
                    onConfirm={async (data) => {
                        await handleReceive(data);
                        setShowReceiveModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default IncomingWarehousePage;
