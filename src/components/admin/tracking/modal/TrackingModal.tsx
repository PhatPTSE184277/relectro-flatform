'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, MapPin, CheckCircle, Package, Clock3 } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from '@/components/small-collector/package/modal/ProductList';
import Pagination from '@/components/ui/Pagination';
import { formatTimeWithDate } from '@/utils/FormatTime';

interface TrackingModalProps {
    pkg: any;
    onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ pkg, onClose }) => {
    const { packageDetail, loadingPackageDetail, fetchPackageDetail } = useTrackingContext();
    const [activeTab, setActiveTab] = useState<'products' | 'history'>('products');
    const [productPage, setProductPage] = useState(1);
    const limit = 10;

    const detail = packageDetail || pkg;
    
    useEffect(() => {
        const packageId = pkg?.packageId;
        if (packageId) {
            void fetchPackageDetail(packageId, productPage, limit);
        }
    }, [pkg?.packageId, fetchPackageDetail, productPage]);

    const totalPages = detail?.products?.totalItems
        ? Math.ceil(detail.products.totalItems / limit)
        : 1;

    const summaryItems = useMemo(
        () => [
            {
                icon: <Package size={14} className='text-primary-400' />,
                label: 'Mã kiện hàng',
                value: detail?.packageId || 'N/A'
            },
            {
                icon: <MapPin size={14} className='text-primary-400' />,
                label: 'Điểm thu gom',
                value: detail?.smallCollectionPointsName || detail?.smallCollectionPointsAddress || 'N/A'
            },
            {
                icon: <CheckCircle size={14} className='text-primary-400' />,
                label: 'Trạng thái',
                value: (
                    <span
                        className='flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-transparent text-primary-700'
                        style={{ minWidth: 140 }}
                    >
                        {pkg.status || 'N/A'}
                    </span>
                )
            }
        ],
        [detail, pkg.status]
    );

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh]'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <h2 className='text-2xl font-bold text-gray-800'>Theo dõi kiện hàng</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6'>
                    <SummaryCard items={summaryItems} singleRow={true} />

                    <div className='flex gap-2 border-b border-gray-200 mb-6 mt-6'>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 font-medium transition-colors relative ${
                                activeTab === 'products' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
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
                                activeTab === 'history' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <Clock3 size={18} />
                                <span>Lịch sử trạng thái</span>
                                <span className='text-sm text-gray-500'>({pkg.statusHistories?.length ?? 0})</span>
                            </div>
                            {activeTab === 'history' && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600'></div>
                            )}
                        </button>
                    </div>

                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                        {activeTab === 'products' ? (
                            loadingPackageDetail ? (
                                <div className='p-6 text-center text-gray-400'>Đang tải...</div>
                            ) : (
                                <>
                                    <ProductList
                                        products={(detail?.products?.data || []).map((product: any) => ({
                                            ...product,
                                            qrCode: product.qrCode || undefined
                                        }))}
                                        mode='view'
                                        striped={true}
                                    />
                                    <Pagination
                                        page={productPage}
                                        totalPages={totalPages}
                                        onPageChange={setProductPage}
                                    />
                                </>
                            )
                        ) : (
                            <div className='max-h-[62vh] overflow-auto'>
                                {pkg.statusHistories?.length ? (
                                    <div className='relative w-full overflow-y-auto' style={{ maxHeight: '40vh' }}>
                                        <table className='w-full text-sm text-gray-800 table-fixed'>
                                            <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                                <tr>
                                                    <th className='py-3 px-4 text-left'>Trạng thái</th>
                                                    <th className='py-3 px-4 text-left'>Mô tả</th>
                                                    <th className='py-3 px-4 text-left'>Thời gian</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pkg.statusHistories.map((item: any, idx: number) => {
                                                    const isLast = idx === (pkg.statusHistories?.length || 0) - 1;
                                                    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                                    return (
                                                        <tr key={`${item.status}-${item.createAt}-${idx}`} className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
                                                            <td className='py-3 px-4 text-gray-700'>{item.status}</td>
                                                            <td className='py-3 px-4 text-gray-700'>{item.description}</td>
                                                            <td className='py-3 px-4 text-gray-700 whitespace-nowrap'>{formatTimeWithDate(item.createAt, true)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className='px-4 py-8 text-center text-gray-400'>Chưa có lịch sử trạng thái</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
