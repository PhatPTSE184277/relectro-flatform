import React from 'react';
import { X } from 'lucide-react';

interface VehicleQuickSelectModalProps {
    open: boolean;
    onClose: () => void;
    vehicles: any[];
    selectedVehicleIndex: number;
    onSelectVehicle: (index: number) => void;
}

const VehicleQuickSelectModal: React.FC<VehicleQuickSelectModalProps> = ({
    open,
    onClose,
    vehicles,
    selectedVehicleIndex,
    onSelectVehicle
}) => {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' onClick={onClose} />
            <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <h3 className='text-lg font-bold text-gray-900'>Chọn xe ({vehicles.length})</h3>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className='p-5 max-h-[60vh] overflow-y-auto'>
                    <div className='flex flex-wrap gap-2'>
                        {vehicles.map((vehicleData: any, index: number) => {
                            const plateNumber =
                                vehicleData.plateNumber ||
                                vehicleData.plate_Number ||
                                vehicleData.vehicleName ||
                                'N/A';

                            return (
                                <button
                                    key={`${vehicleData.vehicleId || vehicleData.id}-${index}-all`}
                                    onClick={() => onSelectVehicle(index)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                        selectedVehicleIndex === index
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                                    }`}
                                >
                                    {plateNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleQuickSelectModal;