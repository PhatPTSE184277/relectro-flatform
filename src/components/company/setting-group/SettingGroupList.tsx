import React, { useRef, useEffect } from 'react';
import SettingGroupShow from './SettingGroupShow';
import SettingGroupTableSkeleton from './SettingGroupTableSkeleton';

interface SettingGroupListProps {
    points: any[];
    loading: boolean;
    onEdit: (point: any) => void;
}

const SettingGroupList: React.FC<SettingGroupListProps> = ({
    points,
    loading,
    onEdit
}) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    // Assume parent handles pagination, so scroll to top on points change
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [points]);

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                <tr>
                                    <th className='py-3 px-4 text-center' style={{ width: '60px' }}>STT</th>
                                    <th className='py-3 px-4 text-left' style={{ width: '240px' }}>Tên điểm thu gom</th>
                                    <th className='py-3 px-4 text-center' style={{ width: '180px' }}>Thời gian phục vụ (phút)</th>
                                    <th className='py-3 px-4 text-center' style={{ width: '200px' }}>Thời gian di chuyển (phút)</th>
                                    <th className='py-3 px-4 text-center' style={{ width: '120px' }}>Hành động</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='max-h-96 overflow-y-auto' ref={bodyRef}>
                        <table className='min-w-full text-sm text-gray-800' style={{ tableLayout: 'fixed' }}>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <SettingGroupTableSkeleton key={idx} />
                                    ))
                                ) : points.length > 0 ? (
                                    points.map((point, idx) => (
                                        <SettingGroupShow
                                            key={point.smallPointId}
                                            point={point}
                                            onEdit={() => onEdit(point)}
                                            isLast={idx === points.length - 1}
                                            index={idx}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className='text-center py-8 text-gray-400'>
                                            Không có điểm thu gom nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingGroupList;
