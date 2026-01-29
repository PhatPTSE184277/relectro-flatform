import React from 'react';
import { Eye } from 'lucide-react';

interface VehicleShowProps {
    vehicle: any;
    onView: () => void;
    isLast?: boolean;
    index?: number;
}

const VehicleShow: React.FC<VehicleShowProps> = ({
    vehicle,
    onView,
    index
}) => {
    return (
        <tr
            className={`$
                !isLast ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/40 transition-colors`}
        >
            <td className='py-3 px-4 text-center w-[6vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 w-[13vw]'>
                <div className='text-gray-900 font-medium'>
                    {vehicle.plateNumber || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700 w-[15vw]'>
                {vehicle.vehicleType || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-gray-700 w-[13vw]'>
                {vehicle.smallCollectionPointName || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-right text-gray-700 w-[12vw]'>
                {vehicle.capacityKg ? `${vehicle.capacityKg}` : (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            {/* Bỏ cột Bán kính */}

            <td className='py-3 px-4 w-[7vw]'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default VehicleShow;
