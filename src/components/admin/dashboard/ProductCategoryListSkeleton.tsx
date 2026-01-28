import React from 'react';

const ProductCategoryListSkeleton: React.FC = () => (
  <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
    <div className='overflow-x-auto'>
      <div className='inline-block min-w-full align-middle'>
        <div className='overflow-hidden'>
          <table className='min-w-full text-sm text-gray-800 table-fixed'>
            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
              <tr>
                <th className='py-3 px-2 text-center w-12 sm:w-16 md:w-20'>STT</th>
                <th className='py-3 px-4 text-left min-w-[140px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[260px]'>Danh mục sản phẩm</th>
                <th className='py-3 px-2 text-right w-24 sm:w-32 md:w-40'>Số lượng</th>
                <th className='py-3 px-2 text-right w-24 sm:w-32 md:w-40'>Thay đổi</th>
                <th className='py-3 px-2 text-right w-20 sm:w-24 md:w-28'>% Tổng</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className='max-h-[340px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto'>
          <table className='min-w-full text-sm text-gray-800 table-fixed'>
            <tbody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='py-3 px-4 text-center w-12 sm:w-16 md:w-20'>
                    <div className='flex items-center justify-center'>
                      <div className='w-7 h-7 rounded-full bg-gray-200 animate-pulse' />
                    </div>
                  </td>
                  <td className='py-3 px-4 min-w-[140px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[260px]'>
                    <div className='h-4 bg-gray-200 rounded w-32 sm:w-48 md:w-56 lg:w-64 animate-pulse' />
                  </td>
                  <td className='py-3 px-4 text-right w-24 sm:w-32 md:w-40'>
                    <div className='h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse' />
                  </td>
                  <td className='py-3 px-4 text-right w-24 sm:w-32 md:w-40'>
                    <div className='h-4 bg-gray-200 rounded w-16 sm:w-24 md:w-32 mx-auto animate-pulse' />
                  </td>
                  <td className='py-3 px-4 text-right w-20 sm:w-24 md:w-28'>
                    <div className='h-4 bg-gray-200 rounded w-10 mx-auto animate-pulse' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default ProductCategoryListSkeleton;
