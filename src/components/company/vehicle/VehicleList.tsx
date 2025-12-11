import React from 'react';
import VehicleShow from './VehicleShow';
import VehicleTableSkeleton from './VehicleTableSkeleton';

interface VehicleListProps {
    vehicles: any[];
    loading: boolean;
    onViewDetail: (vehicle: any) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({
    vehicles,
    loading,
    onViewDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Biển số xe</th>
                            <th className='py-3 px-4 text-left'>Loại xe</th>
                            <th className='py-3 px-4 text-left'>Điểm thu gom</th>
                            <th className='py-3 px-4 text-left'>Tải trọng</th>
                            <th className='py-3 px-4 text-left'>Bán kính</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <VehicleTableSkeleton key={idx} />
                            ))
                        ) : vehicles.length > 0 ? (
                            vehicles.map((vehicle, idx) => (
                                <VehicleShow
                                    key={vehicle.vehicleId}
                                    vehicle={vehicle}
                                    onView={() => onViewDetail(vehicle)}
                                    isLast={idx === vehicles.length - 1}
                                    index={idx}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='text-center py-8 text-gray-400'>
                                    Không có phương tiện nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehicleList;
