import React from 'react';
import { VehicleItem } from '@/services/small-collector/VehicleService';
import VehicleShow from './VehicleShow';
import VehicleTableSkeleton from './VehicleTableSkeleton';

interface VehicleListProps {
    vehicles: VehicleItem[];
    loading: boolean;
    onViewDetail: (vehicle: VehicleItem) => void;
    onApprove: (vehicleId: string) => void;
    onBlock: (vehicleId: string) => void;
    actionLoading: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, loading, onViewDetail, onApprove, onBlock, actionLoading }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[56vh] overflow-y-auto w-full'>
                            <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[14vw]'>Biển số xe</th>
                                        <th className='py-3 px-4 text-left w-[16vw]'>Loại xe</th>
                                        <th className='py-3 px-4 text-right w-[12vw]'>Tải trọng (Kg)</th>
                                        <th className='py-3 px-4 text-left w-[14vw]'>Điểm thu gom</th>
                                        <th className='py-3 px-4 text-center w-[10vw]'>Hành động</th>
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
                                                key={vehicle.vehicleId || idx}
                                                vehicle={vehicle}
                                                onView={() => onViewDetail(vehicle)}
                                                onApprove={onApprove}
                                                onBlock={onBlock}
                                                actionLoading={actionLoading}
                                                isLast={idx === vehicles.length - 1}
                                                index={idx}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-8 text-gray-400'>
                                                Không có phương tiện nào.
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

export default VehicleList;
