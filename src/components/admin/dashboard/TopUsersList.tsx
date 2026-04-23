import React from 'react';
import { formatNumber } from '@/utils/formatNumber';
import { Eye } from 'lucide-react';

interface TopUser {
  userId: string;
  name: string;
  email: string;
  totalProducts: number;
  totalPoints: number;
}

interface TopUsersListProps {
  data: TopUser[];
  loading: boolean;
  onUserClick?: (user: TopUser) => void;
}

const TopUsersList: React.FC<TopUsersListProps> = ({ data, loading, onUserClick }) => {
  if (loading) {
    return (
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
        <div className='h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse' />
        <div className='space-y-3'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className='h-6 bg-gray-200 rounded animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
      <div className='overflow-x-auto max-h-95 overflow-y-auto'>
        <table className='w-full text-sm text-gray-800 table-fixed'>
          <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
            <tr>
              <th className='py-3 px-4 text-left w-16'>STT</th>
              <th className='py-3 px-4 text-left'>Tên người dùng</th>
              <th className='py-3 px-4 text-left'>Email</th>
              <th className='py-3 px-4 text-right w-40'>Số lượng sản phẩm</th>
              <th className='py-3 px-4 text-right w-32'>Tổng điểm</th>
              <th className='py-3 px-4 text-center w-20'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user, idx) => {
                const isLast = idx === data.length - 1;
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                return (
                  <tr
                    key={user.userId}
                    className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                  >
                    <td className='py-3 px-4 font-medium w-16'>
                      <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                        {formatNumber(idx + 1)}
                      </span>
                    </td>
                    <td className='py-3 px-4 font-medium text-gray-900'>
                      {user.name}
                    </td>
                    <td className='py-3 px-4 text-gray-700'>
                      {user.email}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-40'>
                      {formatNumber(user.totalProducts)}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-32'>
                      {formatNumber(user.totalPoints)}
                    </td>
                    <td className='py-3 px-4 w-20'>
                      <div className='flex justify-center'>
                        {onUserClick && (
                          <button
                            onClick={() => onUserClick(user)}
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
              })
            ) : (
              <tr>
                <td colSpan={6} className='text-center py-8 text-gray-400'>
                  Không có dữ liệu người dùng hàng đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsersList;
