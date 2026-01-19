import React from 'react';

const RouteTableSkeleton: React.FC = () => {
    return (
        <tr className="border-b border-primary-100 animate-pulse">
            <td className="py-3 px-4 font-medium w-16">
                <div className="w-6 h-6 rounded-full bg-gray-200 mx-auto"></div>
            </td>
            <td className="py-3 px-4 w-56">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="py-3 px-4 w-64">
                <div className="h-3 bg-gray-200 rounded mb-2 ml-auto w-20"></div>
                <div className="h-3 bg-gray-200 rounded ml-auto w-32"></div>
            </td>
            <td className="py-3 px-4 w-42">
                <div className="h-4 bg-gray-200 rounded ml-auto w-16"></div>
            </td>
            <td className="py-3 px-4 w-42">
                <div className="h-4 bg-gray-200 rounded mx-auto w-16"></div>
            </td>
        </tr>
    );
};

export default RouteTableSkeleton;
