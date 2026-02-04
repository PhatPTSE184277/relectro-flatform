import React from 'react';
import { Eye } from 'lucide-react';

interface IWProductShowProps {
    product: any;
    onView: () => void;
    status?: string;
}

const IWProductShow: React.FC<IWProductShowProps & { isLast?: boolean; stt?: number }> = ({ product, onView, isLast = false, stt }) => {
    const rowBg = ((stt ?? 1) - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`}>
            <td className='py-3 px-4 text-center w-[5vw] min-w-10'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-[14vw] min-w-20'>
                <div className='text-gray-700 font-normal'>
                    {product.categoryName || 'Không rõ'}
                </div>
            </td>
            {/* QR column removed per request */}
            <td className='py-3 px-4 text-gray-700 w-[12vw] min-w-[70px]'>
                {product.brandName || 'Không rõ'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-[18vw] min-w-[120px]'>
                {product.description || (
                    <span className='text-gray-400'>Không có mô tả</span>
                )}
            </td>
            <td className='py-3 px-4 w-[7vw] min-w-12'>
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