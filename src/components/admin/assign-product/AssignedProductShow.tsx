import React from 'react';

interface AssignedProductShowProps {
    product: any;
    isLast?: boolean;
    index?: number;
}

const AssignedProductShow: React.FC<AssignedProductShowProps> = ({
    product,
    isLast = false,
    index
}) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} bg-primary-50/30 hover:bg-primary-100/40 transition-colors`}>
            <td className="py-3 px-4 text-center w-16">
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className="py-3 px-4 font-medium w50">
                <div className="text-sm text-gray-500 mt-1">
                    {product.categoryName ? product.categoryName : 'Không rõ'}
                    {' - '}
                    {product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className="py-3 px-4 text-gray-700 w-45">
                {product.userName || <span className="text-gray-400">Chưa có</span>}
            </td>
            <td className="py-3 px-4 text-gray-700 w-[420px]">
                <div className="line-clamp-2 wrap-break-word">{product.address || <span className="text-gray-400">Chưa có</span>}</div>
            </td>
        </tr>
    );
};

export default AssignedProductShow;
