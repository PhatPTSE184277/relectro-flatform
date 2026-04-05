'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { X, MapPin, CheckCircle, Package, Clock3 } from 'lucide-react';
import type { PackageType } from '@/types/Package';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from './ProductList';
import Pagination from '@/components/ui/Pagination';
import { usePackageContext } from '@/contexts/collection-point/PackageContext';
import { formatTimeWithDate } from '@/utils/FormatTime';

interface PackageDetailProps {
    pkg: PackageType;
    onClose: () => void;
}

const PackageDetail: React.FC<PackageDetailProps> = ({
    pkg,
    onClose
}) => {
    const { selectedPackage: packageDetail, loadingDetail: loadingPackageDetail, fetchPackageDetail } = usePackageContext();
    const [activeTab, setActiveTab] = useState<'products' | 'history'>('products');
    const [productPage, setProductPage] = useState(1);
    const limit = 10;

    const detail = packageDetail || pkg;
    const detailAny = detail as any;

    const normalizeDisplayStatus = (status?: string): string => {
        if (status === 'Đang vận chuyển' || status === 'Tái chế') {
            return 'Đã giao';
        }
        return status || 'N/A';
    };

    const normalizeDescription = (status?: string, description?: string): string => {
        if (status === 'Đã giao' || status === 'Đang vận chuyển' || status === 'Tái chế') {
            return 'Kiện hàng đã được giao cho công ty tái chế';
        }
        if (description === 'Kiện hàng đang được vận chuyển về công ty tái chế') {
            return 'Kiện hàng đã được giao cho công ty tái chế';
        }
        return description || 'N/A';
    };

    const mergedStatusHistories = useMemo(() => {
        const rawHistories = (detailAny?.statusHistories || pkg?.statusHistories || []) as any[];
        if (!Array.isArray(rawHistories) || rawHistories.length === 0) return [];

        const shippingHistory = rawHistories.find((item: any) => item?.status === 'Đang vận chuyển');
        const recycledHistory = rawHistories.find((item: any) => item?.status === 'Tái chế');

        const deliveredSource = shippingHistory || recycledHistory;

        const normalizedRows = rawHistories
            .filter((item: any) => item?.status !== 'Đang vận chuyển' && item?.status !== 'Tái chế')
            .map((item: any) => ({
                ...item,
                status: item?.status || 'N/A'
            }));

        if (deliveredSource) {
            normalizedRows.push({
                ...deliveredSource,
                status: 'Đã giao',
                description: 'Kiện hàng đã được giao cho công ty tái chế',
                createAt: shippingHistory?.createAt || shippingHistory?.createdAt || deliveredSource?.createAt || deliveredSource?.createdAt,
                createdAt: shippingHistory?.createdAt || shippingHistory?.createAt || deliveredSource?.createdAt || deliveredSource?.createAt
            });
        }

        return normalizedRows.sort((a: any, b: any) => {
            const timeA = new Date(a?.createAt || a?.createdAt || 0).getTime();
            const timeB = new Date(b?.createAt || b?.createdAt || 0).getTime();
            return timeB - timeA;
        });
    }, [detailAny?.statusHistories, pkg?.statusHistories]);

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
                value:
                    detail?.smallCollectionPointsName ||
                    detail?.smallCollectionPointsAddress ||
                    'N/A'
            },
            {
                icon: <CheckCircle size={14} className='text-primary-400' />,
                label: 'Trạng thái',
                value: (
                    <span
                        className='flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-transparent text-primary-700'
                        style={{ minWidth: 140 }}
                    >
                        {normalizeDisplayStatus(detail?.status || pkg?.status)}
                    </span>
                )
            }
        ],
        [detail, pkg?.status]
    );

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30'></div>

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
                                <span className='text-sm text-gray-500'>({mergedStatusHistories.length})</span>
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
                                        products={(detail?.products?.data || []).map((product) => ({
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
                                {mergedStatusHistories.length ? (
                                    <div className='relative w-full overflow-y-auto' style={{ maxHeight: `40vh` }}>
                                        <table className='w-full text-sm text-gray-800 table-fixed'>
                                            <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                                <tr>
                                                    <th className='py-3 px-4 text-left'>Trạng thái</th>
                                                    <th className='py-3 px-4 text-left'>Mô tả</th>
                                                    <th className='py-3 px-4 text-left'>Thời gian</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mergedStatusHistories.map((item, idx) => {
                                                    const isLast = idx === mergedStatusHistories.length - 1;
                                                    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                                    return (
                                                        <tr key={`${item.status}-${item.createAt}-${idx}`} className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
                                                            <td className='py-3 px-4 text-gray-700'>{normalizeDisplayStatus(item.status)}</td>
                                                            <td className='py-3 px-4 text-gray-700'>{normalizeDescription(item.status, item.description)}</td>
                                                            <td className='py-3 px-4 text-gray-700 whitespace-nowrap'>{formatTimeWithDate(item.createAt || item.createdAt, true)}</td>
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

export default PackageDetail;
