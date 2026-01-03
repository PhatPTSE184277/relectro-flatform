'use client';

import React, { useState, useEffect } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
import { X } from 'lucide-react';

interface SmallCollectionPoint {
    smallPointId: string;
    name: string;
    address: string;
    recyclingCompany: string | null;
}

interface AssignRecyclingModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: { recyclingCompanyId: string; smallCollectionPointIds: string[] }) => void;
    companies: any[];
    smallPoints: SmallCollectionPoint[];
}

const AssignRecyclingModal: React.FC<AssignRecyclingModalProps> = ({
    open,
    onClose,
    onConfirm,
    companies,
    smallPoints
}) => {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedCompanyId('');
            setSelectedPointIds([]);
        }
    }, [open]);

    const handleTogglePoint = (pointId: string) => {
        if (selectedPointIds.includes(pointId)) {
            setSelectedPointIds(selectedPointIds.filter(id => id !== pointId));
        } else {
            setSelectedPointIds([...selectedPointIds, pointId]);
        }
    };

    const handleToggleAll = () => {
        const unassignedPoints = smallPoints.filter(p => !p.recyclingCompany);
        const allSelected = unassignedPoints.every(p => selectedPointIds.includes(p.smallPointId));
        
        if (allSelected) {
            setSelectedPointIds([]);
        } else {
            setSelectedPointIds(unassignedPoints.map(p => p.smallPointId));
        }
    };

    const handleConfirm = async () => {
        if (!selectedCompanyId) {
            return;
        }
        if (selectedPointIds.length === 0) {
            return;
        }

        setLoading(true);
        try {
            await onConfirm({
                recyclingCompanyId: selectedCompanyId,
                smallCollectionPointIds: selectedPointIds
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedCompanyId('');
        setSelectedPointIds([]);
        onClose();
    };

    if (!open) return null;

    const unassignedPoints = smallPoints.filter(p => !p.recyclingCompany);
    const allSelected = unassignedPoints.length > 0 && unassignedPoints.every(p => selectedPointIds.includes(p.smallPointId));

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Phân công điểm thu gom</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                    {/* Company Selection */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Công ty tái chế <span className='text-red-500'>*</span>
                        </label>
                        <CustomSelect
                            options={companies}
                            value={selectedCompanyId}
                            onChange={setSelectedCompanyId}
                            getLabel={(company) => company.companyName}
                            getValue={(company) => company.companyId}
                            placeholder='-- Chọn công ty tái chế --'
                        />
                    </div>

                    {/* Small Collection Points */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Điểm thu gom nhỏ <span className='text-red-500'>*</span>
                        </label>
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100 max-h-96 overflow-y-auto'>
                            <table className='w-full text-sm text-gray-800'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-left'>
                                            <input
                                                type='checkbox'
                                                checked={allSelected}
                                                onChange={handleToggleAll}
                                                className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                                aria-label='Chọn/Bỏ chọn tất cả'
                                            />
                                        </th>
                                        <th className='py-3 px-4 text-left'>Tên điểm</th>
                                        <th className='py-3 px-4 text-left'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-left'>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {smallPoints.length > 0 ? (
                                        smallPoints.map((point, index) => {
                                            const isSelected = selectedPointIds.includes(point.smallPointId);
                                            const isAssigned = !!point.recyclingCompany;
                                            const isLast = index === smallPoints.length - 1;
                                            
                                            return (
                                                <tr
                                                    key={point.smallPointId + '-' + index}
                                                    className={`${!isLast ? 'border-b border-gray-100' : ''} ${
                                                        isAssigned ? 'bg-gray-50' : 'hover:bg-primary-50/40'
                                                    } transition-colors`}
                                                >
                                                    <td className='py-3 px-4'>
                                                        <input
                                                            type='checkbox'
                                                            checked={isSelected}
                                                            onChange={() => !isAssigned && handleTogglePoint(point.smallPointId)}
                                                            disabled={isAssigned}
                                                            className={`w-4 h-4 text-primary-600 rounded ${
                                                                isAssigned ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
                                                            }`}
                                                        />
                                                    </td>
                                                    <td className={`py-3 px-4 ${isAssigned ? 'text-gray-400' : 'text-gray-900'}`}>
                                                        {point.name}
                                                    </td>
                                                    <td className={`py-3 px-4 ${isAssigned ? 'text-gray-400' : 'text-gray-700'}`}>
                                                        {point.address}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        {isAssigned ? (
                                                            <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                                                                Đã phân công
                                                            </span>
                                                        ) : (
                                                            <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                                                                Chưa phân công
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Không có điểm thu gom nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                            Đã chọn: {selectedPointIds.length} điểm thu gom
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !selectedCompanyId || selectedPointIds.length === 0}
                        className='px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignRecyclingModal;
