import React from 'react';
import { Ban, CheckCircle } from 'lucide-react';
import type { CollectorStatusFilter } from '@/contexts/collection-point/CollectorContext';

interface CollectorShowProps {
    collector: any;
    filterStatus?: CollectorStatusFilter;
    onBlock: () => void;
    onActivate: () => void;
    actionLoading: boolean;
    isLast?: boolean;
    index?: number;
}

const CollectorShow: React.FC<CollectorShowProps> = ({ collector, filterStatus, onBlock, onActivate, actionLoading, isLast = false, index }) => {
    const stt = (index ?? 0) + 1;
    const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    const statusText = String(collector.status || '').trim().toLowerCase();
    const isActiveByFilter = filterStatus === 'Đang hoạt động' ? true : filterStatus === 'Không hoạt động' ? false : undefined;
    const isActiveByData =
        collector.isActive === true ||
        collector.active === true ||
        collector.isActivated === true ||
        collector.status === true ||
        statusText.includes('đang hoạt động') ||
        statusText === 'active';
    const isActive = isActiveByFilter ?? isActiveByData;

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`}>
            <td className='py-3 px-4 text-center w-[5vw] min-w-10'>
               <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                    {index !== undefined ? index + 1 : ''}
                </span>
            </td>
            <td className='py-3 px-4 w-[14vw] min-w-48'>
                <div className='text-gray-900 font-medium'>
                    {collector.name || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700 w-[14vw] min-w-48'>
                {collector.email || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>

            <td className='py-3 px-4 text-gray-700 w-[12vw] min-w-36'>
                {collector.phone || (
                    <span className='text-gray-400'>Chưa có</span>
                )}
            </td>
            <td className='py-3 px-4 w-[10vw] min-w-28'>
                <div className='flex justify-center gap-2'>
                    {isActive ? (
                        <button
                            onClick={onBlock}
                            disabled={actionLoading}
                            className='text-red-500 hover:text-red-700 disabled:opacity-40 transition cursor-pointer'
                            title='Khóa'
                        >
                            <Ban size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={onActivate}
                            disabled={actionLoading}
                            className='text-green-500 hover:text-green-700 disabled:opacity-40 transition cursor-pointer'
                            title='Mở khóa'
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default CollectorShow;
