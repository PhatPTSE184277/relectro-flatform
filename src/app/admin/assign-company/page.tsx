'use client';

import React, { useState } from 'react';
import { getTodayString } from '@/utils/getDayString';
import { useAssignProductContext } from '@/contexts/admin/AssignProductContext';
import { Package } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import AssignedProductList from '@/components/admin/assign-company/AssignedProductList';
import AssignProductModal from '@/components/admin/assign-company/modal/AssignProductModal';
import Pagination from '@/components/ui/Pagination';

const AssignCompanyPage: React.FC = () => {
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

    React.useEffect(() => {
        fetchAssignedProducts(selectedDate, page, pageSize);
    }, [selectedDate, page, pageSize, fetchAssignedProducts]);

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Package className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>
                            Phân công sản phẩm
                        </h1>
                    </div>
                    <div className='max-w-md w-full sm:ml-auto'>
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
            </div>

            {/* Product List */}
            <AssignedProductList
                products={filteredProducts}
                loading={loading}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
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

export default AssignCompanyPage;
