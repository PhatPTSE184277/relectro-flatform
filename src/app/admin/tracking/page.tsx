'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Factory } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import TrackingProductList from '@/components/admin/tracking/TrackingProductList';
import TrackingModal from '@/components/admin/tracking/modal/TrackingModal';
import TrackingProductFilter from '@/components/admin/tracking/TrackingProductFilter';
import CompanySelectModal from '@/components/admin/tracking/modal/CompanySelectModal';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';

const TrackingPage: React.FC = () => {
    const { companies, products, loadingProducts, fetchProducts } = useTrackingContext();
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('Chờ Duyệt');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [search, setSearch] = useState<string>("");
    const tableScrollRef = useRef<HTMLDivElement>(null);

    // Auto-select first company when companies load
    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            const firstCompanyId = companies[0].id || companies[0].companyId || String(companies[0].collectionCompanyId);
            setTimeout(() => setSelectedCompanyId(firstCompanyId), 0); // Avoid cascading renders
        }
    }, [companies, selectedCompanyId]);

    // Fetch products when company or date changes
    useEffect(() => {
        if (selectedCompanyId) {
            fetchProducts(selectedCompanyId); // Removed the fourth argument 'search' to match expected parameters
        }
    }, [selectedCompanyId, fetchProducts]);

    const handleCompanySelect = (companyId: string) => {
        setSelectedCompanyId(companyId);
        setPage(1);
    };

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Filter products by status
    const filteredProducts = statusFilter === 'all' 
        ? products 
        : products.filter((product: any) => product.status === statusFilter);

    // Paginate products and add stt for each row
    const paginatedProducts = filteredProducts.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    ).map((product, idx) => ({
        ...product,
        stt: (page - 1) * itemsPerPage + idx + 1
    }));

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const selectedCompany = companies.find((company: any) => {
        const companyId = company.id || company.companyId || String(company.collectionCompanyId);
        return companyId === selectedCompanyId;
    });

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header + Date Range Picker */}
            <div className='flex flex-col gap-4 mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <MapPin className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>Theo dõi sản phẩm</h1>
                    </div>
                    <div className='flex gap-4 items-center flex-1 justify-end'>
                        <button
                            onClick={() => setShowCompanyModal(true)}
                            className='w-full sm:w-auto px-6 py-3 bg-white border-2 border-primary-200 rounded-xl hover:border-primary-400 transition-all shadow-sm cursor-pointer flex items-center gap-3'
                        >
                            <Factory className='text-primary-600' size={20} />
                            <div className='text-left flex-1'>
                                <div className='text-xs text-gray-500 font-medium'>Công ty đang chọn</div>
                                <div className='font-semibold text-gray-900'>
                                    {selectedCompany ? (selectedCompany.name || selectedCompany.companyName || 'N/A') : 'Chọn công ty'}
                                </div>
                            </div>
                            <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>
                        <div className='flex-1 max-w-md'>
                            <SearchBox
                                value={search}
                                onChange={setSearch}
                                placeholder="Tìm kiếm sản phẩm..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            {selectedCompanyId && (
                <div className='mb-6'>
                    <TrackingProductFilter
                        status={statusFilter}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            )}

            {/* Product List */}
            {!selectedCompanyId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn công ty để xem danh sách sản phẩm
                </div>
            ) : (
                <>
                    <div className='mb-6'>
                        <TrackingProductList
                            products={paginatedProducts}
                            loading={loadingProducts}
                            onProductClick={handleProductClick}
                            tableRef={tableScrollRef}
                        />
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {/* Company Select Modal */}
            <CompanySelectModal
                open={showCompanyModal}
                companies={companies}
                selectedCompanyId={selectedCompanyId}
                onClose={() => setShowCompanyModal(false)}
                onSelect={handleCompanySelect}
            />

            {/* Tracking Modal */}
            {showModal && selectedProduct && (
                <TrackingModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default TrackingPage;
