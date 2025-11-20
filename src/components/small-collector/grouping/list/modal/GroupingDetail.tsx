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

interface Route {
    pickupOrder: number;
    postId: string;
    userName: string;
    address: string;
    length: number;
    width: number;
    height: number;
    dimensionText: string;
    weightKg: number;
    volumeM3: number;
    distanceKm: number;
    schedule: string;
    estimatedArrival: string;
    sizeTier?: string;
}

interface GroupingDetailData {
    groupId: number;
    groupCode: string;
    shiftId: number;
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
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
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
                    <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <Package size={20} className='text-blue-600' />
                            Thông tin nhóm
                        </h3>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            <div className='flex flex-col bg-white rounded-lg p-3 shadow-sm'>
                                <span className='text-sm text-gray-500 mb-1 flex items-center gap-1'>
                                    <Calendar size={14} />
                                    Ngày thu gom
                                </span>
                                <span className='text-base font-semibold text-gray-900'>
                                    {new Date(
                                        grouping.groupDate
                                    ).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div className='flex flex-col bg-white rounded-lg p-3 shadow-sm'>
                                <span className='text-sm text-gray-500 mb-1 flex items-center gap-1'>
                                    <Truck size={14} />
                                    Phương tiện
                                </span>
                                <span className='text-base font-semibold text-gray-900'>
                                    {grouping.vehicle}
                                </span>
                            </div>
                            <div className='flex flex-col bg-white rounded-lg p-3 shadow-sm'>
                                <span className='text-sm text-gray-500 mb-1 flex items-center gap-1'>
                                    <User size={14} />
                                    Người thu gom
                                </span>
                                <span className='text-base font-semibold text-gray-900'>
                                    {grouping.collector}
                                </span>
                            </div>
                            <div className='flex flex-col bg-white rounded-lg p-3 shadow-sm'>
                                <span className='text-sm text-gray-500 mb-1 flex items-center gap-1'>
                                    <MapPin size={14} />
                                    Điểm thu gom
                                </span>
                                <span className='text-base font-semibold text-gray-900'>
                                    {grouping.collectionPoint}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className='flex gap-3 mb-6'>
                        <div className='bg-gray-50 rounded-lg p-3 flex-1 border border-gray-100 flex items-center justify-between min-w-0'>
                            <span className='text-sm text-blue-600 whitespace-nowrap'>
                                Tổng bưu phẩm:
                            </span>
                            <span className='text-xl font-bold text-gray-900'>
                                {grouping.totalPosts}
                            </span>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-3 flex-1 border border-gray-100 flex items-center justify-between min-w-0'>
                            <span className='text-sm text-purple-600 whitespace-nowrap'>
                                Tổng khối lượng:
                            </span>
                            <span className='text-xl font-bold text-gray-900'>
                                {grouping.totalWeightKg} kg
                            </span>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-3 flex-1 border border-gray-100 flex items-center justify-between min-w-0'>
                            <span className='text-sm text-green-600 whitespace-nowrap'>
                                Tổng thể tích:
                            </span>
                            <span className='text-xl font-bold text-gray-900'>
                                {grouping.totalVolumeM3} m³
                            </span>
                        </div>
                    </div>

                    {/* Routes List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <Navigation size={20} className='text-blue-600' />
                            Lộ trình thu gom ({routes.length} điểm)
                        </h3>
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm text-gray-800'>
                                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                        <tr>
                                            <th className='py-3 px-4 text-left'>
                                                Thứ tự
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Người gửi
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Địa chỉ
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Kích thước
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Khối lượng
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Thể tích
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Khoảng cách
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Giờ đến dự kiến
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route) => (
                                            <tr
                                                key={route.postId}
                                                className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'
                                            >
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm'>
                                                        {route.pickupOrder}
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 font-medium text-gray-900'>
                                                    {route.userName}
                                                </td>
                                                <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                                    <div className='line-clamp-2'>
                                                        {route.address}
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <span className='font-medium'>
                                                        {route.dimensionText}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <span className='font-medium'>
                                                        {route.weightKg}
                                                    </span>{' '}
                                                    kg
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    {route.volumeM3} m³
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <span className='flex items-center gap-1'>
                                                        <Navigation
                                                            size={12}
                                                            className='text-blue-500'
                                                        />
                                                        {route.distanceKm} km
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <span className='px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium'>
                                                        {route.estimatedArrival}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
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
