'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, MapPin, Clock, CheckCircle, Package } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatTimeWithDate } from '@/utils/FormatTime';
import ProductList from '@/components/small-collector/package/modal/ProductList';

interface TrackingModalProps {
    pkg: any;
    onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ pkg, onClose }) => {
    const { packageDetail, loadingPackageDetail, fetchPackageDetail } = useTrackingContext();
    const [activeTab, setActiveTab] = useState<'products' | 'history'>('products');

    const detail = packageDetail || pkg;
    const statusHistories = detail?.statusHistories || [];

    useEffect(() => {
        const packageId = pkg?.packageId;
        if (packageId) {
            fetchPackageDetail(packageId, 1, 10);
        }
    }, [pkg?.packageId, fetchPackageDetail]);

    const summaryItems = useMemo(() => (
        [
            {
                icon: <Package size={14} className='text-primary-400' />,
                label: 'Mã package',
                value: detail?.packageId || 'N/A',
            },
            {
                icon: <MapPin size={14} className='text-primary-400' />,
                label: 'Điểm thu gom',
                value: detail?.smallCollectionPointsName || detail?.smallCollectionPointsAddress || 'N/A',
            },
            {
                icon: <CheckCircle size={14} className='text-primary-400' />,
                label: 'Trạng thái',
                value: (
                    <span
                        className="flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-primary-600 text-white"
                        style={{ minWidth: 110 }}
                    >
                        {detail?.status || 'N/A'}
                    </span>
                ),
            }
        ]
    ), [detail]);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Theo dõi package
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Package Info with SummaryCard */}
                    <SummaryCard items={summaryItems} singleRow={true} />

                    {/* Tab Navigation */}
                    <div className='flex gap-2 border-b border-gray-200 mb-6'>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 font-medium transition-colors relative ${
                                activeTab === 'products'
                                    ? 'text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <Package size={18} />
                                <span>Danh sách sản phẩm</span>
                                <span className='text-sm text-gray-500'>({detail?.products?.totalItems ?? 0})</span>
                            </div>
                            {activeTab === 'products' && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600'></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 font-medium transition-colors relative ${
                                activeTab === 'history'
                                    ? 'text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <Clock size={18} />
                                <span>Lịch sử thay đổi trạng thái</span>
                            </div>
                            {activeTab === 'history' && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600'></div>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'products' && (
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                            {loadingPackageDetail ? (
                                <div className='p-6 text-center text-gray-400'>Đang tải...</div>
                            ) : (
                                <ProductList
                                    products={detail?.products?.data || []}
                                    mode='view'
                                    striped={true}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div>
                            {statusHistories.length === 0 ? (
                                <div className='text-center py-12 text-gray-500'>
                                    Chưa có lịch sử thay đổi trạng thái
                                </div>
                            ) : (
                                <div className='relative py-8'>
                                    {/* Timeline with vertical connector */}
                                    <div className='space-y-6'>
                                        {statusHistories.map((item: any, index: number) => {
                                            const isLeft = index % 2 === 0;
                                            const timestamp = item.createAt || item.createdAt;
                                            return (
                                                <div key={index} className='relative flex'>
                                                    {/* Vertical straight connector between dots */}
                                                    {index < statusHistories.length - 1 && (
                                                        <div
                                                            className='absolute left-1/2 transform -translate-x-1/2 top-11 w-1 h-20 bg-primary-200 z-0'
                                                            style={{}}
                                                        ></div>
                                                    )}

                                                    <div className={`flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`} style={{position: 'relative', zIndex: 1}}>
                                                        <div className='w-5/12 relative'>
                                                            {/* Horizontal connector line from dot to card */}
                                                            <div className={`absolute top-6 ${isLeft ? '-right-4' : '-left-4'} ${isLeft ? 'left-full' : 'right-full'} w-4 h-0.5 bg-primary-300 z-0`}></div>
                                                            {/* Dot */}
                                                            <div className={`absolute top-3 ${isLeft ? '-right-4' : '-left-4'} w-8 h-8 rounded-full bg-primary-500 border-4 border-white flex items-center justify-center shadow-lg z-10`}>
                                                                <CheckCircle size={14} className='text-white' />
                                                            </div>
                                                            {/* Card */}
                                                            <div className='bg-linear-to-br from-white to-primary-50 rounded-xl p-4 shadow-md border border-primary-100 hover:shadow-lg transition-shadow'>
                                                                <div className='flex flex-col gap-2'>
                                                                    <div className='flex justify-between items-center gap-2'>
                                                                        <h4 className='font-semibold text-gray-900 text-sm'>
                                                                            {item.status || 'Cập nhật trạng thái'}
                                                                        </h4>
                                                                        <span className='text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap'>
                                                                            <Clock size={12} />
                                                                            {timestamp ? formatTimeWithDate(timestamp) : 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    {item.description && (
                                                                        <p className='text-xs text-gray-600 flex items-center gap-1'>
                                                                            <MapPin size={12} className='text-gray-400' />
                                                                            {item.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
