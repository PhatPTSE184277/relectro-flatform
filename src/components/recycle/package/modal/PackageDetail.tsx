'use client';

import React from 'react';
import { Info, List } from 'lucide-react';
import { PackageType } from '@/types/Package';
import PackageInfoCard from './PackageInfoCard';
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

    const isRecycling = pkg.status === PackageStatus.Recycling;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết Package
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Thông tin chi tiết về package và danh sách sản phẩm
                        </p>
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
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Package Info Title */}
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                            <Info className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin package
                    </h3>
                    {/* Package Info Card */}
                    <PackageInfoCard pkg={pkg} />

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                <List className='w-5 h-5 text-primary-500' />
                            </span>
                            Danh sách sản phẩm
                        </h3>
                        <ProductList
                            products={pkg.products}
                            showStatus={isRecycling}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;
