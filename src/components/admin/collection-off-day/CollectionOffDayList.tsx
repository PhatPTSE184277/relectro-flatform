'use client';

import React from 'react';
import CollectionOffDayRow from './CollectionOffDayRow';
import CollectionOffDayRowSkeleton from './CollectionOffDayRowSkeleton';

export interface CollectionOffDayItem {
  key: string;
  stt: number;
  companyId: string;
  companyName: string;
  pointId: string;
  pointName: string;
  date: string;
  reason?: string;
}

interface CollectionOffDayListProps {
  items: CollectionOffDayItem[];
  loading?: boolean;
  onCancelClick: (item: CollectionOffDayItem) => void;
}

const CollectionOffDayList: React.FC<CollectionOffDayListProps> = ({ items, loading = false, onCancelClick }) => {
  const rows = items ?? [];

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
      <div className='overflow-x-auto w-full'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <div className='max-h-[70vh] overflow-y-auto w-full'>
              <table className='w-full text-sm text-gray-800 table-fixed'>
                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                    <tr>
                    <th className='py-3 px-4 text-center w-20'>STT</th>
                    <th className='py-3 px-4 text-left w-[260px]'>Công ty</th>
                    <th className='py-3 px-4 text-left w-[260px]'>Điểm thu gom</th>
                    <th className='py-3 px-4 text-center w-40 whitespace-nowrap'>Ngày nghỉ</th>
                    <th className='py-3 px-4 text-left'>Lý do</th>
                    <th className='py-3 px-4 text-center w-28'>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => <CollectionOffDayRowSkeleton key={idx} />)
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className='py-8 text-center text-gray-400'>
                        Không có lịch nghỉ
                      </td>
                    </tr>
                  ) : (
                    rows.map((item, idx) => (
                      <CollectionOffDayRow
                        key={item.key || idx}
                        item={item}
                        index={idx}
                        isLast={idx === rows.length - 1}
                        onCancel={() => onCancelClick(item)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionOffDayList;
