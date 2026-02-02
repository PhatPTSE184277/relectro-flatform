'use client';
import React, { useState } from 'react';
import type { PackageType } from '@/types/Package';
import { Tag, CheckCircle2, Boxes } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from './ProductList';
import Pagination from '@/components/ui/Pagination';
import { usePackageContext } from '@/contexts/small-collector/PackageContext';

interface PackageDetailProps {
    package: PackageType;
    onClose: () => void;
}

interface PackageDetailProps {
    package: PackageType;
    onClose: () => void;
    loading?: boolean;
}

const PackageDetail: React.FC<PackageDetailProps> = ({
    package: pkg,
    onClose,
    loading = false
}) => {
    const { fetchPackageDetail } = usePackageContext();
    const [productPage, setProductPage] = useState(1);

    if (!pkg) return null;

    const handleProductPageChange = async (page: number) => {
        setProductPage(page);
        await fetchPackageDetail(pkg.packageId, page, 10);
    };

    const summaryItems = [
        {
            icon: <Tag size={14} className='text-primary-400' />,
            label: 'Mã package',
            value: pkg.packageId,
        },
        {
            icon: <Boxes size={14} className='text-primary-400' />,
            label: 'Số sản phẩm',
            value: pkg.products.totalItems,
        },
        {
            icon: <CheckCircle2 size={14} className="text-primary-400" />,
            label: 'Trạng thái',
            value:(
                <span
                    className="flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-primary-600 text-white"
                    style={{ minWidth: 110 }}
                >
                    {pkg.status}
                </span>
            ),
        },
    ];

    return (
        <div key={pkg.packageId} className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[96vh] animate-fadeIn'>
                {/* Animation */}
                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: scale(0.96) translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                `}</style>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Thông tin package
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
                    {/* Package Info Row */}
                    <div className='w-full mb-2'>
                        <SummaryCard
                            items={summaryItems}
                            singleRow={true}
                        />
                    </div>
                    {/* Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col'>
                        {loading ? (
                            <div className='flex-1 flex items-center justify-center'>
                                <span className='text-gray-400'>Đang tải dữ liệu...</span>
                            </div>
                        ) : (
                            <>
                                <div className='flex-1 overflow-hidden'>
                                    <ProductList
                                        products={pkg.products.data.map(p => ({
                                            ...p,
                                            qrCode: p.qrCode ?? undefined
                                        }))}
                                        mode='view'
                                    />
                                </div>
                                {pkg.products.totalPages > 1 && (
                                    <div className='p-4 border-t'>
                                        <Pagination
                                            page={productPage}
                                            totalPages={pkg.products.totalPages}
                                            onPageChange={handleProductPageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;
