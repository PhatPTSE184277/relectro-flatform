import React from 'react';
import ProductCategoryListSkeleton from './ProductCategoryListSkeleton';

interface ProductCategory {
  categoryName: string;
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange';
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
      <div className='overflow-x-auto'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
              <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                <tr>
                  <th className='py-3 px-4 text-center' style={{ width: '80px' }}>STT</th>
                  <th className='py-3 px-4 text-left' style={{ width: 'auto' }}>Danh mục sản phẩm</th>
                  <th className='py-3 px-4 text-center' style={{ width: '220px' }}>Số lượng</th>
                  <th className='py-3 px-4 text-center' style={{ width: '220px' }}>Thay đổi</th>
                  <th className='py-3 px-4 text-center' style={{ width: '220px' }}>% Tổng</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className='max-h-85 overflow-y-auto'>
            <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
              <tbody>
                {data.length > 0 ? (
                  data.map((category, idx) => {
                    const isLast = idx === data.length - 1;
                    const percentOfTotal = totalProducts > 0 ? Math.round((category.currentValue / totalProducts) * 100) : 0;
                    return (
                      <tr
                        key={idx}
                        className={`${!isLast ? 'border-b border-primary-100' : ''} bg-primary-50/30 hover:bg-primary-100/40 transition-colors`}
                      >
                        <td className="py-3 px-4 text-center" style={{ width: '80px' }}>
                          <span className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900" style={{ width: 'auto' }}>
                          {category.categoryName}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 font-semibold" style={{ width: '220px' }}>
                          {category.currentValue}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 font-semibold" style={{ width: '220px' }}>
                          {category.trend === 'Increase' ? '▲' : category.trend === 'Decrease' ? '▼' : ''} {category.absoluteChange > 0 ? '+' : ''}{category.absoluteChange} ({category.percentChange}%)
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 font-semibold" style={{ width: '220px' }}>
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
      </div>
    </div>
  );
};

export default ProductCategoryList;
