import React from 'react';

interface PackageTableSkeletonProps {
    showDeliveryTime?: boolean;
}

const PackageTableSkeleton: React.FC<PackageTableSkeletonProps> = ({ showDeliveryTime = true }) => (
    <tr className="border-b border-primary-100 hover:bg-primary-50/40 transition-colors">
        <td className="py-3 px-4 text-center w-[5vw] min-w-[5vw]">
            <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto" />
        </td>
        <td className="py-3 px-4 font-medium w-[15vw] min-w-[10vw]">
            <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
        </td>
        <td className="py-3 px-4 font-medium w-[22vw] min-w-[12vw]">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-40 mt-2 animate-pulse" />
        </td>
        <td className="py-3 px-4 text-right text-gray-700 w-[10vw] min-w-[8vw]">
            <div className="h-4 bg-gray-200 rounded w-12 ml-auto animate-pulse" />
        </td>
        {showDeliveryTime && (
            <td className="py-3 px-4 text-center w-[15vw]">
                <div className="h-4 bg-gray-200 rounded w-28 mx-auto animate-pulse" />
            </td>
        )}
        <td className="py-3 px-4 w-[8vw] min-w-[8vw]">
            <div className="flex justify-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
        </td>
    </tr>
);

export default PackageTableSkeleton;
