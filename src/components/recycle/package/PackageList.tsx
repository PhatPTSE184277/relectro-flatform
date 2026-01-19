import React, { useRef, useEffect } from 'react';
import PackageShow from './PackageShow';
import PackageTableSkeleton from './PackageTableSkeleton';
import { PackageType } from '@/types/Package';

interface PackageListProps {
    packages: PackageType[];
    loading: boolean;
    onViewDetail: (pkg: PackageType) => void;
    onCheckProducts?: (pkg: PackageType) => void;
}

const PackageList: React.FC<PackageListProps> = ({
    packages,
    loading,
    onViewDetail,
    onCheckProducts
}) => {
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [packages]);

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div style={{ maxHeight: 390, overflowY: 'auto' }} ref={bodyRef}>
                        <table className='min-w-full text-sm text-gray-800 table-fixed'>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                <tr>
                                    <th className='py-3 px-4 text-center w-16'>STT</th>
                                    <th className='py-3 px-4 text-left w-48'>Mã Package</th>
                                    <th className='py-3 px-4 text-left w-40'>Số sản phẩm</th>
                                    <th className='py-3 px-4 text-center w-32'>Hành động</th>
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
                                            onCheckProducts={onCheckProducts ? () => onCheckProducts(pkg) : undefined}
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
    );
};

export default PackageList;
