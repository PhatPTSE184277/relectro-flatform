'use client';

import React from 'react';
import { Info, List } from 'lucide-react';
import { PackageType } from '@/types/Package';
import PackageInfoCard from './PackageInfoCard';

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
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50'>
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
                        <Info className='w-5 h-5 text-blue-600' />
                        Thông tin package
                    </h3>
                    {/* Package Info Card */}
                    <PackageInfoCard pkg={pkg} />

                    {/* Products List */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <List className='w-5 h-5 text-blue-600' />
                            Danh sách sản phẩm
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
                                        {pkg.products.map((product, index) => (
                                            <tr
                                                key={product.productId}
                                                className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'
                                            >
                                                <td className='py-3 px-4 font-medium'>
                                                    <span className='w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 font-medium'>
                                                    <div className='text-gray-900'>
                                                        {product.categoryName}
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    {product.brandName}
                                                </td>
                                                <td className='py-3 px-4 text-gray-600 text-xs max-w-xs truncate'>
                                                    {product.description || '-'}
                                                </td>
                                                <td className='py-3 px-4 text-gray-400 font-mono text-xs'>
                                                    {product.qrCode || '-'}
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

export default PackageDetail;
