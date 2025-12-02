import React from 'react';
import { Eye, QrCode } from 'lucide-react';
import { PackageType } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageShowProps {
    package: PackageType;
    onView: () => void;
    onScan?: () => void;
}

const PackageShow: React.FC<PackageShowProps & { isLast?: boolean }> = ({
    package: pkg,
    onView,
    onScan,
    isLast = false
}) => {
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
                <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        pkg.status === PackageStatus.Closed
                            ? 'bg-purple-100 text-purple-700'
                            : pkg.status === PackageStatus.Shipping
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {pkg.status}
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
                    {onScan && (
                        <button
                            onClick={onScan}
                            className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                            title='Quét mã package'
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
