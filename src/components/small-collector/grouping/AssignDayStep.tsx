'use client';

import React, { useState } from 'react';
import { Calendar, Truck, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import EditGroupingModal from './modal/EditGroupingModal';
import PostList from './PostList';

interface AssignDayStepProps {
    loading: boolean;
    preAssignResult: any;
    vehicles: any[];
    posts: any[];
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
    posts,
    onCreateGrouping,
    onBack,
    calculateRoute
}) => {
    const [daySuggestions, setDaySuggestions] = useState<any[]>(preAssignResult.days || []);
    const [expandedDays, setExpandedDays] = useState<number[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null);

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
                    const found = posts.find(p => p.postId === postId)
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
            await onCreateGrouping(data);
            await calculateRoute(true);
            window.location.href = "/small-collector/grouping/list";
        } catch (error) {
            console.error('Error creating grouping:', error);
        }
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
                    className='px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
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
                                ? 'border-primary-500 shadow-md bg-white'
                                : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        {/* Day Header */}
                        <div className='p-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <Calendar className='text-primary-600' size={20} />
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
                                    className='p-2 rounded-lg text-primary-600 hover:text-primary-800 transition-colors disabled:text-gray-300 cursor-pointer'
                                    title='Chỉnh sửa nhóm'
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => toggleDay(dayIndex)}
                                    className='p-2 rounded-lg text-gray-500 hover:text-primary-600 transition-colors cursor-pointer'
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
                                <div className='border-l-4 border-primary-500 bg-primary-50 rounded-lg px-4 py-2'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <Truck className='text-primary-600' size={18} />
                                        <span className='font-semibold text-gray-900 text-sm'>Phương tiện</span>
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
                                <PostList posts={day.posts.map((post: any) => {
                                    const found = posts.find((p) => p.postId === post.postId);
                                    return {
                                        ...post,
                                        productName: found?.productName || '',
                                        sizeTier: found?.sizeTier || '',
                                        dimensionText: found?.dimensionText,
                                        length: found?.length,
                                        width: found?.width,
                                        height: found?.height,
                                    };
                                })} loading={false} />

                                {/* Action Button */}
                                <div className='pt-2 flex gap-3 justify-end'>
                                    <button
                                        onClick={() => handleCreateGrouping({
                                            workDate: day.workDate,
                                            vehicleId: day.suggestedVehicle.id,
                                            postIds: day.posts.map((p: any) => p.postId)
                                        })}
                                        disabled={loading}
                                        className='py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer'
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
                allPosts={posts}
                loading={loading}
            />
        </div>
    );
};

export default AssignDayStep;
