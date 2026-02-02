'use client';

import React from 'react';
import { Tag, MapPin, Home, List } from 'lucide-react';
import ProductList from './ProductList';
import { PackageStatus } from '@/enums/PackageStatus';
import SummaryCard from '@/components/ui/SummaryCard';
import { useRecyclerPackageContext } from '@/contexts/recycle/PackageContext';

interface PackageDetailProps {
    onClose: () => void;
}

const PackageDetail: React.FC<PackageDetailProps> = ({
    onClose
}) => {
    const { selectedPackage: pkg, fetchPackageDetail } = useRecyclerPackageContext();

    if (!pkg) return null;

    const isRecycling = pkg.status === PackageStatus.Recycling;

    // Chuẩn bị dữ liệu cho SummaryCard
    const summaryItems = [
        {
            icon: <Tag size={14} className='text-primary-400' />,
            label: 'Mã package',
            value: pkg.packageId,
        },
        {
            icon: <MapPin size={14} className='text-primary-400' />,
            label: 'Điểm thu gom',
            value: pkg.smallCollectionPointsName,
        },
        {
            icon: <Home size={14} className='text-primary-400' />,
            label: 'Địa chỉ thu gom',
            value: pkg.smallCollectionPointsAddress,
        },
    ];

    const handlePageChange = async (page: number) => {
        await fetchPackageDetail(pkg.packageId, page, 10);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className={`relative w-full ${isRecycling ? 'max-w-8xl' : 'max-w-7xl'} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh]`}>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết Package
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 p-6 flex flex-col gap-6 overflow-hidden bg-gray-50'>
                    {/* Package Info Summary */}
                    <div className='w-full mb-2'>
                        <SummaryCard items={summaryItems} singleRow={true} />
                    </div>

                    {/* Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col'>
                        <h3 className='text-lg font-semibold text-gray-900 p-4 flex items-center gap-2'>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                <List className='w-5 h-5 text-primary-500' />
                            </span>
                            Danh sách sản phẩm ({pkg.products.totalItems})
                        </h3>
                        <div className='flex-1 overflow-hidden'>
                            <ProductList
                                products={pkg.products}
                                showStatus={isRecycling}
                                showPagination={true}
                                onPageChange={handlePageChange}
                                maxHeight={300}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;
