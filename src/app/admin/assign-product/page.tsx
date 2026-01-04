'use client';

import React, { useState, useRef } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useAssignProductContext } from '@/contexts/admin/AssignProductContext';
import { Package } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import AssignedProductList from '@/components/admin/assign-product/AssignedProductList';
import AssignProductModal from '@/components/admin/assign-product/modal/AssignProductModal';
import Pagination from '@/components/ui/Pagination';

const AssignProductPage: React.FC = () => {
    const {
        assignedProducts,
        loading,
        fetchAssignedProducts,
        assignProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize
    } = useAssignProductContext();

    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayString);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const tableScrollRef = useRef<HTMLDivElement>(null);

    const filteredProducts = assignedProducts.filter((product) => {
        const matchSearch = 
            product.productName?.toLowerCase().includes(search.toLowerCase()) ||
            product.userName?.toLowerCase().includes(search.toLowerCase()) ||
            product.address?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
        fetchAssignedProducts(date, 1, pageSize);
    };

    const handleAssignProducts = async (data: { workDate: string; productIds: string[] }) => {
        await assignProductsToDate(data);
        await fetchAssignedProducts(data.workDate, page, pageSize);
        setShowAssignModal(false);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        fetchAssignedProducts(selectedDate, page, pageSize);
    }, [selectedDate, page, pageSize, fetchAssignedProducts]);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Phân công sản phẩm
                    </h1>
                </div>
                <div className='w-full sm:max-w-md'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm theo tên sản phẩm, khách hàng...'
                    />
                </div>
            </div>
            <div className='mt-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                <div className='w-64'>
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder='Chọn ngày phân công'
                    />
                </div>
                <div className='flex flex-1 justify-end w-full sm:w-auto mt-2 sm:mt-0'>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer shadow-md flex items-center gap-2'
                    >
                        <Package size={18} />
                        Phân công sản phẩm
                    </button>
                </div>
            </div>

            {/* Product List */}
            <AssignedProductList
                products={filteredProducts}
                loading={loading}
                ref={tableScrollRef}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Assign Modal */}
            {showAssignModal && (
                <AssignProductModal
                    open={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    onConfirm={handleAssignProducts}
                    selectedDate={selectedDate}
                />
            )}
        </div>
    );
};

export default AssignProductPage;
