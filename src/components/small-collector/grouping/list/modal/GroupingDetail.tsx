"use client";
import { formatDimensionText, formatWeightKg } from "@/utils/formatNumber";
import { formatDate } from "@/utils/FormatDate";
import React, { useState, useEffect } from 'react';
import {
    Truck,
    MapPin,
    Calendar,
    User,
    FileDown,
    Loader2,
} from 'lucide-react';
import axios from '@/lib/axios';
import SummaryCard, { SummaryCardItem } from '@/components/ui/SummaryCard';
import { useGroupingContext } from '@/contexts/small-collector/GroupingContext';
import Pagination from '@/components/ui/Pagination';
import RouteTableSkeleton from './RouteTableSkeleton';

interface Route {
    pickupOrder: number;
    postId: string;
    userName: string;
    address: string;
    weightKg: number;
    volumeM3: number;
    distanceKm: number;
    schedule: string;
    estimatedArrival: string;
    sizeTier?: string;
    categoryName?: string;
    brandName?: string;
    dimensionText?: string;
}

interface GroupingDetailData {
    groupId: number;
    groupCode: string;
    shiftId: string;
    vehicle: string;
    collector: string;
    groupDate: string;
    collectionPoint: string;
    totalProduct: number;
    totalWeightKg: number;
    totalVolumeM3: number;
    totalRoutes?: number;
    page?: number;
    limit?: number;
    totalPage?: number;
    routes: Route[];
}

interface GroupingDetailProps {
    grouping: GroupingDetailData | null;
    onClose: () => void;
}

const GroupingDetail: React.FC<GroupingDetailProps> = ({
    grouping,
    onClose
}) => {
    const { fetchGroupDetail, groupDetailLoading } = useGroupingContext();

    // State phân trang
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const totalPage = grouping?.totalPage || 1;
    const [exportingPDF, setExportingPDF] = useState(false);

    // Đồng bộ page khi groupId thay đổi (mở modal mới hoặc chọn nhóm khác)
    useEffect(() => {
        if (grouping?.groupId) {
            setPage(grouping.page || 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grouping?.groupId]);

    // Khi đổi page, gọi lại API
    const handlePageChange = (newPage: number) => {
        if (grouping?.groupId && newPage !== page) {
            setPage(newPage);
            fetchGroupDetail(grouping.groupId, newPage, limit);
        }
    }

    // Export PDF handler
    const handleExportPDF = async () => {
        if (!grouping?.groupId) return;
        
        setExportingPDF(true);
        try {
            const response = await axios.get(`/PrintRoutes/export-pdf/${grouping.groupId}`, {
                responseType: 'blob',
            });
            
            // Create download link
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Nhom-${grouping.groupCode}-${formatDate(grouping.groupDate)}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Không thể xuất PDF. Vui lòng thử lại!');
        } finally {
            setExportingPDF(false);
        }
    };

    if (!grouping) return null;
    const routes = grouping.routes ?? [];

    // Generate summary items
    const summaryItems: SummaryCardItem[] = [
        {
            label: 'Ngày thu gom',
            value: grouping.groupDate ? formatDate(grouping.groupDate) : '',
            icon: <Calendar size={14} className='text-primary-400' />,
        },
        {
            label: 'Phương tiện',
            value: grouping.vehicle,
            icon: <Truck size={14} className='text-primary-400' />,
        },
        {
            label: 'Người thu gom',
            value: grouping.collector,
            icon: <User size={14} className='text-primary-400' />,
        },
        {
            label: 'Điểm thu gom',
            value: grouping.collectionPoint,
            icon: <MapPin size={14} className='text-primary-400' />,
        },
    ];

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-[90vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh] min-h-[80vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            Chi tiết nhóm thu gom
                        </h2>
                    </div>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handleExportPDF}
                            disabled={exportingPDF}
                            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Xuất PDF'
                        >
                            <FileDown size={18} />
                            {exportingPDF ? <Loader2 size={16} className='animate-spin' /> : 'Xuất PDF'}
                        </button>
                        <button
                            onClick={onClose}
                            className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        >
                            &times;
                        </button>
                    </div>
                </div>  

                {/* Main content */}
                <div className='flex-1 p-6'>
                    {/* Group Info */}
                    <SummaryCard label="Thông tin nhóm" items={summaryItems} />

                    {/* Statistics */}
                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div className='bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-blue-700'>
                                Tổng bưu phẩm
                            </span>
                            <span className='text-2xl font-bold text-blue-900'>
                                {grouping.totalProduct}
                            </span>
                        </div>
                        <div className='bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase text-purple-700'>
                                Tổng khối lượng (kg)
                            </span>
                            <span className='text-2xl font-bold text-purple-900'>
                                {formatWeightKg(grouping.totalWeightKg)}
                            </span>
                        </div>
                    </div>

                    {/* Routes List */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='overflow-x-auto max-h-[40vh] overflow-y-auto'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-16'>STT</th>
                                        <th className='py-3 px-4 text-left w-56'>Sản phẩm</th>
                                        <th className='py-3 px-4 text-left'>Địa chỉ</th>
                                        <th className='py-3 px-4 text-right w-64'>Khối lượng / Kích thước (kg, cm)</th>
                                        <th className='py-3 px-4 text-right w-42'>Khoảng cách (km)</th>
                                        <th className='py-3 px-4 text-center w-42'>Giờ đến dự kiến</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupDetailLoading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <RouteTableSkeleton key={idx} />
                                        ))
                                    ) : routes.length > 0 ? (
                                        routes.map((route, idx) => {
                                            const isLast = idx === routes.length - 1;
                                            // Calculate global index for STT
                                            const globalIndex = (page - 1) * limit + idx + 1;
                                            const rowBg = (globalIndex - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                            return (
                                            <tr
                                                key={route.postId}
                                                className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`}
                                                style={{ tableLayout: 'fixed' }}
                                            >
                                                <td className='py-3 px-4 font-medium w-16'>
                                                    <span className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-semibold'>
                                                        {globalIndex}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 font-medium text-gray-900 w-56'>
                                                    <div className='wrap-break-word'> {route.categoryName} - {route.brandName}</div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700'>
                                                    <div className='wrap-break-word'>
                                                        {route.address}
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700 text-right w-64'>
                                                    <div className='flex flex-col gap-1 items-end'>
                                                        <span className='text-xs'>
                                                            <span className='font-medium'>{formatWeightKg(route.weightKg)}</span>
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {formatDimensionText(route.dimensionText)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4 text-gray-700 text-right w-42'>
                                                    <span className='flex items-center gap-1 justify-end'>
                                                        {route.distanceKm}
                                                    </span>
                                                </td>
                                                <td className='py-3 px-4 text-center w-42'>
                                                    <span className='flex items-center justify-center'>
                                                        {route.estimatedArrival}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-8 text-gray-400'>
                                                Không có tuyến đường nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        {!groupDetailLoading && (
                            <Pagination
                                page={page}
                                totalPages={totalPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupingDetail;
