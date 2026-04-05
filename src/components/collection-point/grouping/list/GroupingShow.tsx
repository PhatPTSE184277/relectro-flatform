import React from 'react';
import { Eye, UserCog, FileDown } from 'lucide-react';
import axios from '@/lib/axios';
import { formatWeightKg } from '@/utils/formatNumber';
import { formatDate } from '@/utils/FormatDate';

interface GroupingShowProps {
    grouping: any;
    onViewDetail: (grouping: any) => void;
    onReassignDriver: (grouping: any) => void;
}

const GroupingShow: React.FC<GroupingShowProps & { isLast?: boolean; stt?: number }> = ({ grouping, onViewDetail, onReassignDriver, isLast = false, stt }) => {
    const rowBg = ((stt ?? 1) - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`} style={{ tableLayout: 'fixed' }}>
            <td className='py-3 px-4 text-left w-[5vw] min-w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 font-medium w-[14vw] min-w-[10vw]'>
                <div className='text-gray-900'>{grouping.groupCode}</div>
            </td>
            <td className='py-3 px-4 text-center text-gray-700 w-[12vw] min-w-[8vw]'>
                {formatDate(grouping.groupDate)}
            </td>
            <td className='py-3 px-4 text-center text-gray-700 w-[14vw] min-w-[10vw]'>
                <div className='flex items-center justify-center gap-2'>
                    <span>{grouping.vehicle?.replace(/\s*\(.*\)/, '')}</span>
                </div>
            </td>
            <td className='py-3 px-4 text-gray-700 w-[14vw] min-w-[10vw]'>
                {grouping.collector}
            </td>
                <td className='py-3 px-4 text-gray-700 text-right w-[10vw] min-w-[8vw]'>
                    {grouping.totalPosts}
                </td>
            <td className='py-3 px-4 text-gray-700 text-right w-[14vw] min-w-[10vw]'>
                <div className='flex flex-col gap-1 items-end'>
                    <span className='text-xs'>
                        <span className='font-medium'>{formatWeightKg(grouping.totalWeightKg)}</span>
                    </span>
                </div>
            </td>
            <td className='py-3 px-4 w-[8vw] min-w-[6vw]'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => onViewDetail(grouping)}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const res = await axios.get(`/PrintRoutes/export-pdf/${grouping.groupId}`, { responseType: 'blob' });
                                const blob = new Blob([res.data], { type: 'application/pdf' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `Nhom-${grouping.groupCode}-${formatDate(grouping.groupDate)}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                window.URL.revokeObjectURL(url);
                            } catch (err) {
                                console.error('Export PDF error', err);
                                alert('Không thể xuất PDF. Vui lòng thử lại.');
                            }
                        }}
                        className='text-green-600 hover:text-green-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xuất PDF'
                    >
                        <FileDown size={16} />
                    </button>
                    <button
                        onClick={() => onReassignDriver(grouping)}
                        className='text-orange-600 hover:text-orange-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Phân lại tài xế'
                    >
                        <UserCog size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default GroupingShow;
