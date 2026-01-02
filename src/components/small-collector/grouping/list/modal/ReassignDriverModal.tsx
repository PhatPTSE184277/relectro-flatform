'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CompactDatePicker from '@/components/ui/CompactDatePicker';

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
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');

    useEffect(() => {
        if (open && grouping) {
            // Set ngày mặc định là ngày của nhóm hoặc ngày hiện tại nếu không có
            const groupDate = grouping.groupDate ? new Date(grouping.groupDate) : new Date();
            if (!isNaN(groupDate.getTime())) {
                setSelectedDate(groupDate.toISOString().split('T')[0]);
            } else {
                console.error('Invalid groupDate:', grouping.groupDate);
                setSelectedDate(new Date().toISOString().split('T')[0]);
            }
            setSelectedDriverId('');
        }
    }, [open, grouping]);

    useEffect(() => {
        if (open && selectedDate && user?.collectionCompanyId) {
            fetchDriverCandidates(String(user.collectionCompanyId), selectedDate);
        }
    }, [open, selectedDate, user?.collectionCompanyId, fetchDriverCandidates]);

    const handleConfirm = async () => {
        if (!selectedDriverId) {
            return;
        }
        await reassignDriver(grouping.groupId, selectedDriverId);
        handleClose();
    };

    const handleClose = () => {
        setSelectedDate('');
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
            <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
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
                <div className='flex-1 overflow-y-auto p-6 bg-white space-y-6'>
                    {/* Current Driver Info and Date Picker */}
                    <div className='bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between gap-4'>
                        <div className='flex-1'>
                            <h3 className='text-sm font-medium text-gray-700 mb-2'>
                                Tài xế hiện tại
                            </h3>
                            <div className='flex items-center gap-2'>
                                <span className='font-semibold text-gray-900'>
                                    {grouping.collector}
                                </span>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Ngày thu gom
                            </label>
                            <CompactDatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                                placeholder='Chọn ngày thu gom'
                            />
                        </div>
                    </div>

                    {/* Driver List */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-100'>
                        <h3 className='text-sm font-medium text-gray-700 mb-3'>
                            Danh sách tài xế
                        </h3>
                        {reassignLoading ? (
                            <div className='text-center py-8 text-gray-500'>
                                <div className='animate-pulse'>Đang tải danh sách tài xế...</div>
                            </div>
                        ) : (Array.isArray(driverCandidates) ? driverCandidates.length === 0 : true) ? (
                            <div className='text-center py-8 text-gray-400'>
                                Không có tài xế nào
                            </div>
                        ) : (
                            <div className='overflow-x-auto max-h-80'>
                                <table className='w-full text-sm text-gray-800'>
                                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                        <tr>
                                            <th className='py-3 px-4 text-center'>Chọn</th>
                                            <th className='py-3 px-4 text-left'>Tên tài xế</th>
                                            <th className='py-3 px-4 text-left'>Số điện thoại</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {driverCandidates.map((driver) => {
                                            const isSelected = selectedDriverId === driver.userId;
                                            return (
                                                <tr
                                                    key={driver.userId}
                                                    className={`cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-primary-50 border-primary-500' : 'hover:bg-primary-50'
                                                    }`}
                                                    onClick={() => driver.isAvailable && setSelectedDriverId(driver.userId)}
                                                >
                                                    <td className='py-3 px-4 text-center'>
                                                        <input
                                                            type='radio'
                                                            checked={isSelected}
                                                            onChange={() => setSelectedDriverId(driver.userId)}
                                                            className='w-4 h-4 text-primary-600 rounded-full cursor-pointer'
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900'>{driver.name}</td>
                                                    <td className='py-3 px-4 text-gray-700'>{driver.phone || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
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
