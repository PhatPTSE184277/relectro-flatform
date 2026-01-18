import React from 'react';

const ProductListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="relative w-full max-h-[40vh] overflow-y-auto">
      <table className="w-full text-sm text-gray-800 table-fixed">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10">
          <tr>
            <th className="py-3 px-4 text-center w-16">STT</th>
            <th className="py-3 px-4 text-left w-40">Danh mục</th>
            <th className="py-3 px-4 text-left w-32">Thương hiệu</th>
            <th className="py-3 px-4 text-left w-56">Ghi chú</th>
            <th className="py-3 px-4 text-center w-24">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx}>
              <td className="py-3 px-4 text-center">
                <span className="w-6 h-6 rounded-full bg-gray-200 animate-pulse block mx-auto" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
              </td>
              <td className="py-3 px-4 text-center">
                <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListSkeleton;
