import React from 'react';

interface SmallCollectionPoint {
    smallPointId: string;
    name: string;
    address: string;
    recyclingCompany: string | null;
}

const getPointId = (point: any): string => {
    const rawId = point?.smallPointId ?? point?.id ?? point?.smallCollectionPointId;
    return rawId != null ? String(rawId) : '';
};

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
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[42vh] overflow-y-auto w-full'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-[8vw]'>STT</th>
                                        <th key="name" className='py-3 px-4 text-left w-[14vw]'>Tên điểm</th>
                                        <th key="address" className='py-3 px-4 text-left w-[24vw]'>Địa chỉ</th>
                                        <th key="status" className='py-3 px-4 text-left w-[20vw]'>Công ty tái chế</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-primary-100'>
                                                <td className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded w-10 animate-pulse' />
                                                </td>
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
                                            <tr key={getPointId(point) || `point-${index}`} className='odd:bg-white even:bg-primary-50'>
                                                <td className='py-3 px-4'>
                                                    <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold px-2'>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 font-medium text-gray-900'>{point.name}</td>
                                                <td className='py-3 px-4 text-gray-700'>{point.address}</td>
                                                <td className='py-3 px-4'>
                                                    {(() => {
                                                        const pid = getPointId(point);
                                                        const assignedId = pointRecyclingAssignments[pid];
                                                        const resolvedCompanyLabel = (() => {
                                                            if (typeof point.recyclingCompany === 'object' && point.recyclingCompany !== null) {
                                                                return point.recyclingCompany.name || point.recyclingCompany.companyName || point.recyclingCompany.companyId || '';
                                                            }
                                                            const found = recyclingCompanies.find(c => (c.companyId || c.id) === point.recyclingCompany);
                                                            if (found) return found.name || found.companyName || String(point.recyclingCompany);
                                                            if (typeof point.recyclingCompany === 'string') return point.recyclingCompany;
                                                            return '';
                                                        })();

                                                        if (point.recyclingCompany) {
                                                            if (isAssignMode) {
                                                                // Create mode: already assigned points cannot be changed here.
                                                                return (
                                                                    <span className='px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium cursor-not-allowed'>
                                                                        {resolvedCompanyLabel}
                                                                    </span>
                                                                );
                                                            }

                                                            return (
                                                                <button
                                                                    onClick={() => onSelectCompany(pid)}
                                                                    className='px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 hover:bg-green-200 font-medium transition cursor-pointer'
                                                                >
                                                                    {resolvedCompanyLabel}
                                                                </button>
                                                            );
                                                        }

                                                        if (assignedId) {
                                                            return (
                                                                <button
                                                                    className='px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium cursor-pointer hover:bg-blue-200 transition'
                                                                    onClick={() => onSelectCompany(pid)}
                                                                >
                                                                    {recyclingCompanies.find(c => (c.companyId || c.id) === assignedId)?.name ||
                                                                        recyclingCompanies.find(c => (c.companyId || c.id) === assignedId)?.companyName ||
                                                                        'Công ty tái chế'}
                                                                </button>
                                                            );
                                                        }

                                                        return (
                                                            <button
                                                                onClick={() => onSelectCompany(pid)}
                                                                className='px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-700 hover:bg-primary-200 font-medium transition cursor-pointer'
                                                            >
                                                                Phân công
                                                            </button>
                                                        );
                                                    })()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Không có điểm thu gom nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignRecyclingPointList;
