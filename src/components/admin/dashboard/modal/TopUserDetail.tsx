'use client';
import React from 'react';
import { X, User, Package, Trophy, Eye } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatDate } from '@/utils/FormatDate';
import { formatNumber } from '@/utils/formatNumber';

interface TopUser {
  userId: string;
  name: string;
  email: string;
  totalProducts: number;
  totalPoints?: number;
}

interface UserProduct {
  productId: string;
  productName: string;
  brandName: string;
  status: string;
  point: number;
  createAt: string;
}

interface TopUserDetailProps {
  user: TopUser | null;
  onClose: () => void;
  products: UserProduct[];
  loading: boolean;
  startIndex?: number;
  onViewProductDetail?: (productId: string) => void;
}

const TopUserDetail: React.FC<TopUserDetailProps> = ({ user, onClose, products = [], loading = false, startIndex = 0, onViewProductDetail }) => {
  if (!user) return null;

  const summaryItems = [
    {
      icon: <User size={14} className='text-primary-400' />,
      label: 'Tên người dùng',
      value: user.name || 'N/A'
    },
    {
      icon: <Package size={14} className='text-primary-400' />,
      label: 'Tổng sản phẩm',
      value: user.totalProducts || 0
    },
    {
      icon: <Trophy size={14} className='text-primary-400' />,
      label: 'Tổng điểm',
      value: formatNumber(user.totalPoints ?? 0)
    }
  ];

  const normalizeStatusLabel = (status: string) => {
    if (status === 'CHO_THU_GOM') return 'Chờ thu gom';
    if (status === 'DA_THU_GOM') return 'Đã thu gom';
    if (status === 'THAT_BAI') return 'Thất bại';
    if (status === 'NHAP_KHO') return 'Nhập kho';
    if (status === 'DUNG') return 'Đã dùng';
    if (status === 'DA_TU_CHOI') return 'Đã từ chối';
    if (status === 'TAI_CHE') return 'Tái chế';
    return status;
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0 bg-black/30'></div>

      <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh]'>
        <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
          <h2 className='text-2xl font-bold text-gray-800'>Theo dõi người dùng</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
            aria-label='Đóng'
          >
            <X size={28} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          <SummaryCard items={summaryItems} singleRow={true} />

          <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
            {loading ? (
              <div className='p-6 text-center text-gray-400'>Đang tải...</div>
            ) : products.length > 0 ? (
              <div className='relative w-full overflow-y-auto' style={{ maxHeight: '55vh' }}>
                <table className='w-full text-sm text-gray-800 table-fixed'>
                  <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                    <tr>
                      <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                      <th className='py-3 px-4 text-left w-[26vw]'>Tên sản phẩm - Thương hiệu</th>
                      <th className='py-3 px-4 text-left w-[14vw]'>Trạng thái</th>
                      <th className='py-3 pr-8 pl-4 text-right w-[12vw]'>Điểm</th>
                      <th className='py-3 pl-8 pr-4 text-left w-[14vw]'>Ngày tạo</th>
                      <th className='py-3 px-4 text-center w-[8vw]'>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => {
                      const isLast = idx === products.length - 1;
                      const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                      return (
                        <tr
                          key={product.productId}
                          className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                        >
                          <td className='py-3 px-4 font-medium text-center'>
                            <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                              {formatNumber(startIndex + idx + 1)}
                            </span>
                          </td>
                          <td className='py-3 px-4 text-gray-900 font-medium'>{product.productName} - {product.brandName}</td>
                          <td className='py-3 px-4'>
                            <span className='inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700'>
                              {normalizeStatusLabel(product.status)}
                            </span>
                          </td>
                          <td className='py-3 pr-8 pl-4 text-right text-gray-700 font-semibold'>{formatNumber(product.point ?? 0)}</td>
                          <td className='py-3 pl-8 pr-4 text-gray-700 whitespace-nowrap'>{formatDate(product.createAt)}</td>
                          <td className='py-3 px-4 text-center'>
                            <div className='flex items-center justify-center'>
                              <button
                                onClick={() => onViewProductDetail?.(product.productId)}
                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs'
                                title='Xem chi tiết'
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='px-4 py-8 text-center text-gray-400'>Không có sản phẩm nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUserDetail;
