'use client';

import React from 'react';
import TrackingProductSkeleton from './TrackingProductSkeleton';
import { Eye } from 'lucide-react';

interface TrackingProductListProps {
    packages: any[];
    loading: boolean;
    onPackageClick: (pkg: any) => void;
}

const TrackingProductList: React.FC<TrackingProductListProps> = ({ packages, loading, onPackageClick }) => {
    // Remove local page state, expect parent to handle pagination and pass correct packages
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='max-h-[59vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[53vh] xl:max-h-[59vh] overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                            <tr>
                                <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                <th className='py-3 px-4 text-left w-[18vw]'>Mã package</th>
                                <th className='py-3 px-4 text-left w-[16vw]'>Điểm thu gom</th>
                                <th className='py-3 px-4 text-left w-[12vw]'>Trạng thái</th>
                                <th className='py-3 px-4 text-right w-[10vw]'>Số sản phẩm</th>
                                <th className='py-3 px-4 text-center w-[10vw]'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <TrackingProductSkeleton key={idx} />
                                ))
                            ) : packages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='py-8 text-center text-gray-400'>
                                        Không có package nào
                                    </td>
                                </tr>
                            ) : (
                                packages.map((pkg, index) => {
                                    const isLast = index === packages.length - 1;
                                    const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                    return (
                                        <tr
                                            key={pkg.packageId}
                                            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                                        >
                                            <td className='py-3 px-4 text-center w-[5vw]'>
                                                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                    {pkg.stt}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[18vw]'>
                                                <div className='font-medium'>{pkg.packageId || 'N/A'}</div>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[16vw]'>
                                                <span>{pkg.smallCollectionPointsName || pkg.smallCollectionPointsAddress || 'N/A'}</span>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[12vw]'>
                                                <span>{pkg.status || 'N/A'}</span>
                                            </td>
                                            <td className='py-3 px-4 text-right text-gray-700 w-[10vw]'>
                                                <span>{pkg.products?.totalItems ?? pkg.totalItems ?? 0}</span>
                                            </td>
                                            <td className='py-3 px-4 text-center align-middle w-[10vw]'>
                                                <div className='flex items-center justify-center h-full'>
                                                    <button
                                                        onClick={() => onPackageClick(pkg)}
                                                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs'
                                                        title='Xem chi tiết'
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrackingProductList;