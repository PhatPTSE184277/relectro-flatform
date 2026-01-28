import React from 'react';

const UserListSkeleton: React.FC = () => {
    return (
        <tr className="border-b border-primary-100 animate-pulse">
            <td className="py-3 px-4 text-center w-16">
                <div className="w-4 h-4 bg-gray-200 rounded mx-auto"></div>
            </td>
            <td className="py-3 px-4 text-center w-16">
                <div className="w-7 h-7 rounded-full bg-gray-200 mx-auto"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="py-3 px-4 text-center">
                <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div>
            </td>
        </tr>
    );
};

export default UserListSkeleton;
