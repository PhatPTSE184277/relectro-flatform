'use client';

import React from 'react';
import { List, Tag, ListCheck, Truck } from 'lucide-react';
import { PackageType } from '@/types/Package';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from './ProductList';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageDetailProps {
    package: PackageType;
    onClose: () => void;
}

const PackageDetail: React.FC<PackageDetailProps> = ({
    package: pkg,
    onClose
}) => {
    if (!pkg) return null;

    // Summary items for consistency with small-collector
    const summaryItems = [
        {
            icon: <Tag size={14} className='text-primary-400' />,
            label: 'Mã package',
            value: pkg.packageId,
        },

        {
            icon: <ListCheck size={14} className='text-primary-400' />,
            label: 'Số sản phẩm',
            value: pkg.products.length,
        },
        {
            icon: <Truck size={14} className='text-primary-400' />,
            label: 'Trạng thái',
            value: (
                <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        pkg.status === PackageStatus.Packing
                            ? 'bg-yellow-100 text-yellow-700'
                            : pkg.status === PackageStatus.Closed
                            ? 'bg-green-100 text-green-700'
                            : pkg.status === PackageStatus.Shipping
                            ? 'bg-blue-100 text-blue-700'
                            : pkg.status === PackageStatus.Recycling
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {pkg.status}
                </span>
            ),
        },
    ];

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
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
                <div className='flex-1 p-6'>
                    {/* Package Info Card (SummaryCard) */}
                    <SummaryCard items={summaryItems} singleRow={true} />

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                <List className='w-5 h-5 text-primary-500' />
                            </span>
                            Danh sách sản phẩm
                        </h3>
                        <div className='max-h-64 overflow-y-auto'>
                            <ProductList products={pkg.products} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;
