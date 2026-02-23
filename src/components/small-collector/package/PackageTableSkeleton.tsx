import React from 'react';


const PackageTableSkeleton: React.FC = () => (
    <tr className="border-b border-primary-100 hover:bg-primary-50/40 transition-colors">
        <td className="py-3 px-4 text-center w-[5vw] min-w-[5vw]">
            <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto" />
        </td>
        <td className="py-3 px-4 font-medium w-[13vw] min-w-[10vw]">
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
        </td>
        <td className="py-3 px-4 text-right w-[9vw] min-w-[8vw]">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse ml-auto" />
        </td>
        <td className="py-3 px-4 w-[12vw] min-w-[10vw]">
            <div className="flex justify-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
        </td>
    </tr>
);

export default PackageTableSkeleton;
