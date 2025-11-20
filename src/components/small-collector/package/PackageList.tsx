import React from 'react';
import PackageShow from './PackageShow';
import PackageTableSkeleton from './PackageTableSkeleton';
import type { PackageType } from '@/services/small-collector/PackageService';

interface PackageListProps {
    packages: PackageType[];
    loading: boolean;
    onViewDetail: (pkg: PackageType) => void;
    onUpdate?: (pkg: PackageType) => void;
    onUpdateStatus?: (packageId: string) => void;
}

const PackageList: React.FC<PackageListProps> = ({
    packages,
    loading,
    onViewDetail,
    onUpdate,
    onUpdateStatus
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>Mã Package</th>
                            <th className='py-3 px-4 text-left'>Tên Package</th>
                            <th className='py-3 px-4 text-left'>Số sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Điểm thu gom</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <PackageTableSkeleton key={idx} />
                            ))
                        ) : packages.length > 0 ? (
                            packages.map((pkg) => (
                                <PackageShow
                                    key={pkg.packageId}
                                    package={pkg}
                                    onView={() => onViewDetail(pkg)}
                                    onUpdate={onUpdate}
                                    onUpdateStatus={onUpdateStatus}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-400'>
                                    Không có package nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PackageList;
