import React from 'react';
import { Eye, QrCode } from 'lucide-react';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageShowProps {
    package: PackageType;
    stt?: number;
    onView: () => void;
    onCheckProducts?: () => void;
    isLast?: boolean;
}

const PackageShow: React.FC<PackageShowProps> = ({
    package: pkg,
    stt,
    onView,
    onCheckProducts,
    isLast = false
}) => {
    const isRecycling = pkg.status === PackageStatus.Recycling;
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`} style={{ tableLayout: 'fixed' }}>
            <td className='py-3 px-4 text-center w-16'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-48'>
                <div className='text-gray-900'>{pkg.packageId}</div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-40'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {pkg.products.totalItems} sản phẩm
                </span>
            </td>
            <td className='py-3 px-4 w-32'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                    {isRecycling && onCheckProducts && (
                        <button
                            onClick={onCheckProducts}
                            className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                            title='Quét kiểm tra sản phẩm'
                        >
                            <QrCode size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PackageShow;
