import React from 'react';
import { Eye, Pencil, Package } from 'lucide-react';
import PackageTableSkeleton from './PackageTableSkeleton';
import { formatNumber } from '@/utils/formatNumber';
import { formatTimeWithDate } from '@/utils/FormatTime';
import type { PackageType } from '@/types/Package';

export interface PackageListProps {
    packages: Array<PackageType & { stt: number }>;
    loading: boolean;
    onPackageClick: (pkg: PackageType) => void;
    onUpdatePackage?: (pkg: PackageType) => void;
    onUpdateStatus?: (packageId: string) => void;
    showDeliveryTime?: boolean;
}

const PackageList: React.FC<PackageListProps> = ({
    packages,
    loading,
    onPackageClick,
    onUpdatePackage,
    onUpdateStatus,
    showDeliveryTime = true
}) => {
    const totalColumns = showDeliveryTime ? 6 : 5;

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='max-h-[59vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[53vh] xl:max-h-[55vh] overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                            <tr>
                                <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                <th className='py-3 px-4 text-left w-[15vw]'>Mã kiện hàng</th>
                                <th className='py-3 px-4 text-left w-[22vw]'>Công ty tái chế</th>
                                <th className='py-3 px-4 text-right w-[10vw]'>Số sản phẩm</th>
                                {showDeliveryTime && <th className='py-3 px-4 text-center w-[15vw]'>Giao lúc</th>}
                                <th className='py-3 px-4 text-center w-[8vw]'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <PackageTableSkeleton key={idx} showDeliveryTime={showDeliveryTime} />
                                ))
                            ) : packages.length === 0 ? (
                                <tr>
                                    <td colSpan={totalColumns} className='py-8 text-center text-gray-400'>
                                        Không có kiện hàng nào
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
                                                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                                    {formatNumber(pkg.stt)}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[15vw]'>
                                                <div className='font-medium'>{pkg.packageId || 'N/A'}</div>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 w-[22vw]'>
                                                <div className='font-medium'>{pkg.recyclerName || 'N/A'}</div>
                                                <div className='text-xs text-gray-500 mt-1'>{pkg.recyclerAddress || 'N/A'}</div>
                                            </td>
                                            <td className='py-3 px-4 text-right text-gray-700 w-[10vw]'>
                                                <span>{pkg.products?.totalItems ?? 0}</span>
                                            </td>
                                            {showDeliveryTime && (
                                                <td className='py-3 px-4 text-center text-gray-700 w-[15vw]'>
                                                    {pkg.deliveryAt ? formatTimeWithDate(pkg.deliveryAt, true) : 'N/A'}
                                                </td>
                                            )}
                                            <td className='py-3 px-4 text-center align-middle w-[8vw]'>
                                                <div className='flex items-center justify-center h-full'>
                                                    <button
                                                        onClick={() => onPackageClick(pkg)}
                                                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs'
                                                        title='Xem chi tiết'
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {pkg.status === 'Đang đóng gói' && onUpdatePackage && onUpdateStatus && (
                                                        <>
                                                            <button
                                                                onClick={() => onUpdatePackage(pkg)}
                                                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs ml-2'
                                                                title='Chỉnh sửa kiện hàng'
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => onUpdateStatus(pkg.packageId)}
                                                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs ml-2'
                                                                title='Xác nhận đóng gói'
                                                            >
                                                                <Package size={16} />
                                                            </button>
                                                        </>
                                                    )}
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

export default PackageList;