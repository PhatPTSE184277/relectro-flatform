import React from 'react';
import { Eye } from 'lucide-react';

interface IWProductShowProps {
    product: any;
    onView: () => void;
    status?: string;
}

const IWProductShow: React.FC<IWProductShowProps & { isLast?: boolean; stt?: number }> = ({ product, onView, status, isLast = false, stt }) => {
    const isReceived = status === 'Nhập kho';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center' style={{ width: '60px' }}>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium' style={{ width: '180px' }}>
                <div className='text-gray-700 font-semibold'>
                    {product.categoryName || 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-xs' style={{ width: '160px' }}>
                {product.qrCode ? (
                    <span className='text-gray-700 font-mono'>
                        {product.qrCode}
                    </span>
                ) : (
                    <span className='text-gray-400 font-normal'>Chưa có</span>
                )}
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '140px' }}>
                {product.brandName || 'Không rõ'}
            </td>
            <td className='py-3 px-4 text-gray-700' style={{ width: '200px' }}>
                {product.description || (
                    <span className='text-gray-400'>Không có mô tả</span>
                )}
            </td>
            <td className='py-3 px-4 text-gray-700 text-center' style={{ width: '120px' }}>
                {isReceived ? (product.realPoint ?? 0) : (product.estimatePoint ?? 0)}
            </td>
            <td className='py-3 px-4' style={{ width: '100px' }}>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default IWProductShow;