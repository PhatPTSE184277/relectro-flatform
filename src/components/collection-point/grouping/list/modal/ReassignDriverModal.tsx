'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGroupingContext } from '@/contexts/collection-point/GroupingContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SummaryCard from '@/components/ui/SummaryCard';
import SearchBox from '@/components/ui/SearchBox';
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
    const [search, setSearch] = useState('');

    const filteredDrivers = useMemo(() => {
        const normalizedDrivers = Array.isArray(driverCandidates) ? driverCandidates : [];
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            return normalizedDrivers;
        }

        return normalizedDrivers.filter((driver: any) => {
            const name = String(driver?.name || '').toLowerCase();
            const phone = String(driver?.phone || '').toLowerCase();
            const shift = String(driver?.shiftTime || '').toLowerCase();
            return name.includes(keyword) || phone.includes(keyword) || shift.includes(keyword);
        });
    }, [driverCandidates, search]);

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
        setSearch('');
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
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100 rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                                Phân lại tài xế
                            </h2>
                            <p className='text-sm text-gray-600 mt-1'>
                                Phân chia: {grouping.groupCode}
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
                                label: 'Ngày phân chia',
                                value: grouping.groupDate ? formatDate(grouping.groupDate) : '',
                                icon: undefined,
                            },
                        ]}
                        singleRow={true}
                    />

                    {/* Driver List */}
                    <div className='bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden'>
                        <div className='p-4 bg-gray-50 border-b border-primary-100'>
                            <SearchBox
                                value={search}
                                onChange={setSearch}
                                placeholder='Tìm kiếm tài xế...'
                            />
                        </div>

                        <div className='overflow-x-auto max-h-65 overflow-y-auto'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-16'></th>
                                        <th className='py-3 px-4 text-left w-48'>Tên tài xế</th>
                                        <th className='py-3 px-4 text-left w-40'>Số điện thoại</th>
                                        <th className='py-3 px-4 text-left w-36'>Ca làm</th>
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
                                    ) : filteredDrivers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Không có tài xế nào
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDrivers.map((driver: any) => {
                                            const isSelected = selectedDriverId === driver.userId;
                                            const selectable = Boolean(driver.isAvailable);
                                            return (
                                                <tr
                                                    key={driver.userId}
                                                    className={`odd:bg-white even:bg-primary-50 ${
                                                        selectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                                                    }`}
                                                    onClick={() => selectable && setSelectedDriverId(driver.userId)}
                                                >
                                                    <td className='py-3 px-4 text-center w-16'>
                                                        <input
                                                            type='radio'
                                                            name='reassign-driver'
                                                            checked={isSelected}
                                                            onChange={() => setSelectedDriverId(driver.userId)}
                                                            disabled={!selectable}
                                                            className='accent-primary-600 w-4 h-4 rounded-full cursor-pointer disabled:cursor-not-allowed'
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
