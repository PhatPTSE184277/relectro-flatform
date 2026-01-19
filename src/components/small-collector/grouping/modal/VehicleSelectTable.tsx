    import React from 'react';

interface VehicleSelectTableProps {
    vehicles: any[];
    selectedVehicleId: string | null;
    setSelectedVehicleId: (id: string) => void;
}

const VehicleSelectTable: React.FC<VehicleSelectTableProps> = ({ vehicles, selectedVehicleId, setSelectedVehicleId }) => {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full text-sm text-gray-800'>
                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                    <tr>
                        <th className='py-3 px-4 text-center'></th>
                        <th className='py-3 px-4 text-left'>Loại xe</th>
                        <th className='py-3 px-4 text-left'>Biển số</th>
                        <th className='py-3 pl-4 pr-16 text-right'>Tải trọng (kg)</th>
                        <th className='py-3 pl-4 pr-16 text-right'>Thể tích (m³)</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => {
                        const isSelected = selectedVehicleId === vehicle.vehicleId;
                        return (
                            <tr
                                key={vehicle.vehicleId}
                                className={`cursor-pointer transition-colors ${
                                    isSelected ? 'bg-primary-50 border-primary-500' : 'hover:bg-primary-50'
                                }`}
                                onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                            >
                                <td className='py-3 px-4 text-center'>
                                    <input
                                        type='radio'
                                        checked={isSelected}
                                        onChange={() => setSelectedVehicleId(vehicle.vehicleId)}
                                        className='w-4 h-4 text-primary-600 rounded-full cursor-pointer'
                                        onClick={e => e.stopPropagation()}
                                    />
                                </td>
                                <td className='py-3 px-4 font-medium text-gray-900'>{vehicle.vehicle_Type}</td>
                                <td className='py-3 px-4 text-gray-700'>{vehicle.plate_Number}</td>
                                <td className='py-3 pl-4 pr-16 text-gray-700 text-right'>
                                    <span className='font-medium'>{vehicle.capacity_Kg || 0}</span>
                                </td>
                                <td className='py-3 pl-4 pr-16 text-gray-700 text-right'>
                                    <span className='font-medium'>{vehicle.capacity_M3 || 0}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleSelectTable;
