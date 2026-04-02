'use client';

import React, { useMemo, useState } from 'react';
import { X, Warehouse, Building2, MapPin } from 'lucide-react';
import { WarehouseLoadThresholdConfig } from '@/services/admin/SystemConfigService';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import SummaryCard from '@/components/ui/SummaryCard';

interface EditLoadThresholdModalProps {
  open: boolean;
  config: WarehouseLoadThresholdConfig | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (smallCollectionPointId: string, threshold: number) => Promise<void> | void;
}

const getSmallCollectionPointId = (config: WarehouseLoadThresholdConfig | null): string => {
  if (!config) return '';
  return String(
    config.smallCollectionPointId ||
      config.scpId ||
      config.smallPointId ||
      config.pointId ||
      config.referenceId ||
      ''
  );
};

const normalizePercent = (rawValue: string): number => {
  const num = Number(rawValue);
  if (!Number.isFinite(num)) return 0;
  if (num <= 1) return Math.round(num * 10000) / 100;
  return num;
};

const EditLoadThresholdModal: React.FC<EditLoadThresholdModalProps> = ({
  open,
  config,
  loading = false,
  onClose,
  onConfirm
}) => {
  const [threshold, setThreshold] = useState<number>(() => normalizePercent(String(config?.value || '0')));

  const scpId = useMemo(() => getSmallCollectionPointId(config), [config]);

  if (!open || !config) return null;

  const canSubmit = !loading && !!scpId && Number.isFinite(threshold) && threshold > 0 && threshold <= 100;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />

      <div
        className='relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] animate-fadeIn'
        style={{ maxWidth: 1100 }}
      >
        <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
          <div className='flex items-center gap-2'>
            <Warehouse className='w-5 h-5 text-primary-600' />
            <h2 className='text-2xl font-bold text-gray-900'>Cập nhật ngưỡng tải mỗi kho</h2>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
            aria-label='Đóng'
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className='p-6 space-y-4'>
          <SummaryCard
            label={
              <span className='flex items-center gap-2'>
                <Warehouse className='w-4 h-4 text-primary-500' />
                Thông tin kho
              </span>
            }
            singleRow
            items={[
              { icon: <Building2 className='w-4 h-4 text-primary-500' />, label: 'Công ty', value: config.companyName || 'N/A' },
              { icon: <MapPin className='w-4 h-4 text-primary-500' />, label: 'Kho', value: config.scpName || 'N/A' }
            ]}
          />

          {!scpId && (
            <div className='text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>
              Không tìm thấy `smallCollectionPointId` trong dữ liệu cấu hình để cập nhật.
            </div>
          )}

          <div className='flex items-center gap-6'>
            <label className='text-sm font-medium text-gray-700 min-w-[120px]'>Ngưỡng tải (%)</label>
            <div className='flex items-center gap-2'>
              <CustomNumberInput
                value={threshold}
                onChange={setThreshold}
                min={0}
                className='w-36 px-3 py-2 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
              <span className='text-sm text-gray-500'>Giá trị hợp lệ: 1 - 100</span>
            </div>
          </div>
        </div>

        <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
          <button
            onClick={() => onConfirm(scpId, threshold)}
            disabled={!canSubmit}
            className={`px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 flex items-center gap-2 ${
              canSubmit ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default EditLoadThresholdModal;
