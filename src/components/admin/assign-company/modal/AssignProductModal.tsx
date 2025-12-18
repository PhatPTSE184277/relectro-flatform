import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { getUnassignedProducts } from '@/services/admin/AssignProductService';
import AssignProductSelectList from './AssignProductSelectList';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/FormatDate';

interface Product {
    productId: string;
    postId?: string;
    categoryName: string;
    brandName: string;
    productName: string;
    userName: string;
    address: string;
}

interface AssignProductModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: { workDate: string; productIds: string[] }) => void;
    selectedDate?: string;
}

const AssignProductModal: React.FC<AssignProductModalProps> = ({
    open,
    onClose,
    onConfirm,
    selectedDate = ''
}) => {
    const [workDate, setWorkDate] = useState<string>(selectedDate);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (open && workDate) {
            fetchProducts(workDate, page, pageSize, page === 1);
        }
    }, [open, workDate, page]);

    const fetchProducts = async (date: string, pageArg: number, pageSizeArg: number, resetSelection: boolean = false) => {
        setLoading(true);
        try {
            const data = await getUnassignedProducts(date);
            setAllProducts(data);
            setTotalPages(Math.max(1, Math.ceil(data.length / pageSizeArg)));
            const paged = data.slice((pageArg - 1) * pageSizeArg, pageArg * pageSizeArg);
            setProducts(paged);
            if (resetSelection) {
                setSelectedProductIds(data.map(p => p.productId)); // chỉ chọn hết khi đổi ngày
            } else {
                // Giữ lại các id còn tồn tại trong danh sách mới
                setSelectedProductIds(prev => prev.filter(id => data.some(p => p.productId === id)));
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách sản phẩm');
            setProducts([]);
            setAllProducts([]);
            setSelectedProductIds([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date: string) => {
        setWorkDate(date);
        setPage(1);
        if (date) {
            fetchProducts(date, 1, pageSize, true);
        }
    };

    const handleToggleProduct = (productId: string) => {
        if (selectedProductIds.includes(productId)) {
            setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
        } else {
            setSelectedProductIds([...selectedProductIds, productId]);
        }
    };

    const handleToggleAllCurrentPage = () => {
        const currentPageIds = products.map(p => p.productId);
        const allSelected = currentPageIds.every(id => selectedProductIds.includes(id));
        if (allSelected) {
            // Bỏ chọn tất cả trang hiện tại
            setSelectedProductIds(selectedProductIds.filter(id => !currentPageIds.includes(id)));
        } else {
            // Chọn tất cả trang hiện tại
            setSelectedProductIds(Array.from(new Set([...selectedProductIds, ...currentPageIds])));
        }
    };

    const [assignLoading, setAssignLoading] = useState(false);

    const handleConfirm = async () => {
        if (!workDate) {
            alert('Vui lòng chọn ngày phân công');
            return;
        }
        if (selectedProductIds.length === 0) {
            alert('Vui lòng chọn ít nhất 1 sản phẩm');
            return;
        }
        setAssignLoading(true);
        try {
            await onConfirm({ workDate, productIds: selectedProductIds });
        } finally {
            setAssignLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedProductIds([]);
        onClose();
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            <Package className='text-primary-600' />
                            Phân công sản phẩm
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Chọn sản phẩm cần phân công cho ngày làm việc
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6 bg-gray-50'>
                    <div className='space-y-6'>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className='border border-primary-200 rounded-lg p-4 bg-primary-50/30 w-full md:w-1/2'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Chọn ngày phân công
                                </label>
                                <CustomDatePicker
                                    value={workDate}
                                    onChange={handleDateChange}
                                    placeholder="Chọn ngày"
                                />
                            </div>
                            <div className='bg-primary-50 border border-primary-200 rounded-lg p-4 w-full md:w-1/2 flex items-center justify-start'>
                                <p className='text-sm text-primary-800 m-0'>
                                    <span className='font-semibold'>Tổng kết:</span> Bạn đã chọn{' '}
                                    <span className='font-bold'>{selectedProductIds.length}</span> sản phẩm
                                    {workDate && (
                                        <>
                                            {' '}cho ngày{' '}
                                            <span className='font-bold'>{formatDate(workDate)}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className='border border-primary-200 rounded-lg p-4 bg-primary-50/30'>
                            <div className='flex items-center mb-4 gap-2'>
                                <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                    <Package size={20} className='text-primary-500' />
                                </span>
                                <span className='text-lg font-semibold text-gray-900'>Chọn sản phẩm ({selectedProductIds.length}/{allProducts.length})</span>
                            </div>
                            <AssignProductSelectList
                                products={products}
                                selectedProductIds={selectedProductIds}
                                loading={loading}
                                onToggleProduct={handleToggleProduct}
                                onToggleAllCurrentPage={handleToggleAllCurrentPage}
                                page={page}
                                pageSize={pageSize}
                            />
                            <div className='flex justify-end mt-4'>
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t bg-gray-50'>
                    <button
                        onClick={handleConfirm}
                        disabled={!workDate || selectedProductIds.length === 0 || assignLoading}
                        className={`px-6 py-2.5 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition cursor-pointer flex items-center justify-center gap-2`}
                    >
                        {assignLoading && (
                            <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                            </svg>
                        )}
                        Phân công
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignProductModal;