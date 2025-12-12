'use client';

import React, { useState, useEffect } from 'react';
import { getTodayString, getFirstDayOfMonthString } from '@/utils/getDayString';
import { MapPin, ChevronDown, ChevronUp, Factory, Package } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import TrackingProductList from '@/components/admin/tracking/TrackingProductList';
import TrackingModal from '@/components/admin/tracking/modal/TrackingModal';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';

const TrackingPage: React.FC = () => {

    const { companies, products, loadingCompanies, loadingProducts, fetchProducts, clearProducts } = useTrackingContext();
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Date range: auto-select from first of month to today (like IncomingWarehousePage)
    const [fromDate, setFromDate] = useState<string | undefined>(getFirstDayOfMonthString);
    const [toDate, setToDate] = useState<string | undefined>(getTodayString);

    // Refetch products when date or company changes
    useEffect(() => {
        if (selectedCompanyId && fromDate && toDate) {
            fetchProducts(selectedCompanyId, fromDate, toDate);
        }
    }, [fromDate, toDate, selectedCompanyId, fetchProducts]);

    const toggleCompany = async (companyId: string) => {
        if (selectedCompanyId === companyId) {
            // Collapse
            setSelectedCompanyId(null);
            clearProducts();
        } else {
            // Expand
            setSelectedCompanyId(companyId);
            await fetchProducts(companyId, fromDate, toDate);
        }
    };

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                    <MapPin className='text-white' size={20} />
                </div>
                <h1 className='text-3xl font-bold text-gray-900'>
                    Theo dõi sản phẩm
                </h1>
            </div>

            {/* Date Filter */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex-1 max-w-2xl'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Lọc theo ngày
                        </label>
                        <CustomDateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={(date) => {
                                setFromDate(date);
                            }}
                            onToDateChange={(date) => {
                                setToDate(date);
                            }}
                        />
                    </div>
                    <div className='flex gap-6'>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-primary-600'>{companies.length}</div>
                            <div className='text-xs text-gray-500 uppercase'>Công ty</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Companies List */}
            <div className='space-y-4'>
                {loadingCompanies ? (
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                        <div className='animate-pulse'>Đang tải dữ liệu...</div>
                    </div>
                ) : companies.length === 0 ? (
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                        Không có công ty nào
                    </div>
                ) : (
                    companies.map((company: any) => {
                        const companyId = company.id || company.companyId || String(company.collectionCompanyId);
                        const isExpanded = selectedCompanyId === companyId;

                        return (
                            <div
                                key={companyId}
                                className={`border rounded-lg overflow-hidden transition-all ${
                                    isExpanded
                                        ? 'border-primary-500 shadow-md bg-white'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                {/* Company Header */}
                                <div
                                    className='p-4 flex items-center justify-between cursor-pointer hover:bg-primary-50/50 transition-colors'
                                    onClick={() => toggleCompany(companyId)}
                                >
                                    <div className='flex items-center gap-3 flex-1'>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            isExpanded ? 'bg-primary-500' : 'bg-primary-100'
                                        }`}>
                                            <Factory size={24} className={isExpanded ? 'text-white' : 'text-primary-600'} />
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='font-semibold text-gray-900 text-lg'>
                                                {company.name || company.companyName || 'N/A'}
                                            </h3>
                                            <p className='text-sm text-gray-500'>
                                                {company.city && `${company.city} • `}
                                                {company.phone || 'Chưa có thông tin'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        {isExpanded && products.length > 0 && (
                                            <div className='flex items-center gap-2 px-3 py-1 bg-primary-100 rounded-full'>
                                                <Package size={16} className='text-primary-600' />
                                                <span className='text-sm font-medium text-primary-600'>
                                                    {products.length} sản phẩm
                                                </span>
                                            </div>
                                        )}
                                        {isExpanded ? (
                                            <ChevronUp className='text-primary-600' size={24} />
                                        ) : (
                                            <ChevronDown className='text-gray-400' size={24} />
                                        )}
                                    </div>
                                </div>

                                {/* Company Content - Products */}
                                {isExpanded && (
                                    <div className='p-4 pt-0'>
                                        <TrackingProductList
                                            products={products}
                                            loading={loadingProducts}
                                            onProductClick={handleProductClick}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

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
