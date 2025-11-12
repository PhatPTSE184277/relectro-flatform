/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Eye, Package } from 'lucide-react';

interface IWProductShowProps {
    product: any;
    onView: () => void;
    onReceive: () => void;
}

const IWProductShow: React.FC<IWProductShowProps> = ({
    product,
    onView,
    onReceive
}) => {
    const getStatusBadge = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || '';
        
        if (normalizedStatus.includes('chờ') || normalizedStatus === 'pending') {
            return (
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700'>
                    Chờ thu gom
                </span>
            );
        }
        if (normalizedStatus.includes('đã thu') || normalizedStatus === 'collected') {
            return (
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                    Đã thu gom
                </span>
            );
        }
        if (normalizedStatus.includes('hủy') || normalizedStatus === 'cancelled') {
            return (
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                    Hủy bỏ
                </span>
            );
        }
        if (normalizedStatus.includes('nhập') || normalizedStatus === 'received') {
            return (
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                    Nhập kho
                </span>
            );
        }
        return (
            <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
                {status}
            </span>
        );
    };

    const canReceive = product.status?.toLowerCase().includes('đã thu') || product.status?.toLowerCase() === 'collected';

    return (
        <tr className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'>
            <td className='py-3 px-4'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm'>
                    <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name || 'Sản phẩm'}
                        className='w-full h-full object-cover'
                    />
                </div>
            </td>

            <td className='py-3 px-4 font-medium max-w-[220px]'>
                <div className='text-gray-900 line-clamp-2'>{product.name || 'Không rõ'}</div>
            </td>

            <td className='py-3 px-4 text-gray-700 font-mono text-xs'>
                {product.qrCode || 'N/A'}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {product.smallCollectionPointName || 'Không rõ'}
            </td>

            <td className='py-3 px-4 text-sm text-gray-600'>
                {product.pickUpDate ? new Date(product.pickUpDate).toLocaleDateString('vi-VN') : 'N/A'}
            </td>

            <td className='py-3 px-4'>
                {getStatusBadge(product.status)}
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
                    {canReceive && (
                        <button
                            onClick={onReceive}
                            className='text-green-600 hover:text-green-800 flex items-center gap-1 font-medium transition cursor-pointer'
                            title='Nhận hàng vào kho'
                        >
                            <Package size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default IWProductShow;