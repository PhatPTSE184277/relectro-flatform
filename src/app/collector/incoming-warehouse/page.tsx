'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useProductContext } from '@/contexts/collector/IWProductContext';
import IWProductFilter from '@/components/collector/incoming-warehouse/IWProductFilter';
import IWProductList from '@/components/collector/incoming-warehouse/IWProductList';
import ProductDetail from '@/components/collector/incoming-warehouse/modal/ProductDetail';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { Warehouse, ScanLine } from 'lucide-react';

const IncomingWarehousePage: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        products,
        loading,
        filter,
        setFilter,
        totalPages,
        allStats,
        receiveProduct,
        selectedProduct,
        setSelectedProduct
    } = useProductContext();

    const [search, setSearch] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [qrCodeInput, setQrCodeInput] = useState('');

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
        // Tự động focus vào input QR khi vào trang
        inputRef.current?.focus();
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

    const handleReceive = async (qrCode: string) => {
        await receiveProduct(qrCode);
    };

    const handleQuickReceive = async (e: React.FormEvent) => {
        e.preventDefault();
        if (qrCodeInput.trim()) {
            await receiveProduct(qrCodeInput.trim());
            setQrCodeInput('');
        }
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

                {/* Quick Scan QR */}
                <form
                    onSubmit={handleQuickReceive}
                    className='flex items-center gap-2'
                >
                    <div className='relative'>
                        <input
                            ref={inputRef}
                            type='text'
                            value={qrCodeInput}
                            onChange={(e) => setQrCodeInput(e.target.value)}
                            placeholder='Quét hoặc nhập mã QR...'
                            className='pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-gray-900 placeholder-gray-400'
                            autoComplete='off'
                        />
                        <ScanLine
                            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                            size={18}
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={!qrCodeInput.trim()}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium'
                    >
                        Nhận hàng
                    </button>
                </form>
            </div>

            {/* Filter Section */}
            <div className='mb-6 space-y-4'>
                {/* Search (left) & Date Picker (right) */}
                <div className='flex gap-4 items-center'>
                    <div className='flex-1 max-w-md'>
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
                    onReceive={handleReceive}
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
        </div>
    );
};

export default IncomingWarehousePage;
