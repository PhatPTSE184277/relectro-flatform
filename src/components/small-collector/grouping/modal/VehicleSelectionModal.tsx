import React from 'react';
import { X, Truck, Loader2 } from 'lucide-react';

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
    requiredSelectionCount?: number;
    lockSelection?: boolean;
    lockSelectionMessage?: string;
    suggestedPlateNumbers?: string[];
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
    confirming = false,
    requiredSelectionCount,
    lockSelection = false,
    lockSelectionMessage,
    suggestedPlateNumbers = []
}) => {
    if (!open) return null;

    const normalizedSelectedIds = selectedVehicleIds.map((id) => String(id));
    const normalizePlate = (plate?: string) => String(plate || '').trim().toUpperCase();
    const suggestedPlateSet = new Set(suggestedPlateNumbers.map((p) => normalizePlate(p)).filter(Boolean));
    const allSelected =
        vehicles.length > 0 &&
        vehicles.every((v) => normalizedSelectedIds.includes(String(v.vehicleId)));
    const hasSelection = selectedVehicleIds.length > 0;
    const hasRequiredSelectionCount =
        typeof requiredSelectionCount === 'number' && requiredSelectionCount > 0;
    // When a required selection count is provided, require exactly that many selections.
    const meetsRequiredSelection = hasRequiredSelectionCount
        ? selectedVehicleIds.length === requiredSelectionCount
        : hasSelection;
    const confirmDisabled = confirming || !meetsRequiredSelection;

    const handleToggleVehicle = (vehicleId: string) => {
        const normalizedVehicleId = String(vehicleId);

        const isSelected = normalizedSelectedIds.includes(normalizedVehicleId);

        // If not currently selected and we already reached the required selection count, block adding more.
        if (!isSelected && hasRequiredSelectionCount && selectedVehicleIds.length >= (requiredSelectionCount || 0)) {
            return;
        }

        onToggleSelect(normalizedVehicleId);
    };

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
                        <h2 className='text-2xl font-bold text-gray-900'>Chọn xe để phân chia</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Summary */}
                <div className='p-6 pb-4 bg-gray-50'>
                    <div className='flex items-center gap-4 flex-wrap'>
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
                        {hasRequiredSelectionCount && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-600'>Cần chọn:</span>
                                <span className='text-lg font-bold text-primary-600'>{requiredSelectionCount} xe</span>
                            </div>
                        )}
                    </div>
                    {lockSelectionMessage && (
                        <p className='text-xs text-primary-700 mt-2'>{lockSelectionMessage}</p>
                    )}
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
                                                disabled={lockSelection || hasRequiredSelectionCount}
                                                className={`w-4 h-4 accent-primary-600 ${
                                                    (lockSelection || hasRequiredSelectionCount)
                                                        ? 'cursor-not-allowed opacity-60'
                                                        : 'cursor-pointer'
                                                }`}
                                            />
                                        </th>
                                        <th className='py-3 px-4 text-center w-16'>STT</th>
                                        <th className='py-3 px-4 text-left'>Biển số</th>
                                        <th className='py-3 px-4 text-left'>Loại xe</th>
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
                                            </tr>
                                        ))
                                    ) : vehicles.length > 0 ? (
                                        vehicles.map((vehicle, idx) => {
                                            const normalizedVehicleId = String(vehicle.vehicleId);
                                            const isSelected = normalizedSelectedIds.includes(normalizedVehicleId);
                                            const isSuggested = suggestedPlateSet.has(normalizePlate(vehicle.plate_Number));
                                            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                            
                                                return (
                                                <tr
                                                    key={normalizedVehicleId}
                                                    onClick={() => {
                                                        if (!lockSelection) {
                                                            // Prevent adding more than required when clicking the row
                                                            const isSelected = normalizedSelectedIds.includes(normalizedVehicleId);
                                                            if (!isSelected && hasRequiredSelectionCount && selectedVehicleIds.length >= (requiredSelectionCount || 0)) {
                                                                return;
                                                            }
                                                            handleToggleVehicle(normalizedVehicleId);
                                                        }
                                                    }}
                                                    className={`${
                                                        idx !== vehicles.length - 1 ? 'border-b border-gray-100' : ''
                                                    } ${rowBg} ${lockSelection ? 'cursor-not-allowed' : ''}`}>
                                                    <td className='py-3 px-4 text-center w-16'>
                                                        <input
                                                            type='checkbox'
                                                            checked={isSelected}
                                                            onChange={() => handleToggleVehicle(normalizedVehicleId)}
                                                            disabled={lockSelection || (!isSelected && hasRequiredSelectionCount && selectedVehicleIds.length >= (requiredSelectionCount || 0))}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className={`w-4 h-4 accent-primary-600 ${
                                                                (lockSelection || (!isSelected && hasRequiredSelectionCount && selectedVehicleIds.length >= (requiredSelectionCount || 0)))
                                                                    ? 'cursor-not-allowed opacity-60'
                                                                    : 'cursor-pointer'
                                                            }`}
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4 text-center w-16'>
                                                        <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='text-gray-900 font-medium'>{vehicle.plate_Number}</div>
                                                            {isSuggested && (
                                                                <span className='text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 border border-primary-200'>
                                                                    Gợi ý
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='text-gray-700'>{vehicle.vehicle_Type}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
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
                <div className='p-5 border-t border-primary-100 bg-white flex justify-end gap-3'>
                    <button
                        onClick={() => onConfirm(normalizedSelectedIds)}
                        disabled={confirmDisabled}
                        className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                            !confirmDisabled
                                ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {confirming ? (
                            <>
                                <Loader2 className='animate-spin' size={16} />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                Xác nhận
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleSelectionModal;
