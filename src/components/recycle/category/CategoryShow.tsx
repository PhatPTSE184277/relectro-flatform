import React from 'react';
import { Eye } from 'lucide-react';
import { CompanyCategoryDetail } from '@/services/recycle/CategoryService';

interface CategoryShowProps {
    category: CompanyCategoryDetail;
    stt?: number;
    isLast?: boolean;
    onViewDetail?: () => void;
}

const CategoryShow: React.FC<CategoryShowProps> = ({
    category,
    stt,
    isLast = false,
    onViewDetail
}) => {
    const rowBg = ((stt ?? 1) - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`} style={{ tableLayout: 'fixed' }}>
            <td className='py-3 px-4 text-center w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-[40vw]'>
                <div className='text-gray-900'>{category.name}</div>
            </td>
            <td className='py-3 px-4 w-[12vw]'>
                <div className='flex justify-center gap-2'>
                    {onViewDetail && (
                        <button
                            onClick={onViewDetail}
                            className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                            title='Xem chi tiết'
                        >
                            <Eye size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default CategoryShow;
