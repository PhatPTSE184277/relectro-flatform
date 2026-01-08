import React from 'react';

const ProductCategoryListSkeleton: React.FC = () => (
  <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
    <div className='overflow-x-auto'>
      <div className='inline-block min-w-full align-middle'>
        <div className='overflow-hidden'>
          <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
              <tr>
                <th className='py-3 px-4 text-center' style={{ width: '60px' }}>STT</th>
                <th className='py-3 px-4 text-left' style={{ width: 'auto' }}>Danh mục sản phẩm</th>
                <th className='py-3 px-4 text-center' style={{ width: '100px' }}>Số lượng</th>
                <th className='py-3 px-4 text-center' style={{ width: '150px' }}>Thay đổi</th>
                <th className='py-3 px-4 text-center' style={{ width: '100px' }}>% Tổng</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className='max-h-96 overflow-y-auto'>
          <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
            <tbody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='py-3 px-4' style={{ width: '60px' }}>
                    <div className='flex items-center justify-center'>
                      <div className='w-7 h-7 rounded-full bg-gray-200 animate-pulse' />
                    </div>
                  </td>
                  <td className='py-3 px-4' style={{ width: 'auto' }}>
                    <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                  </td>
                  <td className='py-3 px-4 text-center' style={{ width: '100px' }}>
                    <div className='h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse' />
                  </td>
                  <td className='py-3 px-4 text-center' style={{ width: '150px' }}>
                    <div className='h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse' />
                  </td>
                  <td className='py-3 px-4 text-center' style={{ width: '100px' }}>
                    <div className='h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse' />
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
