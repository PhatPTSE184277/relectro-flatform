import React from 'react';
import type { CollectionRoute } from '@/types/CollectionRoute';
import { formatAddress } from '@/utils/FormatAddress';

interface SeedQRRouteShowProps {
    route: CollectionRoute;
    stt: number;
    isLast?: boolean;
    checked: boolean;
    onToggle: () => void;
}

const SeedQRProductShow: React.FC<SeedQRRouteShowProps> = ({
    route,
    stt,
    isLast = false,
    checked,
    onToggle
}) => {
    const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr
            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors cursor-pointer`}
            onClick={onToggle}
        >
            <td className='py-3 px-4 text-center w-[5vw]'>
                <input
                    type='checkbox'
                    checked={checked}
                    onChange={onToggle}
                    onClick={(e) => e.stopPropagation()}
                    className='w-4 h-4 cursor-pointer accent-primary-600'
                />
            </td>
            <td className='py-3 px-4 text-center w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-[18vw]'>
                <div className='text-gray-900 line-clamp-2'>{route.sender?.name || 'Không rõ'}</div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-[14vw]'>
                {route.brandName || 'Không rõ'}
            </td>
            <td className='py-3 px-4 text-gray-500 truncate max-w-[22vw]'>
                {formatAddress(route.address) || <span className='text-gray-400 italic'>Không có địa chỉ</span>}
            </td>
            {/* estimated time column removed */}
        </tr>
    );
};

export default SeedQRProductShow;
