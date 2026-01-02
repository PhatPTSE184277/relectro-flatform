import React from 'react';
import { Eye } from 'lucide-react';
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
            <td className="py-3 px-4 text-center">
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{pkg.packageId}</div>
            </td>



            <td className='py-3 px-4 text-gray-700'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {pkg.products.length} sản phẩm
                </span>
            </td>

            <td className='py-3 px-4'>
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
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                            </button>
                            <button
                                onClick={() => onUpdateStatus(pkg.packageId)}
                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                                title='Đóng trạng thái package'
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PackageShow;
