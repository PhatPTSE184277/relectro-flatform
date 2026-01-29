'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatDate } from '@/utils/FormatDate';

interface ReassignDriverModalProps {
    open: boolean;
    grouping: any;
    onClose: () => void;
}

const ReassignDriverModal: React.FC<ReassignDriverModalProps> = ({
    open,
    grouping,
    onClose
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { driverCandidates, reassignLoading, fetchDriverCandidates, reassignDriver } = useGroupingContext();
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');

    // Removed setSelectedDriverId from useEffect to avoid cascading renders

    useEffect(() => {
        if (open && grouping?.groupDate && user?.collectionCompanyId) {
            const groupDate = new Date(grouping.groupDate);
            if (!isNaN(groupDate.getTime())) {
                fetchDriverCandidates(groupDate.toISOString().split('T')[0]);
            }
        }
    }, [open, grouping?.groupDate, user?.collectionCompanyId, fetchDriverCandidates]);

    const handleConfirm = async () => {
        if (!selectedDriverId) {
            return;
        }
        await reassignDriver(grouping.groupId, selectedDriverId);
        handleClose();
    };

    const handleClose = () => {
        setSelectedDriverId('');
        onClose();
    };

    if (!open || !grouping) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col z-10 max-h-[98vh] animate-fadeIn' style={{ overflow: 'visible' }}>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Phân lại tài xế
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Nhóm: {grouping.groupCode}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 p-6 bg-white space-y-6' style={{ overflow: 'visible' }}>
                    {/* SummaryCard for current driver and date */}
                    <SummaryCard
                        items={[
                            {
                                label: 'Tài xế hiện tại',
                                value: grouping.collector,
                                icon: undefined,
                            },
                            {
                                label: 'Ngày thu gom',
                                value: grouping.groupDate ? formatDate(grouping.groupDate) : '',
                                icon: undefined,
                            },
                        ]}
                        singleRow={true}
                    />

                    {/* Driver List */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-100'>
                        <h3 className='text-sm font-medium text-gray-700 mb-3'>
                            Danh sách tài xế
                        </h3>
                        <div className='overflow-x-auto max-h-80 overflow-y-auto'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-center w-16 bg-gray-50'>Chọn</th>
                                        <th className='py-3 px-4 text-left w-48 bg-gray-50'>Tên tài xế</th>
                                        <th className='py-3 px-4 text-left w-40 bg-gray-50'>Số điện thoại</th>
                                        <th className='py-3 px-4 text-left w-36 bg-gray-50'>Ca làm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reassignLoading ? (
                                        Array.from({ length: 4 }).map((_, idx) => (
                                            <tr key={idx}>
                                                <td className='py-3 px-4 text-center w-16'>
                                                    <div className='w-4 h-4 rounded-full bg-gray-200 animate-pulse mx-auto'></div>
                                                </td>
                                                <td className='py-3 px-4 w-48'>
                                                    <div className='h-4 w-24 bg-gray-200 rounded animate-pulse mb-2'></div>
                                                    <div className='h-3 w-16 bg-gray-100 rounded animate-pulse'></div>
                                                </td>
                                                <td className='py-3 px-4 w-40'>
                                                    <div className='h-4 w-20 bg-gray-200 rounded animate-pulse'></div>
                                                </td>
                                                <td className='py-3 px-4 w-36'></td>
                                            </tr>
                                        ))
                                    ) : (Array.isArray(driverCandidates) ? driverCandidates.length === 0 : true) ? (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Không có tài xế nào
                                            </td>
                                        </tr>
                                    ) : (
                                        driverCandidates.map((driver: any) => {
                                            const isSelected = selectedDriverId === driver.userId;
                                            return (
                                                <tr
                                                    key={driver.userId}
                                                    className={`cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-primary-50 border-primary-500' : 'hover:bg-primary-50'
                                                    }`}
                                                    onClick={() => driver.isAvailable && setSelectedDriverId(driver.userId)}
                                                >
                                                    <td className='py-3 px-4 text-center w-16'>
                                                        <input
                                                            type='radio'
                                                            checked={isSelected}
                                                            onChange={() => setSelectedDriverId(driver.userId)}
                                                            className='w-4 h-4 text-primary-600 rounded-full cursor-pointer'
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900 w-48'>{driver.name}</td>
                                                    <td className='py-3 px-4 text-gray-700 w-40'>{driver.phone || '-'}</td>
                                                    <td className='py-3 px-4 text-gray-700 w-36'>{driver.shiftTime || '-'}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white rounded-b-2xl'>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDriverId || reassignLoading}
                        className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                        {reassignLoading ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Đang xử lý...
                            </>
                        ) : (
                            'Cập nhật'
                        )}
                    </button>
                </div>
            </div>

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ReassignDriverModal;
