'use client';

import React from 'react';
import { X, Tags, Package } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/utils/FormatDate';
import { formatNumber } from '@/utils/formatNumber';

interface BrandDetailItem {
  userName: string;
  categoryName: string;
  point: number;
  collectedDate: string;
  scpName: string;
}

interface BrandDetailResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: BrandDetailItem[];
}

interface BrandDetailProps {
  open: boolean;
  brandName: string;
  detail: BrandDetailResponse | null;
  loading: boolean;
  onClose: () => void;
  onPageChange: (page: number) => void;
}

const BrandDetail: React.FC<BrandDetailProps> = ({
  open,
  brandName,
  detail,
  loading,
  onClose,
  onPageChange
}) => {
  if (!open) return null;

  const currentPage = detail?.page ?? 1;
  const limit = detail?.limit ?? 10;
  const totalItems = detail?.totalItems ?? 0;
  const totalPages = detail?.totalPages ?? 1;
  const rows = detail?.data ?? [];
  const startIndex = (currentPage - 1) * limit;

  const summaryItems = [
    {
      icon: <Tags size={14} className='text-primary-400' />,
      label: 'Thương hiệu',
      value: brandName || 'N/A'
    },
    {
      icon: <Package size={14} className='text-primary-400' />,
      label: 'Tổng sản phẩm',
      value: formatNumber(totalItems)
    }
  ];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0 bg-black/30'></div>

      <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh]'>
        <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
          <h2 className='text-2xl font-bold text-gray-800'>Chi tiết thương hiệu</h2>
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
            ) : rows.length > 0 ? (
              <>
                <div className='relative w-full overflow-y-auto' style={{ maxHeight: '55vh' }}>
                  <table className='w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                      <tr>
                        <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                        <th className='py-3 px-4 text-left w-[18vw]'>Người dùng</th>
                        <th className='py-3 px-4 text-left w-[18vw]'>Danh mục</th>
                        <th className='py-3 px-4 text-right w-[12vw]'>Điểm</th>
                        <th className='py-3 px-4 text-left w-[12vw]'>Ngày thu gom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item, idx) => {
                        const isLast = idx === rows.length - 1;
                        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                        return (
                          <tr
                            key={`${item.userName}-${item.categoryName}-${idx}`}
                            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                          >
                            <td className='py-3 px-4 font-medium text-center'>
                              <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                {formatNumber(startIndex + idx + 1)}
                              </span>
                            </td>
                            <td className='py-3 px-4 text-gray-900 font-medium'>{item.userName}</td>
                            <td className='py-3 px-4 text-gray-700'>{item.categoryName}</td>
                            <td className='py-3 px-4 text-right text-gray-700 font-semibold'>{formatNumber(item.point ?? 0)}</td>
                            <td className='py-3 px-4 text-gray-700 whitespace-nowrap'>{formatDate(item.collectedDate)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className='px-4 pb-4 border-t border-primary-100'>
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              </>
            ) : (
              <div className='px-4 py-8 text-center text-gray-400'>Không có dữ liệu chi tiết thương hiệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
