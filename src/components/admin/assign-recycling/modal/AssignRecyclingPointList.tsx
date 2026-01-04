import React from 'react';

interface SmallCollectionPoint {
    smallPointId: string;
    name: string;
    address: string;
    recyclingCompany: string | null;
}

interface AssignRecyclingPointListProps {
    points: SmallCollectionPoint[];
    loading: boolean;
    onSelectCompany: (pointId: string) => void;
    pointRecyclingAssignments: Record<string, string>;
    recyclingCompanies: any[];
}

const AssignRecyclingPointList: React.FC<AssignRecyclingPointListProps & { isAssignMode?: boolean }> = ({
    points,
    loading,
    onSelectCompany,
    pointRecyclingAssignments,
    recyclingCompanies,
    isAssignMode = false
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 max-h-96 overflow-y-auto'>
            <table className='w-full text-sm text-gray-800'>
                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                    <tr>
                        <th className='py-3 px-4 text-left'>STT</th>
                        <th key="name" className='py-3 px-4 text-left'>Tên điểm</th>
                        <th key="address" className='py-3 px-4 text-left'>Địa chỉ</th>
                        <th key="status" className='py-3 px-4 text-left'>Công ty tái chế</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <tr key={idx} className='border-b border-gray-100'>
                                <td className='py-3 px-4'>
                                    <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
                                </td>
                                <td className='py-3 px-4'>
                                    <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                                </td>
                                <td className='py-3 px-4'>
                                    <div className='h-6 w-24 bg-gray-200 rounded-full animate-pulse' />
                                </td>
                            </tr>
                        ))
                    ) : points.length > 0 ? (
                        points.map((point: any, index: number) => (
                            <tr key={point.smallPointId}>
                                <td className='py-3 px-4'>
                                    <span className='w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-semibold'>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className='py-3 px-4'>{point.name}</td>
                                <td className='py-3 px-4'>{point.address}</td>
                                    <td className='py-3 px-4'>
                                        {point.recyclingCompany ? (
                                            isAssignMode ? (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium ${pointRecyclingAssignments[point.smallPointId] ? 'bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition' : ''}`}
                                                    onClick={pointRecyclingAssignments[point.smallPointId] ? () => onSelectCompany(point.smallPointId) : undefined}
                                                >
                                                    {pointRecyclingAssignments[point.smallPointId]
                                                        ? (recyclingCompanies.find(c => (c.companyId || c.id) === pointRecyclingAssignments[point.smallPointId])?.name ||
                                                           recyclingCompanies.find(c => (c.companyId || c.id) === pointRecyclingAssignments[point.smallPointId])?.companyName ||
                                                           'Công ty tái chế')
                                                        : (() => {
                                                            if (typeof point.recyclingCompany === 'object' && point.recyclingCompany !== null) {
                                                                return point.recyclingCompany.name || point.recyclingCompany.companyName || point.recyclingCompany.companyId || '';
                                                            }
                                                            const found = recyclingCompanies.find(c => (c.companyId || c.id) === point.recyclingCompany);
                                                            if (found) return found.name || found.companyName || String(point.recyclingCompany);
                                                            if (typeof point.recyclingCompany === 'string') return point.recyclingCompany;
                                                            return '';
                                                        })()
                                                    }
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => onSelectCompany(point.smallPointId)}
                                                    className='px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 hover:bg-green-200 font-medium transition cursor-pointer'
                                                >
                                                    {
                                                        (() => {
                                                            if (typeof point.recyclingCompany === 'object' && point.recyclingCompany !== null) {
                                                                return point.recyclingCompany.name || point.recyclingCompany.companyName || point.recyclingCompany.companyId || '';
                                                            }
                                                            const found = recyclingCompanies.find(c => (c.companyId || c.id) === point.recyclingCompany);
                                                            if (found) return found.name || found.companyName || String(point.recyclingCompany);
                                                            if (typeof point.recyclingCompany === 'string') return point.recyclingCompany;
                                                            return '';
                                                        })()
                                                    }
                                                </button>
                                            )
                                        ) : pointRecyclingAssignments[point.smallPointId] ? (
                                            <div className='flex items-center gap-2'>
                                                <span
                                                    className='px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium cursor-pointer hover:bg-blue-200 transition'
                                                    onClick={() => onSelectCompany(point.smallPointId)}
                                                >
                                                    {recyclingCompanies.find(c => (c.companyId || c.id) === pointRecyclingAssignments[point.smallPointId])?.name || 
                                                     recyclingCompanies.find(c => (c.companyId || c.id) === pointRecyclingAssignments[point.smallPointId])?.companyName || 
                                                     'Công ty tái chế'}
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onSelectCompany(point.smallPointId)}
                                                className='px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-700 hover:bg-primary-200 font-medium transition cursor-pointer'
                                            >
                                                Phân công
                                            </button>
                                        )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className='text-center py-6 text-gray-400'>
                                Không có điểm thu gom nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AssignRecyclingPointList;
