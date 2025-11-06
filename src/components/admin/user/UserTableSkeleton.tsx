const UserTableSkeleton: React.FC = () => (
    <tr className="border-b border-gray-100">
        <td className="py-3 px-2">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        </td>
        <td className="py-3 px-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </td>
        <td className="py-3 px-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </td>
        <td className="py-3 px-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </td>
        <td className="py-3 px-2">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </td>
        <td className="py-3 px-2">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        </td>
    </tr>
);

export default UserTableSkeleton;