'use client';

import React from 'react';
import { formatDate } from '@/utils/FormatDate';
import type { CollectionOffDayItem } from '../CollectionOffDayList';
import SummaryCard from '@/components/ui/SummaryCard';
import { Building2, MapPin, Calendar } from 'lucide-react';

interface Props {
  open: boolean;
  loading?: boolean;
  item: CollectionOffDayItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelOffDayModal: React.FC<Props> = ({ open, loading = false, item, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

      <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn' style={{maxWidth: 1100}}>
        <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-red-50 to-primary-100'>
          <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>Hủy lịch nghỉ</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-primary-600 text-3xl font-light cursor-pointer'
            disabled={loading}
          >
            &times;
          </button>
        </div>

        <div className='p-6 flex-1 overflow-y-auto bg-gray-50 space-y-4'>
          <div className='text-gray-700 text-base'>
            Bạn có chắc chắn muốn <span className='font-semibold text-red-600'>hủy</span> lịch nghỉ này không?
          </div>

          {item && (
            <SummaryCard
              singleRow={false}
              items={[
                { icon: <Building2 className='w-4 h-4 text-primary-500' />, label: 'Công ty', value: item.companyName || 'N/A' },
                { icon: <MapPin className='w-4 h-4 text-primary-500' />, label: 'Điểm', value: item.pointName || 'N/A' },
                { icon: <Calendar className='w-4 h-4 text-primary-500' />, label: 'Ngày nghỉ', value: formatDate(item.date) || item.date || '' }
              ]}
            />
          )}
        </div>

        <div className='flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50'>
          <button
            onClick={onConfirm}
            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CancelOffDayModal;
