import React from 'react';
import { Eye } from 'lucide-react';

interface CompanyShowProps {
    company: any;
    stt: number;
    onViewPoints: () => void;
    isLast?: boolean;
}

const CompanyShow: React.FC<CompanyShowProps> = ({ company, stt, onViewPoints, isLast = false }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-center'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900'>
                {company.companyName}
            </td>
            <td className='py-3 px-4'>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                    {company.totalCompanyProducts} sản phẩm
                </span>
            </td>
            <td className='py-3 px-4 text-center'>
                <button
                    onClick={onViewPoints}
                    className='text-primary-600 hover:text-primary-800 flex items-center justify-center font-medium transition cursor-pointer mx-auto'
                    title='Xem các điểm thu gom'
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>
    );
};

export default CompanyShow;
