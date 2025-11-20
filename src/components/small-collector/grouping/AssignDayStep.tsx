
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Truck, Package, ChevronDown, ChevronUp } from 'lucide-react';
import EditGroupingModal from './modal/EditGroupingModal';

interface AssignDayStepProps {
    loading: boolean;
    preAssignResult: any;
    vehicles: any[];
    pendingPosts: any[];
    onCreateGrouping: (payload: {
        workDate: string;
        vehicleId: number;
        postIds: string[];
    }) => void;
    onBack: () => void;
    calculateRoute: (saveResult: boolean) => Promise<void>;
}

const AssignDayStep: React.FC<AssignDayStepProps> = ({
    loading,
    preAssignResult,
    vehicles,
    pendingPosts,
    onCreateGrouping,
    onBack,
    calculateRoute
}) => {
    const [daySuggestions, setDaySuggestions] = useState<any[]>(preAssignResult.days || []);
    const [expandedDays, setExpandedDays] = useState<number[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null);

    // Update daySuggestions if preAssignResult changes (step chuyển lại)
    useEffect(() => {
        setDaySuggestions(preAssignResult.days || []);
    }, [preAssignResult]);

    const toggleDay = (dayIndex: number) => {
        if (expandedDays.includes(dayIndex)) {
            setExpandedDays(expandedDays.filter((d) => d !== dayIndex));
        } else {
            setExpandedDays([...expandedDays, dayIndex]);
        }
    };

    const handleOpenEditModal = (day: any) => {
        setSelectedDay(day);
        setShowModal(true);
    };

    // Xử lý xác nhận từ modal (chỉ cập nhật state, không tạo nhóm)
    const handleConfirmEdit = (data: {
        workDate: string;
        vehicleId: number;
        postIds: string[];
    }) => {
        // Cập nhật lại ngày đang chỉnh sửa
        setDaySuggestions((prev) => prev.map((day) => {
            if (day.workDate === data.workDate) {
                const selectedVehicle = vehicles.find(v => v.id === data.vehicleId);
                const updatedPosts = data.postIds.map(postId => {
                    const found = pendingPosts.find(p => p.postId === postId);
                    return found ? { ...found } : { postId };
                });
                
                // Tính lại tổng khối lượng và thể tích
                const totalWeight = updatedPosts.reduce((sum, p) => sum + (p.weight || 0), 0);
                const totalVolume = updatedPosts.reduce((sum, p) => sum + (p.volume || 0), 0);
                
                return {
                    ...day,
                    suggestedVehicle: selectedVehicle,
                    posts: updatedPosts,
                    totalWeight,
                    totalVolume
                };
            }
            return day;
        }));
        
        // Đóng modal
        setShowModal(false);
        setSelectedDay(null);
    };

    // Xử lý tạo nhóm thu gom (gọi API)
    const handleCreateGrouping = async (data: {
        workDate: string;
        vehicleId: number;
        postIds: string[];
    }) => {
        try {
            // Bước 1: Tạo nhóm thu gom (assign-day)
            await onCreateGrouping(data);
            
            // Bước 2: Tính toán route (auto-group)
            await calculateRoute(true);
            
            // Redirect to grouping list page
            window.location.href = "/small-collector/grouping/list";
        } catch (error) {
            console.error('Error creating grouping:', error);
        }
    };

    // Enrich day.posts with productName and sizeTier from pendingPosts
    const enrichPosts = (posts: any[]) => {
        return posts.map((post) => {
            const found = pendingPosts.find((p) => p.postId === post.postId);
            return {
                ...post,
                productName: found?.productName || '',
                sizeTier: found?.sizeTier || ''
            };
        });
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Bước 2: Tạo nhóm thu gom
                    </h2>
                    <p className='text-gray-600'>
                        Chọn ngày, phương tiện và bưu phẩm để tạo nhóm thu gom
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className='px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                >
                    ← Quay lại
                </button>
            </div>

            {/* Suggestions Display */}
            <div className='space-y-4'>
                {daySuggestions.map((day: any, dayIndex: number) => (
                    <div
                        key={dayIndex}
                        className={`border rounded-lg overflow-hidden transition-all ${
                            expandedDays.includes(dayIndex)
                                ? 'border-blue-500 shadow-md bg-white'
                                : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        {/* Day Header */}
                        <div className='p-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <Calendar className='text-blue-600' size={20} />
                                <div>
                                    <p className='font-semibold text-gray-900'>
                                        {new Date(day.workDate).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        {day.posts.length} bưu phẩm, tổng khối lượng: {day.totalWeight} kg, tổng thể tích: {day.totalVolume} m³
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => handleOpenEditModal(day)}
                                    disabled={loading}
                                    className='p-2 rounded-lg text-blue-600 hover:text-blue-800 transition-colors disabled:text-gray-300'
                                    title='Chỉnh sửa nhóm'
                                >
                                    <Package size={18} />
                                </button>
                                <button
                                    onClick={() => toggleDay(dayIndex)}
                                    className='p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors'
                                    title={expandedDays.includes(dayIndex) ? 'Thu gọn' : 'Xem chi tiết'}
                                >
                                    {expandedDays.includes(dayIndex) ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Day Content */}
                        {expandedDays.includes(dayIndex) && (
                            <div className='p-4 space-y-4 bg-white'>
                                {/* Vehicle Info - compact style */}
                                <div className='border-l-4 border-purple-500 bg-purple-50 rounded-lg px-4 py-2'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <Truck className='text-purple-600' size={18} />
                                        <span className='font-semibold text-gray-900 text-sm'>Phương tiện được gợi ý</span>
                                    </div>
                                    <div className='flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-1'>
                                        <span className='font-medium text-gray-900'>{day.suggestedVehicle.vehicle_Type}</span>
                                        <span className='text-gray-400'>•</span>
                                        <span>{day.suggestedVehicle.plate_Number}</span>
                                        <span className='text-gray-400'>•</span>
                                        <span>Tải trọng: <span className='font-medium'>{day.suggestedVehicle.capacity_Kg} kg</span></span>
                                        {day.suggestedVehicle.allowedCapacityKg != null && (
                                            <>
                                                <span className='text-gray-400'>•</span>
                                                <span>Cho phép: <span className='font-medium text-green-600'>{day.suggestedVehicle.allowedCapacityKg} kg</span></span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Posts List */}
                                <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-sm text-gray-800'>
                                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                                <tr>
                                                    <th className='py-3 px-4 text-left'>Người gửi</th>
                                                    <th className='py-3 px-4 text-left'>Địa chỉ</th>
                                                    <th className='py-3 px-4 text-left'>Sản phẩm</th>
                                                    <th className='py-3 px-4 text-left'>Kích thước</th>
                                                    <th className='py-3 px-4 text-left'>Khối lượng</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {enrichPosts(day.posts).map((post: any) => (
                                                    <tr
                                                        key={post.postId}
                                                        className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'
                                                    >
                                                        <td className='py-3 px-4 text-gray-700'>
                                                            {post.userName || 'N/A'}
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                                            <div className='line-clamp-2'>{post.address || 'N/A'}</div>
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700'>
                                                            {post.productName || 'N/A'}
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700'>
                                                            {post.dimensionText || `${post.length} x ${post.width} x ${post.height} cm`}
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700'>
                                                            <div className='flex flex-col gap-1'>
                                                                <span className='text-xs'>
                                                                    <span className='font-medium'>{post.weight || 0}</span> kg
                                                                </span>
                                                                <span className='text-xs text-gray-500'>
                                                                    {post.volume || 0} m³
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className='pt-2 flex gap-3 justify-end'>
                                    <button
                                        onClick={() => handleCreateGrouping({
                                            workDate: day.workDate,
                                            vehicleId: day.suggestedVehicle.id,
                                            postIds: day.posts.map((p: any) => p.postId)
                                        })}
                                        disabled={loading}
                                        className='py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm'
                                    >
                                        Tạo nhóm thu gom
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <EditGroupingModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedDay(null);
                }}
                onConfirm={handleConfirmEdit}
                day={selectedDay}
                vehicles={vehicles}
                allPendingPosts={pendingPosts}
                loading={loading}
            />
        </div>
    );
};

export default AssignDayStep;
