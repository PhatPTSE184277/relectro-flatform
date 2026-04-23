import React from 'react';
import { Eye } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';

interface BrandCategory {
    brandName: string;
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
}

interface BrandListProps {
    data: BrandCategory[];
    loading: boolean;
    total?: number;
    onViewDetail?: (brandName: string) => void;
}

const BrandList: React.FC<BrandListProps> = ({
    data,
    loading,
    total,
    onViewDetail
}) => {
    if (loading) {
        return (
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
                <div className='h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse' />
                <div className='space-y-3'>
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className='h-6 bg-gray-200 rounded animate-pulse'
                        />
                    ))}
                </div>
            </div>
        );
    }

    const totalProducts =
        typeof total === 'number'
            ? total
            : data.reduce((sum, c) => sum + (c.currentValue || 0), 0);

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto max-h-95 overflow-y-auto'>
                <table className='w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-left w-16'>STT</th>
                            <th className='py-3 px-4 text-left'>Thương hiệu</th>
                            <th className='py-3 px-4 text-right w-72'>
                                Số lượng
                            </th>
                            <th className='py-3 px-4 text-right w-72'>
                                Thay đổi
                            </th>
                            <th className='py-3 px-4 text-right w-72'>
                                % Tổng
                            </th>
                            <th className='py-3 px-4 text-center w-40'>
                                Chi tiết
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((brand, idx) => {
                                const isLast = idx === data.length - 1;
                                const percentOfTotal =
                                    totalProducts > 0
                                        ? Math.round(
                                              (brand.currentValue /
                                                  totalProducts) *
                                                  100
                                          )
                                        : 0;
                                const rowBg =
                                    idx % 2 === 0
                                        ? 'bg-white'
                                        : 'bg-primary-50';
                                return (
                                    <tr
                                        key={idx}
                                        className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                                    >
                                        <td className='py-3 px-4 font-medium w-16'>
                                            <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                                {formatNumber(idx + 1)}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 font-medium text-gray-900'>
                                            {brand.brandName}
                                        </td>
                                        <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                                            {formatNumber(brand.currentValue)}
                                        </td>
                                        <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                                            {brand.trend === 'Increase'
                                                ? '▲'
                                                : brand.trend === 'Decrease'
                                                  ? '▼'
                                                  : ''}{' '}
                                            {brand.absoluteChange > 0
                                                ? '+'
                                                : ''}
                                            {formatNumber(brand.absoluteChange)}{' '}
                                            ({formatNumber(brand.percentChange)}
                                            %)
                                        </td>
                                        <td className='py-3 px-4 text-right text-gray-700 font-semibold w-72'>
                                            {formatNumber(percentOfTotal)}%
                                        </td>
                                        <td className='py-3 px-4 text-center w-40'>
                                            <div className='flex items-center justify-center h-full'>
                                                <button
                                                    onClick={() =>
                                                        onViewDetail?.(
                                                            brand.brandName
                                                        )
                                                    }
                                                    className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer text-xs'
                                                    title='Xem chi tiết'
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className='text-center py-8 text-gray-400'
                                >
                                    Không có dữ liệu thương hiệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrandList;
