import React from 'react';

interface SmallPoint {
    pointId: string;
    pointName: string;
    totalOrders: number;
}

interface SmallPointListProps {
    points: SmallPoint[];
    loading?: boolean;
    onSelectPoint?: (point: SmallPoint) => void;
}

const SmallPointList: React.FC<SmallPointListProps> = ({
    points,
    loading = false,
    onSelectPoint
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[56vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[48vh] xl:max-h-[56vh] overflow-y-auto w-full'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[18vw]'>Điểm thu gom</th>
                                        <th className='py-3 pr-4 text-right w-auto'>Tổng sản phẩm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-gray-100'>
                                                <td className='py-3 px-4 text-center'>
                                                    <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                                                </td>
                                                <td className='py-3 pr-4 text-right'>
                                                    <div className='h-6 bg-gray-200 rounded w-10 animate-pulse ml-auto' />
                                                </td>
                                            </tr>
                                        ))
                                    ) : points.length > 0 ? (
                                        points.map((point, idx) => {
                                            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                            return (
                                            <tr
                                                key={point.pointId}
                                                onClick={() => onSelectPoint?.(point)}
                                                className={`${
                                                    idx !== points.length - 1 ? 'border-b border-primary-100' : ''
                                                } ${rowBg} ${
                                                    onSelectPoint ? 'cursor-pointer' : ''
                                                }`}
                                            >
                                                <td className='py-3 px-4 text-center w-[6vw]'>
                                                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 w-[18vw]'>
                                                    <div className='text-gray-900 font-medium'>
                                                        {point.pointName || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className='py-3 pr-4 text-right w-auto'>
                                                    <div className='text-gray-900 font-medium'>
                                                        {point.totalOrders ?? 0}
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className='text-center py-8 text-gray-400'>
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

export default SmallPointList;
