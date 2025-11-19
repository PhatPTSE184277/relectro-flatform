/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Eye } from 'lucide-react';

interface IWProductShowProps {
    product: any;
    onView: () => void;
}

const IWProductShow: React.FC<IWProductShowProps> = ({ product, onView }) => {
    // Lấy ảnh đầu tiên từ mảng productImages
    const productImage = product.productImages?.[0] || '/placeholder.png';

    return (
        <tr className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'>
            <td className='py-3 px-4'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm'>
                    <img
                        src={productImage}
                        alt={product.categoryName || 'Sản phẩm'}
                        className='w-full h-full object-cover'
                    />
                </div>
            </td>

            <td className='py-3 px-4 font-medium max-w-[220px]'>
                <div className='text-gray-900 font-semibold'>
                    {product.categoryName || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-xs'>
                {product.qrCode ? (
                    <span className='text-gray-700 font-mono'>
                        {product.qrCode}
                    </span>
                ) : (
                    <span className='text-gray-400 font-normal'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {product.brandName || 'Không rõ'}
            </td>

            <td className='py-3 px-4 text-gray-700'>
                {product.description || (
                    <span className='text-gray-400'>Không có mô tả</span>
                )}
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

export default IWProductShow;
