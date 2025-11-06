import React from "react";

const CollectionRouteSkeleton: React.FC = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    <td className="py-3 px-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-20" />
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-12" />
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-40" />
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-16" />
    </td>
    <td className="py-3 px-4 text-center">
      <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
    </td>
    <td className="py-3 px-4 text-center">
      <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto" />
    </td>
  </tr>
);

export default CollectionRouteSkeleton;