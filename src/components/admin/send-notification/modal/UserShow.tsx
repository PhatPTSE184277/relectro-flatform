import React from 'react';
import { User } from '@/services/admin/SendNotiService';
import { formatDate } from '@/utils/FormatDate';
// removed masking per request

interface UserShowProps {
    user: User;
    stt: number;
    isLast?: boolean;
    isSelected: boolean;
    onToggleSelect: (userId: string) => void;
    hideRole?: boolean;
}

const UserShow: React.FC<UserShowProps> = ({
    user,
    stt,
    isLast = false,
    isSelected,
    onToggleSelect
}) => {
    const rowBgClass = isSelected ? 'bg-primary-50' : (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBgClass}`}> 
            <td className='py-3 px-4 text-center w-12'>
                <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => onToggleSelect(user.userId)}
                    className='w-4 h-4 text-primary-600 bg-white rounded focus:ring-2 focus:ring-primary-500 cursor-pointer'
                />
            </td>
            <td className='py-3 px-4 text-center w-16'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900 w-52'>
                {user.name || 'Không rõ'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-64'>{user.email}</td>
            <td className='py-3 px-4 text-gray-700 w-36'>
                {user.phone || '-'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-36'>
                {formatDate((user as any).createAt)}
            </td>
        </tr>
    );
};

export default UserShow;
