'use client';
import React from 'react';
import type { PackageType } from '@/types/Package';
import { Info, List, Tag, Box, Hash, Truck, ListCheck } from 'lucide-react';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageDetailProps {
    package: PackageType;
    onClose: () => void;
}

const PackageDetail: React.FC<PackageDetailProps> = ({
    package: pkg,
    onClose
}) => {
    if (!pkg) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết Package
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            Thông tin chi tiết về package và danh sách sản phẩm
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Package Info Title */}
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                            <Info className='w-5 h-5 text-primary-500' />
                        </span>
                        Thông tin package
                    </h3>
                    {/* Package Info Card */}
                    <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100'>
                        <div className='grid grid-cols-4 gap-6'>
                            {/* Mã package */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <Tag size={14} className='text-primary-400' />
                                    </span>
                                    Mã package
                                </div>
                                <div className='text-sm font-medium text-gray-900 break-all'>
                                    {pkg.packageId}
                                </div>
                            </div>
                            {/* Tên package */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <Box size={14} className='text-primary-400' />
                                    </span>
                                    Tên package
                                </div>
                                <div className='text-sm tex font-medium text-gray-900'>
                                    {pkg.packageName}
                                </div>
                            </div>
                            {/* Số sản phẩm */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <ListCheck size={14} className='text-primary-400' />
                                    </span>
                                    Số sản phẩm
                                </div>
                                <div className='text-sm font-medium text-gray-900 h-8 flex items-center'>
                                    {pkg.products.length}
                                </div>
                            </div>
                            {/* Trạng thái */}
                            <div className='flex flex-col'>
                                <div className='text-xs font-semibold uppercase text-gray-700 mb-2 flex items-center gap-1'>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <Truck size={14} className='text-primary-400' />
                                    </span>
                                    Trạng thái
                                </div>
                                <div>
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                            pkg.status === PackageStatus.Packing
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : pkg.status === PackageStatus.Closed
                                                ? 'bg-green-100 text-green-700'
                                                : pkg.status === PackageStatus.Shipping
                                                ? 'bg-blue-100 text-blue-700'
                                                : pkg.status === PackageStatus.Recycling
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {pkg.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                <List className='w-5 h-5 text-primary-500' />
                            </span>
                            Danh sách sản phẩm ({pkg.products.length})
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
                                                Danh mục
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Thương hiệu
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                Ghi chú
                                            </th>
                                            <th className='py-3 px-4 text-left'>
                                                QR Code
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pkg.products.map((product, index) => {
                                            const isLast = index === pkg.products.length - 1;
                                            return (
                                                <tr
                                                    key={product.productId}
                                                    className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors`}
                                                >
                                                    <td className='py-3 px-4 font-medium'>
                                                        <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                            {index + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900'>
                                                        {product.categoryName}
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700'>
                                                        {product.brandName}
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                                        <div className='line-clamp-2'>
                                                            {product.description || '-'}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-gray-700 font-mono text-xs'>
                                                        {product.qrCode || '-'}
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

export default PackageDetail;
