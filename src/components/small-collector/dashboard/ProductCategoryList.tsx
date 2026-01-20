import React from 'react';
import ProductCategoryListSkeleton from './ProductCategoryListSkeleton';

interface ProductCategory {
  categoryName: string;
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
}

interface ProductCategoryListProps {
  data: ProductCategory[];
  loading: boolean;
}

const ProductCategoryList: React.FC<ProductCategoryListProps & { total?: number }> = ({ data, loading, total }) => {
  if (loading) {
    return <ProductCategoryListSkeleton />;
  }

  // Tính tổng số lượng sản phẩm nếu chưa truyền vào
  const totalProducts = typeof total === 'number' ? total : data.reduce((sum, c) => sum + (c.currentValue || 0), 0);

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
      <div className='overflow-x-auto max-h-105 overflow-y-auto'>
        <table className='w-full text-sm text-gray-800 table-fixed'>
          <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
            <tr>
              <th className='py-3 px-4 text-left w-16'>STT</th>
              <th className='py-3 px-4 text-left'>Danh mục sản phẩm</th>
              <th className='py-3 px-4 text-right w-72'>Số lượng</th>
              <th className='py-3 px-4 text-right w-72'>Thay đổi</th>
              <th className='py-3 px-4 text-right w-72'>% Tổng</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((category, idx) => {
                const isLast = idx === data.length - 1;
                const percentOfTotal = totalProducts > 0 ? Math.round((category.currentValue / totalProducts) * 100) : 0;
                return (
                  <tr
                    key={idx}
                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors`}
                  >
                    <td className='py-3 px-4 font-medium w-16'>
                      <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                        {idx + 1}
                      </span>
                    </td>
                    <td className='py-3 px-4 font-medium text-gray-900'>
                      {category.categoryName}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                      {category.currentValue}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                      {category.trend === 'Increase' ? '▲' : category.trend === 'Decrease' ? '▼' : ''} {category.absoluteChange > 0 ? '+' : ''}{category.absoluteChange} ({category.percentChange}%)
                    </td>
                    <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                      {percentOfTotal}
                    </td> 
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className='text-center py-8 text-gray-400'>
                  Không có dữ liệu danh mục sản phẩm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCategoryList;
