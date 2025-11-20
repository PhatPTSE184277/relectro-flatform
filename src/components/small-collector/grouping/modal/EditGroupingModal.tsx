'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Package, Calendar } from 'lucide-react';

interface EditGroupingModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: {
        workDate: string;
        vehicleId: number;
        postIds: string[];
    }) => void;
    day: any;
    vehicles: any[];
    allPendingPosts: any[]; 
    loading: boolean;
}

const EditGroupingModal: React.FC<EditGroupingModalProps> = ({
    open,
    onClose,
    onConfirm,
    day,
    vehicles,
    allPendingPosts = [],
    loading
}) => {
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

    useEffect(() => {
        if (open && day) {
            setSelectedVehicleId(day.suggestedVehicle.id);
            setSelectedPostIds(day.posts.map((p: any) => p.postId));
        }
    }, [open, day]);

    const handleTogglePost = (postId: string) => {
        if (selectedPostIds.includes(postId)) {
            setSelectedPostIds(selectedPostIds.filter((id) => id !== postId));
        } else {
            setSelectedPostIds([...selectedPostIds, postId]);
        }
    };

    const handleConfirm = () => {
        if (selectedVehicleId && selectedPostIds.length > 0) {
            onConfirm({
                workDate: day.workDate,
                vehicleId: selectedVehicleId,
                postIds: selectedPostIds
            });
        }
    };

    const handleClose = () => {
        setSelectedVehicleId(null);
        setSelectedPostIds([]);
        onClose();
    };

    if (!open || !day || !Array.isArray(allPendingPosts)) return null;

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                            <Calendar className='text-blue-600' size={24} />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Chỉnh sửa thông tin nhóm thu gom
                            </h2>
                            <p className='text-sm text-gray-500 mt-1'>
                                Ngày: {new Date(day.workDate).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50'>
                    {/* Vehicle Selection */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>
                            Chọn phương tiện
                        </label>
                        <div className='flex flex-col gap-3'>
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    onClick={() => setSelectedVehicleId(vehicle.id)}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedVehicleId === vehicle.id
                                            ? 'border-purple-500 bg-purple-50 shadow-md'
                                            : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                >
                                    <div className='flex items-center gap-6'>
                                        <Truck
                                            className={
                                                selectedVehicleId === vehicle.id
                                                    ? 'text-purple-600'
                                                    : 'text-gray-400'
                                            }
                                            size={20}
                                        />
                                        <span className='font-medium text-gray-900'>
                                            {vehicle.vehicle_Type}
                                        </span>
                                        <span className='text-sm text-gray-600'>
                                            {vehicle.plate_Number}
                                        </span>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <span className='text-xs text-gray-500'>Tải trọng</span>
                                            <span className='font-medium text-gray-900'>{vehicle.capacity_Kg} kg</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <span className='text-xs text-gray-500'>Thể tích</span>
                                            <span className='font-medium text-gray-900'>{vehicle.capacity_M3} m³</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Posts Selection */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='p-4 border-b border-gray-100'>
                            <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
                                <Package size={18} className='text-blue-600' />
                                Chọn bưu phẩm ({selectedPostIds.length}/{allPendingPosts.length})
                            </h3>
                            <p className='text-xs text-gray-500 mt-1'>
                                Các bưu phẩm được gợi ý đã được chọn sẵn. Bạn có thể thêm hoặc bỏ chọn.
                            </p>
                        </div>

                        <div className='overflow-y-auto max-h-[400px]'>
                            <table className='w-full'>
                                <thead className='bg-gray-50 sticky top-0 z-10'>
                                    <tr className='border-b border-gray-200'>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    selectedPostIds.length === allPendingPosts.length
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPostIds(
                                                            allPendingPosts.map((p: any) => p.postId)
                                                        );
                                                    } else {
                                                        setSelectedPostIds([]);
                                                    }
                                                }}
                                                className='w-4 h-4 text-blue-600 rounded cursor-pointer'
                                            />
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            STT
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            Người gửi
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            Địa chỉ
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            Sản phẩm
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            Kích thước
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase'>
                                            Khối lượng
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPendingPosts.map((post: any, index: number) => {
                                        const isSelected = selectedPostIds.includes(post.postId);
                                        const wasSuggested = day.posts.some((p: any) => p.postId === post.postId);
                                        return (
                                            <tr
                                                key={post.postId}
                                                onClick={() => handleTogglePost(post.postId)}
                                                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-50'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className='py-3 px-4'>
                                                    <input
                                                        type='checkbox'
                                                        checked={isSelected}
                                                        onChange={() => handleTogglePost(post.postId)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className='w-4 h-4 text-blue-600 rounded cursor-pointer'
                                                    />
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center'>
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <p className='text-sm font-medium text-gray-900'>
                                                        {post.userName}
                                                    </p>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <p className='text-sm text-gray-600 max-w-xs truncate'>
                                                        {post.address}
                                                    </p>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <p className='text-sm text-gray-600'>
                                                        {post.productName || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <p className='text-sm text-gray-600'>
                                                        {post.dimensionText || `${post.length} x ${post.width} x ${post.height} cm`}
                                                    </p>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <p className='text-sm font-semibold text-gray-900'>
                                                        {post.weight} kg
                                                    </p>
                                                    <p className='text-xs text-gray-400'>
                                                        {post.volume} m³
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                        <p className='text-sm text-blue-800'>
                            <span className='font-semibold'>Tổng kết:</span> Bạn đã chọn{' '}
                            <span className='font-bold'>{selectedPostIds.length}</span> bưu phẩm
                            {selectedVehicle && (
                                <>
                                    {' '}
                                    cho phương tiện{' '}
                                    <span className='font-bold'>
                                        {selectedVehicle.vehicle_Type} ({selectedVehicle.plate_Number})
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t border-gray-100 bg-white'>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !selectedVehicleId || selectedPostIds.length === 0}
                        className='px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium cursor-pointer flex items-center gap-2'
                    >
                        <Package size={18} />
                        {loading ? 'Đang cập nhật...' : 'Xác nhận chỉnh sửa'}
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

export default EditGroupingModal;
