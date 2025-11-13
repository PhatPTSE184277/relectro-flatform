import React from 'react';
import { Eye } from 'lucide-react';
import type { Package } from '@/services/collector/PackageService';

interface PackageShowProps {
    package: Package;
    onView: () => void;
}

const PackageShow: React.FC<PackageShowProps> = ({
    package: pkg,
    onView
}) => {
    return (
        <tr className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'>
            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{pkg.packageId}</div>
            </td>

            <td className='py-3 px-4 font-medium'>
                <div className='text-gray-900'>{pkg.packageName}</div>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                    {pkg.products.length} sản phẩm
                </span>
            </td>

            <td className='py-3 px-4 text-gray-700'>
                Điểm thu gom {pkg.smallCollectionPointsId}
            </td>

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default PackageShow;
