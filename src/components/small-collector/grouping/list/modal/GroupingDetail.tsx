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
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50'>
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
                        <Package className='w-5 h-5 text-blue-600' />
                        Thông tin nhóm
                    </h3>
                    <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100'>
                        <div className='grid grid-cols-4 gap-6'>
                            {/* Ngày thu gom */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <Calendar size={14} />
                                    Ngày thu gom
                                </div>
                                <div className='text-sm font-medium text-gray-900'>
                                    {new Date(grouping.groupDate).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            {/* Phương tiện */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <Truck size={14} />
                                    Phương tiện
                                </div>
                                <div className='text-sm font-medium text-gray-900'>
                                    {grouping.vehicle}
                                </div>
                            </div>
                            {/* Người thu gom */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <User size={14} />
                                    Người thu gom
                                </div>
                                <div className='text-sm font-medium text-gray-900'>
                                    {grouping.collector}
                                </div>
                            </div>
                            {/* Điểm thu gom */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <MapPin size={14} />
                                    Điểm thu gom
                                </div>
                                <div className='text-sm font-medium text-gray-900'>
                                    {grouping.collectionPoint}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className='grid grid-cols-3 gap-4 mb-6'>
                        <div className='bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-blue-700'>Tổng bưu phẩm</span>
                            <span className='text-2xl font-bold text-blue-900'>{grouping.totalPosts}</span>
                        </div>
                        <div className='bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-purple-700'>Tổng khối lượng</span>
                            <span className='text-2xl font-bold text-purple-900'>{grouping.totalWeightKg} <span className='text-sm font-normal'>kg</span></span>
                        </div>
                        <div className='bg-green-50 rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-green-700'>Tổng thể tích</span>
                            <span className='text-2xl font-bold text-green-900'>{grouping.totalVolumeM3} <span className='text-sm font-normal'>m³</span></span>
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
