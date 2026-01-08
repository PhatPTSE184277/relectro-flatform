import React from 'react';


const PackageTableSkeleton: React.FC = () => (
    <tr className="border-b border-primary-100 hover:bg-primary-50/40 transition-colors">
        <td className="py-3 px-4 text-center" style={{ width: '60px' }}>
            <span className="w-7 h-7 rounded-full bg-gray-200 animate-pulse flex items-center justify-center mx-auto" />
        </td>
        <td className="py-3 px-4 font-medium" style={{ width: '180px' }}>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-1" />
        </td>
        <td className="py-3 px-4 text-gray-700" style={{ width: '160px' }}>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400 animate-pulse inline-block w-20 h-6" />
        </td>
        <td className="py-3 px-4" style={{ width: '120px' }}>
            <div className="flex justify-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
        </td>
    </tr>
);

export default PackageTableSkeleton;
