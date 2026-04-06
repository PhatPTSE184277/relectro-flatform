import React from 'react';
import { formatNumber } from '@/utils/formatNumber';
import { Eye, Tag } from 'lucide-react';

interface CompanyShowProps {
    company: any;
    onView: () => void;
    onRegisterCategory: () => void;
    index?: number;
}

const CompanyShow: React.FC<CompanyShowProps & { isLast?: boolean }> = ({
    company,
    onView,
    onRegisterCategory,
    isLast = false,
    index
}) => {
    const rowBg = (index ?? 0) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-16'>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {typeof index === 'number' ? formatNumber(index + 1) : ''}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-56'>
                <div className='text-gray-900'>{company.name || 'Không rõ'}</div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-52'>
                {company.city || <span className='text-gray-400'>Chưa có</span>}
            </td>
            <td className='py-3 px-4 w-36'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>

                    <button
                        onClick={onRegisterCategory}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Đăng ký danh mục'
                        type='button'
                    >
                        <Tag size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CompanyShow;
