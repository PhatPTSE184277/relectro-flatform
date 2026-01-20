import React from 'react';
import { Eye, Package, Pencil } from 'lucide-react';
import type { PackageType } from '@/types/Package';

interface PackageShowProps {
    package: PackageType;
    stt?: number;
    onView: () => void;
    onUpdate?: (pkg: PackageType) => void;
    onUpdateStatus?: (packageId: string) => void;
    isLast?: boolean;
}

const PackageShow: React.FC<PackageShowProps> = ({
    package: pkg,
    stt,
    onView,
    onUpdate,
    onUpdateStatus,
    isLast = false
}) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className="py-3 px-4 text-center" style={{ width: '60px' }}>
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium' style={{ width: '180px' }}>
                <div className='text-gray-900'>{pkg.packageId}</div>
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '160px' }}>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {pkg.products.totalItems} sản phẩm
                </span>
            </td>
            <td className='py-3 px-4' style={{ width: '120px' }}>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                    {pkg.status === 'Đang đóng gói' && onUpdate && onUpdateStatus && (
                        <>
                            <button
                                onClick={() => onUpdate(pkg)}
                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                                title='Chỉnh sửa package'
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => onUpdateStatus(pkg.packageId)}
                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                                title='Xác nhận đóng gói'
                            >
                                <Package size={18} />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PackageShow;
