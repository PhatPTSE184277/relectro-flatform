'use client';

import React from 'react';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageInfoCardProps {
    pkg: PackageType;
}

const PackageInfoCard: React.FC<PackageInfoCardProps> = ({ pkg }) => {
    return (
        <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100'>
            <div className='grid grid-cols-4'>
                {/* Mã package */}
                <div className='flex flex-col'>
                    <div className='text-xs font-semibold uppercase text-gray-700 bg-white py-3 px-4'>
                        Mã package
                    </div>
                    <div className='text-sm font-medium text-gray-900 bg-white py-3 px-4 break-all'>
                        {pkg.packageId}
                    </div>
                </div>
                {/* Tên package */}
                <div className='flex flex-col'>
                    <div className='text-xs font-semibold uppercase text-gray-700 bg-white py-3 px-4'>
                        Tên package
                    </div>
                    <div className='text-sm font-medium text-gray-900 bg-white py-3 px-4'>
                        {pkg.packageName}
                    </div>
                </div>
                {/* Số sản phẩm */}
                <div className='flex flex-col'>
                    <div className='text-xs font-semibold uppercase text-gray-700 bg-white py-3 px-4'>
                        Số sản phẩm
                    </div>
                    <div className='text-sm font-medium text-gray-900 bg-white py-3 px-4'>
                        {pkg.products.length}
                    </div>
                </div>
                {/* Trạng thái */}
                <div className='flex flex-col'>
                    <div className='text-xs font-semibold uppercase text-gray-700 bg-white py-3 px-4'>
                        Trạng thái
                    </div>
                    <div className='py-3 px-4'>
                        <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageInfoCard;
