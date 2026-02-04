import React from 'react';
import { Eye, QrCode } from 'lucide-react';
import { PackageType } from '@/types/Package';

interface PackageShowProps {
    package: PackageType;
    stt: number;
    onView: () => void;
    onScan?: () => void;
}

const PackageShow: React.FC<PackageShowProps & { isLast?: boolean }> = ({
    package: pkg,
    stt,
    onView,
    onScan,
    isLast = false
}) => {
    const rowBg = ((stt ?? 1) - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`} style={{ tableLayout: 'fixed' }}>
            <td className='py-3 px-4 text-center w-[5vw] min-w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>

            <td className='py-3 px-4 font-medium w-[20vw] min-w-[10vw]'>
                <div className='text-gray-900'>{pkg.packageId}</div>
            </td>

            <td className='py-3 px-4 text-gray-700 text-right w-[20vw] min-w-[10vw]'>
                <span className='text-sm font-medium text-gray-900'>
                    {pkg.products.totalItems}
                </span>
            </td>

            <td className='py-3 px-4 w-[12vw] min-w-[8vw]'>
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
