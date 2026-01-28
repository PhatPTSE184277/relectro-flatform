import React, { useRef, useEffect } from 'react';
import UserShow from './UserShow';
import UserListSkeleton from './UserListSkeleton';
import { User } from '@/services/admin/SendNotiService';

interface UserListProps {
    users: User[];
    loading: boolean;
    selectedUserIds: string[];
    allUserIds: string[]; // All user IDs across all pages
    onToggleSelect: (userId: string) => void;
    onToggleSelectAll: () => void;
    page: number;
    pageSize: number;
}

const UserList: React.FC<UserListProps> = ({
    users,
    loading,
    selectedUserIds,
    allUserIds,
    onToggleSelect,
    onToggleSelectAll,
    page,
    pageSize,
}) => {
    const selectAllRef = useRef<HTMLInputElement>(null);

    // Check if all users across all pages are selected
    const allSelected = allUserIds.length > 0 && selectedUserIds.length === allUserIds.length;
    const someSelected = selectedUserIds.length > 0 && selectedUserIds.length < allUserIds.length;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    return (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-83 overflow-y-auto'>
                            <table className='min-w-full text-sm text-gray-800'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-12'>
                                            <input
                                                ref={selectAllRef}
                                                type='checkbox'
                                                checked={allSelected}
                                                onChange={() => onToggleSelectAll()}
                                                className='w-4 h-4 text-primary-600 bg-white rounded focus:ring-2 focus:ring-primary-500 cursor-pointer'
                                            />
                                        </th>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-52'>Tên</th>
                                        <th className='py-3 px-4 text-left w-64'>Email</th>
                                        <th className='py-3 px-4 text-left w-36'>Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <UserListSkeleton key={idx} />
                                        ))
                                    ) : users.length > 0 ? (
                                        users.map((user, idx) => (
                                            <UserShow
                                                key={user.userId}
                                                user={user}
                                                stt={(page - 1) * pageSize + idx + 1}
                                                isLast={idx === users.length - 1}
                                                isSelected={selectedUserIds.includes(user.userId)}
                                                onToggleSelect={onToggleSelect}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className='text-center py-8 text-gray-400'>
                                                Không có người dùng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
