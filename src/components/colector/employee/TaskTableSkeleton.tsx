const EmployeeTaskTableSkeleton = () => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-gray-900">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2">Task</th>
                        <th className="text-left py-3 px-2">Assigned By</th>
                        <th className="text-left py-3 px-2">Priority</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Due Date</th>
                        <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(6)].map((_, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2">
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-100 rounded w-48 animate-pulse"></div>
                                </div>
                            </td>
                            <td className="py-3 px-2">
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </td>
                            <td className="py-3 px-2">
                                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                            </td>
                            <td className="py-3 px-2">
                                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                            </td>
                            <td className="py-3 px-2">
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </td>
                            <td className="py-3 px-2">
                                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTaskTableSkeleton;