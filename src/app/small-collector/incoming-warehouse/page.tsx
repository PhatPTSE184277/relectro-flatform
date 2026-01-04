'use client';

import React, { useState, useRef } from 'react';
import { useIWProductContext } from '@/contexts/small-collector/IWProductContext';
import IWProductFilter from '@/components/small-collector/incoming-warehouse/IWProductFilter';
import IWProductList from '@/components/small-collector/incoming-warehouse/IWProductList';

import ProductDetail from '@/components/small-collector/incoming-warehouse/modal/ProductDetail';
import CreateProduct from '@/components/small-collector/incoming-warehouse/modal/CreateProduct';
import ReceiveProduct from '@/components/small-collector/incoming-warehouse/modal/ReceiveProduct';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
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
        receiveProduct,
        selectedProduct,
        setSelectedProduct,
        createProduct,
        getProductById,
        allStats
    } = useIWProductContext() as any;

    const [search, setSearch] = useState('');
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);

    const [fromDate, setFromDate] = useState<string | undefined>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-01`;
    });
    const [toDate, setToDate] = useState<string | undefined>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const handleFilterChange = (status: string) => {
        setFilter({ status, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilter({ page });
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFromDateChange = (date: string) => {
        setFromDate(date);
        setFilter({ fromDate: date, page: 1 });
    };

    const handleToDateChange = (date: string) => {
        setToDate(date);
        setFilter({ toDate: date, page: 1 });
    };

    const handleViewDetail = async (product: any) => {
        setShowDetailModal(true);
        setSelectedProduct(null);
        // Gọi API để lấy đầy đủ thông tin sản phẩm
        if (getProductById) {
            await getProductById(product.productId);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setFilter({ search: value, page: 1 });
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedProduct(null);
    };

    const handleReceive = async (data: {
        qrCode: string;
        productId: string;
        description: string | null;
        point: number;
    }) => {
        await receiveProduct(
            data.qrCode,
            data.productId,
            data.description,
            data.point
        );
    };

    return (

        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>

            {/* Header + Search */}
            <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:gap-6'>
                <div className='flex items-center gap-3 shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Warehouse className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Nhận hàng về kho
                    </h1>
                </div>
                <div className='flex-1 max-w-md w-full sm:ml-auto'>
                    <SearchBox
                        value={search}
                        onChange={handleSearchChange}
                        placeholder='Tìm kiếm sản phẩm...'
                    />
                </div>
            </div>

            {/* Date Range Picker + Action Buttons */}
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='max-w-xl w-full'>
                    <CustomDateRangePicker
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={handleFromDateChange}
                        onToDateChange={handleToDateChange}
                    />
                </div>
                <div className='flex gap-3 w-full sm:w-auto justify-end'>
                    <button
                        onClick={() => setShowReceiveModal(true)}
                        className='px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition font-medium flex items-center gap-2 cursor-pointer whitespace-nowrap border border-primary-200'
                    >
                        <ScanLine size={18} />
                        Nhận Hàng Nhập Kho
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center gap-2 cursor-pointer'
                    >
                        <Plus size={18} />
                        Tạo Sản Phẩm Mới
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6'>
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
                    products={products}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                    status={filter.status}
                    currentPage={filter.page}
                    pageSize={filter.limit}
                    ref={tableScrollRef}
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
