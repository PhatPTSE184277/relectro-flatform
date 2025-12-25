'use client';
import React from 'react';
import type { PackageType } from '@/types/Package';
import { Tag, Box, ListCheck, Truck } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
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

    // Tách summaryItems ra ngoài cho rõ ràng
    const summaryItems = [
        {
            icon: <Tag size={14} className='text-primary-400' />,
            label: 'Mã package',
            value: pkg.packageId,
        },
        {
            icon: <Box size={14} className='text-primary-400' />,
            label: 'Tên package',
            value: pkg.packageName,
        },
        {
            icon: <ListCheck size={14} className='text-primary-400' />,
            label: 'Số sản phẩm',
            value: pkg.products.length,
        },
        {
            icon: <Truck size={14} className='text-primary-400' />,
            label: 'Trạng thái',
            value: (
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
            ),
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
            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Thông tin package
                        </h2>
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
                <div className='flex-1 p-6 flex flex-col gap-6'>
                    {/* Package Info Row */}
                    <div className='flex flex-row gap-6 mb-2 w-full'>
                        <SummaryCard
                            items={summaryItems}
                            singleRow={true}
                        />
                    </div>
                    {/* Products List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0'>
                        <div className='overflow-x-auto overflow-y-auto max-h-[45vh]'>
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
    );
};

export default PackageDetail;
