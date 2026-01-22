import React from 'react';
import { Eye } from 'lucide-react';

interface CollectionPointShowProps {
    point: any;
    stt: number;
    onViewProducts: () => void;
    isLast?: boolean;
}

const CollectionPointShow: React.FC<CollectionPointShowProps> = ({ point, stt, onViewProducts, isLast = false }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900'>
                {point.name}
            </td>
            <td className='py-3 px-4'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {point.totalProduct} sản phẩm
                </span>
            </td>
            <td className='py-3 px-4 text-center'>
                <button
                    onClick={onViewProducts}
                    className='text-primary-600 hover:text-primary-800 flex items-center justify-center font-medium transition cursor-pointer mx-auto'
                    title='Xem sản phẩm'
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>
    );
};

export default CollectionPointShow;
