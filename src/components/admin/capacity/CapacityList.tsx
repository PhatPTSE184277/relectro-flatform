import React from 'react';
import { WarehouseCapacity } from '@/services/admin/CapacityService';
import CapacityWarehouseSkeleton from './CapacitySkeleton';
import { formatWeightKg } from '@/utils/formatNumber';

interface CapacityListProps {
    warehouses: WarehouseCapacity[];
    loading: boolean;
}

const CapacityList: React.FC<CapacityListProps> = ({ warehouses, loading }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='max-h-[55vh] overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                            <tr>
                                <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                <th className='py-3 px-4 text-left w-[20vw]'>Tên đơn vị thu gom</th>
                                <th className='py-3 px-4 text-right w-[14vw]'>Sức chứa tối đa (m³)</th>
                                <th className='py-3 px-4 text-right w-[14vw]'>Đang chứa (m³)</th>
                                <th className='py-3 px-4 text-right w-[14vw]'>Còn trống (m³)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <CapacityWarehouseSkeleton key={idx} />
                                ))
                            ) : warehouses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className='py-8 text-center text-gray-400'>
                                        Không có dữ liệu đơn vị thu gom
                                    </td>
                                </tr>
                            ) : (
                                warehouses.map((wh, idx) => {
                                    const isLast = idx === warehouses.length - 1;
                                    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                   
                                    return (
                                        <tr
                                            key={wh.id}
                                            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                                        >
                                            <td className='py-3 px-4 text-center'>
                                                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4 font-medium text-gray-900'>{wh.name}</td>
                                            <td className='py-3 px-4 text-right text-gray-700'>{formatWeightKg(wh.maxCapacity)}</td>
                                            <td className='py-3 px-4 text-right text-gray-700'>{formatWeightKg(wh.currentCapacity)}</td>
                                            <td className='py-3 px-4 text-right text-gray-700'>{formatWeightKg(wh.availableCapacity)}</td>
                                            {/* Mức sử dụng column removed */}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CapacityList;
