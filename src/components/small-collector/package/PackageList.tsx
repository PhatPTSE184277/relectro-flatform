import React, { forwardRef } from 'react';
import PackageShow from './PackageShow';
import PackageTableSkeleton from './PackageTableSkeleton';
import type { PackageType } from '@/types/Package';

export interface PackageListProps {
    packages: PackageType[];
    loading: boolean;
    onViewDetail: (pkg: PackageType) => void;
    onUpdate?: (pkg: PackageType) => void;
    onUpdateStatus?: (packageId: string) => void;
}

const PackageList = forwardRef<HTMLDivElement, PackageListProps>(
    ({
        packages,
        loading,
        onViewDetail,
        onUpdate,
        onUpdateStatus
    }, ref) => {
        return (
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
                <div className='overflow-x-auto'>
                    <div className='inline-block min-w-full align-middle'>
                        <div className='overflow-hidden'>
                            <div className='max-h-[59vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[53vh] xl:max-h-[59vh] overflow-y-auto' ref={ref}>
                                <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                        <tr>
                                            <th className='py-3 px-4 text-center w-[5vw] min-w-[5vw]'>STT</th>
                                            <th className='py-3 px-4 text-left w-[13vw] min-w-[10vw]'>Mã Package</th>
                                            <th className='py-3 px-4 text-right w-[9vw] min-w-[8vw]'>Số sản phẩm</th>
                                            <th className='py-3 px-4 text-center w-[12vw] min-w-[10vw]'>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            Array.from({ length: 6 }).map((_, idx) => (
                                                <PackageTableSkeleton key={idx} />
                                            ))
                                        ) : packages.length > 0 ? (
                                            packages.map((pkg, idx) => (
                                                <PackageShow
                                                    key={pkg.packageId}
                                                    package={pkg}
                                                    stt={idx + 1}
                                                    onView={() => onViewDetail(pkg)}
                                                    onUpdate={onUpdate}
                                                    onUpdateStatus={onUpdateStatus}
                                                    isLast={idx === packages.length - 1}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                    Không có package nào.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

PackageList.displayName = 'PackageList';

export default PackageList;
