'use client';

import React from 'react';
import {
    Truck,
    MapPin,
    Calendar,
    Package,
    User,
    Navigation
} from 'lucide-react';
import SummaryCard, { SummaryCardItem } from '@/components/ui/SummaryCard';

interface Route {
    pickupOrder: number;
    postId: string;
    userName: string;
    address: string;
    weightKg: number;
    volumeM3: number;
    distanceKm: number;
    schedule: string;
    estimatedArrival: string;
    sizeTier?: string;
    categoryName?: string;
    brandName?: string;
}

interface GroupingDetailData {
    groupId: number;
    groupCode: string;
    shiftId: string;
    vehicle: string;
    collector: string;
    groupDate: string;
    collectionPoint: string;
    totalPosts: number;
    totalWeightKg: number;
    totalVolumeM3: number;
    routes: Route[];
}

interface GroupingDetailProps {
    grouping: GroupingDetailData | null;
    onClose: () => void;
}

const GroupingDetail: React.FC<GroupingDetailProps> = ({
    grouping,
    onClose
}) => {
    if (!grouping) return null;
    const routes = grouping.routes ?? [];

    // Generate summary items
    const summaryItems: SummaryCardItem[] = [
        {
            label: 'Ngày thu gom',
            value: new Date(grouping.groupDate).toLocaleDateString('vi-VN'),
            icon: <Calendar size={14} className='text-primary-400' />,
        },
        {
            label: 'Phương tiện',
            value: grouping.vehicle,
            icon: <Truck size={14} className='text-primary-400' />,
        },
        {
            label: 'Người thu gom',
            value: grouping.collector,
            icon: <User size={14} className='text-primary-400' />,
        },
        {
            label: 'Điểm thu gom',
            value: grouping.collectionPoint,
            icon: <MapPin size={14} className='text-primary-400' />,
        },
    ];

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết nhóm thu gom
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            {grouping.groupCode}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Group Info */}
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                            <Package className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin nhóm
                    </h3>
                    <SummaryCard items={summaryItems} />

                    {/* Statistics */}
                    <div className='grid grid-cols-3 gap-4 mb-6'>
                        <div className='bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-blue-700'>
                                Tổng bưu phẩm
                            </span>
                            <span className='text-2xl font-bold text-blue-900'>
                                {grouping.totalPosts}
                            </span>
                        </div>
                        <div className='bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-purple-700'>
                                Tổng khối lượng
                            </span>
                            <span className='text-2xl font-bold text-purple-900'>
                                {grouping.totalWeightKg}{' '}
                                <span className='text-sm font-normal'>kg</span>
                            </span>
                        </div>
                        <div className='bg-green-50 rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-green-700'>
                                Tổng thể tích
                            </span>
                            <span className='text-2xl font-bold text-green-900'>
                                {grouping.totalVolumeM3}{' '}
                                <span className='text-sm font-normal'>m³</span>
                            </span>
                        </div>
                    </div>

                    {/* Routes List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                <Navigation
                                    size={20}
                                    className='text-primary-500'
                                />
                            </span>
                            Lộ trình thu gom ({routes.length} điểm)
                        </h3>
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm text-gray-800'>
                                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                        <tr>
                                            <th className='py-3 px-4 text-left'>
                                                STT
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Người gửi
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Địa chỉ
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Khối lượng
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Khoảng cách
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                <div className='flex justify-center'>
                                                    Giờ đến dự kiến
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route, idx) => {
                                            const isLast = idx === routes.length - 1;
                                            return (
                                                <tr
                                                    key={route.postId}
                                                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors`}
                                                >
                                                    <td className='py-3 px-4 font-medium'>
                                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900'>
                                                        <div>{route.userName}</div>
                                                        <div className='text-xs text-gray-500 mt-1'>
                                                            {route.categoryName} - {route.brandName}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                                        <div className='line-clamp-2'>
                                                            {route.address}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700'>
                                                        <div className='flex flex-col gap-1'>
                                                            <span className='text-xs'>
                                                                <span className='font-medium'>{route.weightKg}</span> kg
                                                            </span>
                                                            <span className='text-xs text-gray-500'>
                                                                {route.volumeM3} m³
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700'>
                                                        <span className='flex items-center gap-1'>
                                                            {route.distanceKm} km
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        {route.estimatedArrival}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupingDetail;
