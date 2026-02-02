import React from 'react';
import { X, Truck, CheckCircle } from 'lucide-react';

interface Vehicle {
    vehicleId: string;
    plate_Number: string;
    vehicle_Type: string;
    capacity_Kg: number;
    length_M?: number;
    width_M?: number;
    height_M?: number;
    status: string;
}

interface VehicleSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (selectedVehicleIds: string[]) => void;
    vehicles: Vehicle[];
    loading?: boolean;
    selectedVehicleIds: string[];
    onToggleSelect: (vehicleId: string) => void;
    onToggleSelectAll: () => void;
    loadThreshold: number;
    confirming?: boolean;
}

const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({
    open,
    onClose,
    onConfirm,
    vehicles,
    loading = false,
    selectedVehicleIds,
    onToggleSelect,
    onToggleSelectAll,
    loadThreshold,
    confirming = false
}) => {
    if (!open) return null;

    const allSelected = vehicles.length > 0 && vehicles.every(v => selectedVehicleIds.includes(v.vehicleId));
    const hasSelection = selectedVehicleIds.length > 0;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose}></div>

            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Truck className='text-white' size={20} />
                        </div>
                        <h2 className='text-xl font-bold text-gray-900'>Chọn xe để gom nhóm</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-white/50 rounded-full transition-colors'
                    >
                        <X size={24} className='text-gray-600' />
                    </button>
                </div>

                {/* Summary */}
                <div className='p-6 pb-4 bg-gray-50'>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-600'>Ngưỡng tải:</span>
                            <span className='text-lg font-bold text-primary-600'>{loadThreshold}%</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-600'>Đã chọn:</span>
                            <span className='text-lg font-bold text-gray-900'>
                                {selectedVehicleIds.length}/{vehicles.length} xe
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className='px-6 pb-6'>
                    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
                        <div className='max-h-[400px] overflow-y-auto'>
                            <table className='w-full text-sm'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16'>
                                            <input
                                                type='checkbox'
                                                checked={allSelected}
                                                onChange={onToggleSelectAll}
                                                className='w-4 h-4 text-primary-600 bg-white rounded focus:ring-2 focus:ring-primary-500 cursor-pointer'
                                            />
                                        </th>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left'>Biển số</th>
                                        <th className='py-3 px-4 text-left'>Loại xe</th>
                                        <th className='py-3 px-4 text-right'>Tải trọng (kg)</th>
                                        <th className='py-3 px-4 text-right'>Kích thước (m)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-gray-100'>
                                                <td className='py-3 px-4 text-center'>
                                                    <div className='h-4 w-4 bg-gray-200 rounded animate-pulse mx-auto' />
                                                </td>
                                                <td className='py-3 px-4 text-center'>
                                                    <div className='h-7 w-7 bg-gray-200 rounded-full animate-pulse mx-auto' />
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
                                                </td>
                                                <td className='py-3 px-4 text-right'>
                                                    <div className='h-4 bg-gray-200 rounded w-16 animate-pulse ml-auto' />
                                                </td>
                                                <td className='py-3 px-4 text-right'>
                                                    <div className='h-4 bg-gray-200 rounded w-20 animate-pulse ml-auto' />
                                                </td>
                                            </tr>
                                        ))
                                    ) : vehicles.length > 0 ? (
                                        vehicles.map((vehicle, idx) => {
                                            const isSelected = selectedVehicleIds.includes(vehicle.vehicleId);
                            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                            const dimensions = vehicle.length_M && vehicle.width_M && vehicle.height_M
                                ? `${vehicle.length_M} x ${vehicle.width_M} x ${vehicle.height_M}`
                                : 'N/A';
                                            
                                            return (
                                                <tr
                                                    key={vehicle.vehicleId}
                                                    onClick={() => onToggleSelect(vehicle.vehicleId)}
                                                    className={`${
                                                        idx !== vehicles.length - 1 ? 'border-b border-gray-100' : ''
                                                    } ${rowBg} hover:bg-primary-50/40 transition-colors cursor-pointer`}
                                                >
                                                    <td className='py-3 px-4 text-center w-16'>
                                                        <input
                                                            type='checkbox'
                                                            checked={isSelected}
                                                            onChange={() => onToggleSelect(vehicle.vehicleId)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className='w-4 h-4 text-primary-600 bg-white rounded focus:ring-2 focus:ring-primary-500 cursor-pointer'
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4 text-center w-16'>
                                                        <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='text-gray-900 font-medium'>{vehicle.plate_Number}</div>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='text-gray-700'>{vehicle.vehicle_Type}</div>
                                                    </td>
                                                    <td className='py-3 px-4 text-right'>
                                                        <div className='text-gray-900 font-medium'>
                                                            {vehicle.capacity_Kg.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-right'>
                                                        <div className='text-gray-700'>{dimensions}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-8 text-gray-400'>
                                                Không có xe nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex items-center justify-end gap-3 p-6 border-t bg-gray-50'>
                    <button
                        onClick={() => onConfirm(selectedVehicleIds)}
                        disabled={!hasSelection || confirming}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            hasSelection && !confirming
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {confirming ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Xác nhận ({selectedVehicleIds.length} xe)
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleSelectionModal;
