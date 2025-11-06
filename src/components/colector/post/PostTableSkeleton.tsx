import React from 'react';

const PostRowSkeleton: React.FC = () => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-2">
      <div className="w-20 h-14 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="py-3 px-2 font-medium max-w-[420px]">
      <div className="h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
      <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
    </td>
    <td className="py-3 px-2">
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </td>
  </tr>
);

export default PostRowSkeleton;