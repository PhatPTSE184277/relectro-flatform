import React from 'react';
import { Eye } from 'lucide-react';
import { PackageType } from '@/types/Package';

interface PackageShowProps {
    package: PackageType;
    onView: () => void;
    onScan?: () => void;
}

const PackageShow: React.FC<PackageShowProps> = ({
    package: pkg,
    onView,
    onScan
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

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                    {onScan && (
                        <button
                            onClick={onScan}
                            className='text-green-600 hover:text-green-800 flex items-center gap-1 font-medium transition cursor-pointer'
                            title='Quét mã package'
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01"/>
                            </svg>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PackageShow;
