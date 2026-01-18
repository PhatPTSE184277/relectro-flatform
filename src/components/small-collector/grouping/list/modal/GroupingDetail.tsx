"use client";
import { formatDimensionText, formatWeightKg } from "@/utils/formatNumber";
import React from 'react';
import {
    Truck,
    MapPin,
    Calendar,
    User,
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
    dimensionText?: string;
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
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-[90vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh] min-h-[80vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết nhóm thu gom
                        </h2>

                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                    >
                        &times;
                    </button>
                </div>  

                {/* Main content */}
                <div className='flex-1 p-6'>
                    {/* Group Info */}
                    <SummaryCard label="Thông tin nhóm" items={summaryItems} />

                    {/* Statistics */}
                    <div className='grid grid-cols-2 gap-4 mb-6'>
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
                                Tổng khối lượng (kg)
                            </span>
                            <span className='text-2xl font-bold text-purple-900'>
                                {formatWeightKg(grouping.totalWeightKg)}
                            </span>
                        </div>
                    </div>

                    {/* Routes List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='overflow-x-auto max-h-[40vh] overflow-y-auto'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-56'>Người gửi</th>
                                        <th className='py-3 px-4 text-left'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-right w-64'>Khối lượng / Kích thước (kg, cm)</th>
                                        <th className='py-3 px-4 text-right w-42'>Khoảng cách (km)</th>
                                        <th className='py-3 px-4 text-center w-42'>Giờ đến dự kiến</th>
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
                                                <td className='py-3 px-4 font-medium w-16'>
                                                    <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 font-medium text-gray-900 w-56'>
                                                    <div className='wrap-break-word'>{route.userName}</div>
                                                    <div className='text-xs text-gray-500 mt-1 wrap-break-word'>
                                                        {route.categoryName} - {route.brandName}
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <div className='wrap-break-word'>
                                                        {route.address}
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700 text-right w-64'>
                                                    <div className='flex flex-col gap-1 items-end'>
                                                        <span className='text-xs'>
                                                            <span className='font-medium'>{formatWeightKg(route.weightKg)}</span>
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {formatDimensionText(route.dimensionText)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700 text-right w-42'>
                                                    <span className='flex items-center gap-1 justify-end'>
                                                        {route.distanceKm}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 text-center w-42'>
                                                    <span className='flex items-center justify-center'>
                                                        {route.estimatedArrival}
                                                    </span>
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
    );
};

export default GroupingDetail;
