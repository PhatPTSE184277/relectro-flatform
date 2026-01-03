'use client';

import React from 'react';
import { X, Package } from 'lucide-react';

interface TasksModalProps {
    open: boolean;
    onClose: () => void;
    tasks: any;
    companyName: string;
}

const TasksModal: React.FC<TasksModalProps> = ({ open, onClose, tasks, companyName }) => {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Nhiệm vụ tái chế</h2>
                        <p className='text-sm text-gray-600 mt-1'>{companyName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {tasks ? (
                        <div className='space-y-4'>
                            {/* Task Info */}
                            <div className='bg-primary-50 rounded-xl p-4 border border-primary-100'>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-xs text-gray-600 mb-1'>Điểm thu gom</p>
                                        <p className='font-semibold text-gray-900'>{tasks.smallCollectionName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600 mb-1'>Địa chỉ</p>
                                        <p className='font-semibold text-gray-900'>{tasks.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600 mb-1'>Tổng số gói</p>
                                        <p className='font-semibold text-gray-900'>{tasks.totalPackage || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Packages List */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                                <div className='p-4 border-b bg-gray-50'>
                                    <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
                                        <Package size={18} className='text-primary-600' />
                                        Danh sách gói hàng
                                    </h3>
                                </div>
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm text-gray-800'>
                                        <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                            <tr>
                                                <th className='py-3 px-4 text-center'>STT</th>
                                                <th className='py-3 px-4 text-left'>Mã gói</th>
                                                <th className='py-3 px-4 text-left'>Tên gói</th>
                                                <th className='py-3 px-4 text-left'>Trạng thái</th>
                                                <th className='py-3 px-4 text-left'>Ngày tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.packages && tasks.packages.length > 0 ? (
                                                tasks.packages.map((pkg: any, index: number) => (
                                                    <tr
                                                        key={pkg.packageId}
                                                        className={`${
                                                            index !== tasks.packages.length - 1 ? 'border-b border-gray-100' : ''
                                                        } hover:bg-primary-50/40 transition-colors`}
                                                    >
                                                        <td className='py-3 px-4 text-center'>
                                                            <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                                {index + 1}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4 font-medium text-gray-900'>
                                                            {pkg.packageId}
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700'>
                                                            {pkg.packageName || 'N/A'}
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                                                                {pkg.status || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700'>
                                                            {pkg.createAt ? new Date(pkg.createAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className='text-center py-8 text-gray-400'>
                                                        Không có gói hàng nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='text-center py-12 text-gray-400'>
                            Không có dữ liệu nhiệm vụ
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={onClose}
                        className='px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition cursor-pointer'
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TasksModal;
