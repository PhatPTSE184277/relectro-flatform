import React from 'react';
import { Eye, QrCode } from 'lucide-react';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageShowProps {
    package: PackageType;
    onView: () => void;
    onCheckProducts?: () => void;
}

const PackageShow: React.FC<PackageShowProps & { isLast?: boolean }> = ({
    package: pkg,
    onView,
    onCheckProducts,
    isLast = false
}) => {
    const isRecycling = pkg.status === PackageStatus.Recycling;
    
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{pkg.packageId}</div>
            </td>

            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{pkg.packageName}</div>
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
