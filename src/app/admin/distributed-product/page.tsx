'use client';

import React, { useState, useEffect } from 'react';
import { useDistributedProductContext } from '@/contexts/admin/DistributedProductContext';
import { ArrowLeft, Building2, MapPin, Package } from 'lucide-react';
import DistributedCompanyList from '@/components/admin/distributed-product/DistributedCompanyList';
import DistributedCollectionPointList from '@/components/admin/distributed-product/DistributedCollectionPointList';
import DistributedProductList from '@/components/admin/distributed-product/DistributedProductList';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import Pagination from '@/components/ui/Pagination';

const DistributedProductPage: React.FC = () => {
    const {
        companies,
        loading,
        fetchCompanies,
        selectedCompany,
        setSelectedCompany,
        selectedPoint,
        setSelectedPoint,
        pointProducts,
        productPage,
        productTotalPages,
        setProductPage,
        fetchPointProducts
    } = useDistributedProductContext();

    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [view, setView] = useState<'companies' | 'points' | 'products'>(
        'companies'
    );

    useEffect(() => {
        fetchCompanies(selectedDate);
    }, [selectedDate, fetchCompanies]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setView('companies');
        setSelectedCompany(null);
        setSelectedPoint(null);
    };

    const handleViewPoints = (company: any) => {
        setSelectedCompany(company);
        setSelectedPoint(null);
        setView('points');
    };

    const handleViewProducts = async (point: any) => {
        setSelectedPoint(point);
        setProductPage(1);
        await fetchPointProducts(point.smallCollectionId, selectedDate, 1, 10);
        setView('products');
    };

    const handleBackToCompanies = () => {
        setView('companies');
        setSelectedCompany(null);
        setSelectedPoint(null);
    };

    const handleBackToPoints = () => {
        setView('points');
        setSelectedPoint(null);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    {view !== 'companies' && (
                        <button
                            onClick={
                                view === 'points'
                                    ? handleBackToCompanies
                                    : handleBackToPoints
                            }
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                            title='Quay lại'
                        >
                            <ArrowLeft size={20} className='text-gray-600' />
                        </button>
                    )}
                    <div className='flex items-center gap-2'>
                        <span className='flex items-center justify-center w-10 h-10 rounded-full bg-primary-600'>
                            {view === 'companies' ? (
                                <Building2 className='text-white' size={20} />
                            ) : view === 'points' ? (
                                <MapPin className='text-white' size={20} />
                            ) : (
                                <Package className='text-white' size={20} />
                            )}
                        </span>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>
                                {view === 'companies'
                                    ? 'Sản phẩm đã phân chia'
                                    : view === 'points'
                                      ? 'Các điểm thu gom'
                                      : 'Danh sách sản phẩm'}
                            </h1>
                            {view === 'points' && selectedCompany && (
                                <p className='text-sm text-gray-600 mt-1'>
                                    {selectedCompany.companyName}
                                </p>
                            )}
                            {view === 'products' && selectedPoint && (
                                <p className='text-sm text-gray-600 mt-1'>
                                    {selectedPoint.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 items-center'>
                    <div className='w-64'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            dropdownAlign='right'
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {view === 'companies' && (
                <DistributedCompanyList
                    companies={companies}
                    loading={loading}
                    onViewPoints={handleViewPoints}
                />
            )}

            {view === 'points' && selectedCompany && (
                <DistributedCollectionPointList
                    points={selectedCompany.points}
                    loading={loading}
                    onViewProducts={handleViewProducts}
                />
            )}

            {view === 'products' && pointProducts && (
                <>
                    <DistributedProductList
                        products={pointProducts.products}
                        loading={loading}
                        page={productPage}
                    />
                    <Pagination
                        page={productPage}
                        totalPages={productTotalPages}
                        onPageChange={async (newPage) => {
                            setProductPage(newPage);
                            if (selectedPoint) {
                                await fetchPointProducts(selectedPoint.smallCollectionId, selectedDate, newPage, 10);
                            }
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default DistributedProductPage;
