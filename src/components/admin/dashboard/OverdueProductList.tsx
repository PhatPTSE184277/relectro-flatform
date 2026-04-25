import React from 'react';
import OverdueProductShow from './OverdueProductShow';
import Pagination from '@/components/ui/Pagination';
import type { OverdueDetailsResponse } from '@/services/admin/DashboardService';

interface OverdueProductListProps {
  scpName: string;
  detail: OverdueDetailsResponse | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const OverdueProductList: React.FC<OverdueProductListProps> = ({
  detail,
  loading,
  onPageChange,
}) => {
  const rows = detail?.data || [];
  const currentPage = detail?.page ?? 1;
  const totalPages = detail?.totalPages ?? 1;
  const limit = detail?.limit ?? 10;

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
      <div className='overflow-x-auto w-full'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <div className='max-h-[56vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[48vh] xl:max-h-[56vh] overflow-y-auto w-full'>
              <table className='w-full text-sm text-gray-800 table-fixed'>
                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                  <tr>
                    <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                    <th className='py-3 px-4 text-left w-[12vw]'>Người dùng</th>
                    <th className='py-3 px-4 text-left w-[10vw]'>SĐT</th>
                    <th className='py-3 px-4 text-left w-[12vw]'>Thương hiệu</th>
                    <th className='py-3 px-4 text-left w-[12vw]'>Danh mục</th>
                    <th className='py-3 px-4 text-left w-[8vw]'>Hạn chót</th>
                    <th className='py-3 px-4 text-right w-[7vw]'>Trễ (ngày)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className='border-b border-primary-100'>
                        <td className='py-3 px-4 text-center w-[5vw]'>
                          <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                        </td>
                        <td className='py-3 px-4 w-[12vw]'>
                          <div className='h-4 bg-gray-200 rounded w-28 animate-pulse mb-2' />
                          <div className='h-3 bg-gray-200 rounded w-20 animate-pulse' />
                        </td>
                        <td className='py-3 px-4 w-[10vw]'>
                          <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
                        </td>
                        <td className='py-3 px-4 w-[12vw]'>
                          <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
                        </td>
                        <td className='py-3 px-4 w-[12vw]'>
                          <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
                        </td>
                        <td className='py-3 px-4 w-[8vw]'>
                          <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
                        </td>
                        <td className='py-3 px-4 w-[7vw] text-right'>
                          <div className='h-4 bg-gray-200 rounded w-12 animate-pulse ml-auto' />
                        </td>
                      </tr>
                    ))
                  ) : rows.length > 0 ? (
                    rows.map((item: any, idx: number) => (
                      <OverdueProductShow
                        key={item.productId}
                        product={item}
                        stt={(currentPage - 1) * limit + idx + 1}
                        isLast={idx === rows.length - 1}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className='text-center py-8 text-gray-400'>
                        Không có dữ liệu đơn quá hạn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='p-4 border-t border-gray-100'>
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default OverdueProductList;
