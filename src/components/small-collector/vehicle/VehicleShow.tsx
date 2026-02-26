import React from 'react';
import { Eye, CheckCircle, Ban } from 'lucide-react';
import { VehicleItem } from '@/services/small-collector/VehicleService';

interface VehicleShowProps {
    vehicle: VehicleItem;
    onView: () => void;
    onApprove: (vehicleId: string) => void;
    onBlock: (vehicleId: string) => void;
    actionLoading: boolean;
    isLast?: boolean;
    index?: number;
}

const VehicleShow: React.FC<VehicleShowProps> = ({ vehicle, onView, onApprove, onBlock, actionLoading, isLast, index }) => {
    const stt = (index ?? 0) + 1;
    const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    const isActive = vehicle.status === 'Đang hoạt động';
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            <td className='py-3 px-4 text-center w-[6vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 w-[14vw]'>
                <div className='text-gray-900 font-medium'>
                    {vehicle.plateNumber || 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-[16vw]'>
                {vehicle.vehicleType || <span className='text-gray-400'>Chưa có</span>}
            </td>
            <td className='py-3 px-4 text-right text-gray-700 w-[12vw]'>
                {vehicle.capacityKg ? `${vehicle.capacityKg}` : <span className='text-gray-400'>Chưa có</span>}
            </td>
            <td className='py-3 px-4 text-gray-700 w-[14vw]'>
                {vehicle.smallCollectionPointName || <span className='text-gray-400'>Chưa có</span>}
            </td>
            <td className='py-3 px-4 w-[10vw]'>
                <div className='flex justify-center items-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                    {isActive ? (
                        <button
                            onClick={() => vehicle.vehicleId && onBlock(vehicle.vehicleId)}
                            disabled={actionLoading}
                            className='text-red-500 hover:text-red-700 disabled:opacity-40 transition cursor-pointer'
                            title='Khóa'
                        >
                            <Ban size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => vehicle.vehicleId && onApprove(vehicle.vehicleId)}
                            disabled={actionLoading}
                            className='text-green-500 hover:text-green-700 disabled:opacity-40 transition cursor-pointer'
                            title='Duyệt'
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default VehicleShow;
