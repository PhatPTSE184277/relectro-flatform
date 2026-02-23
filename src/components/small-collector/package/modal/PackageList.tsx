'use client';

import React from 'react';
import { Package as PackageIcon } from 'lucide-react';
import type { PackageType } from '@/types/Package';

interface PackageListProps {
    packages: PackageType[];
    loading: boolean;
    maxHeight?: string;
}

const PackageList: React.FC<PackageListProps> = ({
    packages,
    loading,
    maxHeight = 'max-h-[40vh]'
}) => {
    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between p-4 border-b'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                    <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                        <PackageIcon className='w-5 h-5 text-primary-500' />
                    </span>
                    Danh sách gói đã đóng thùng ({packages.length})
                </h3>
            </div>

            <div className={`${maxHeight} overflow-y-auto`}>
                {loading ? (
                    <div className='p-6 text-center text-gray-400'>Đang tải...</div>
                ) : packages.length === 0 ? (
                    <div className='p-6 text-center text-gray-400'>Không có gói đã đóng thùng</div>
                ) : (
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                            <tr>
                                <th className='py-3 px-4 text-left w-[60vw]'>Mã gói</th>
                                <th className='py-3 px-4 text-right w-[20vw]'>Số sản phẩm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg, idx) => {
                                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                return (
                                    <tr key={pkg.packageId} className={`${rowBg} border-b border-primary-100`}>
                                        <td className='py-3 px-4 font-medium text-gray-900'>{pkg.packageId}</td>
                                        <td className='py-3 px-4 text-right text-gray-700'>
                                            {pkg.products?.totalItems ?? 0}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PackageList;
