'use client';

import React, { useState } from 'react';
import { useProductContext } from '@/contexts/collector/IWProductContext';
import IWProductFilter from '@/components/collector/incoming-warehouse/IWProductFilter';
import IWProductList from '@/components/collector/incoming-warehouse/IWProductList';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import { Warehouse } from 'lucide-react';

const IncomingWarehousePage: React.FC = () => {
    const {
        products,
        loading,
        filter,
        setFilter,
        totalPages,
        allStats,
        receiveProduct,
        setSelectedProduct
    } = useProductContext();

    const [search, setSearch] = useState('');
    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const filteredProducts = products.filter((product) => {
        const matchSearch =
            product.name?.toLowerCase().includes(search.toLowerCase()) ||
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
        // TODO: Mở modal chi tiết sản phẩm
        console.log('View detail:', product);
    };

    const handleReceive = async (qrCode: string) => {
        if (confirm('Xác nhận nhận sản phẩm này vào kho?')) {
            await receiveProduct(qrCode);
        }
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center'>
                        <Warehouse className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Nhận hàng về kho
                    </h1>
                </div>
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
        </div>
    );
};

export default IncomingWarehousePage;