'use client';

import { useEffect, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { useAutoGroupingContext } from '@/contexts/collection-point/AutoGroupingContext';
import AutoGroupingCard from '@/components/collection-point/auto-grouping/AutoGroupingCard';
import AutoGroupingSettingsModal from '@/components/collection-point/auto-grouping/modal/AutoGroupingSettingsModal';
import { AutoGroupingSettings } from '@/services/collection-point/AutoGroupingService';

const defaultDraft: AutoGroupingSettings = {
  collectionUnitId: '',
  isEnabled: false,
  scheduleTime: '00:00',
  loadThresholdPercent: 0,
};

export default function AutoGroupingPage() {
  const { settings, loading, saving, error, fetchSettings, saveSettings } = useAutoGroupingContext();
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<AutoGroupingSettings>(defaultDraft);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const openModal = () => {
    setDraft({
      collectionUnitId: String(settings?.collectionUnitId || ''),
      isEnabled: Boolean(settings?.isEnabled ?? false),
      scheduleTime: String(settings?.scheduleTime || '00:00'),
      loadThresholdPercent: Number(settings?.loadThresholdPercent ?? 0),
    });
    setShowModal(true);
  };

  return (
    <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
            <Settings2 className='text-white' size={20} />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Tự động phân xe
            </h1>
          </div>
        </div>
        <button
          type='button'
          onClick={openModal}
          disabled={loading || saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium shadow-sm ${
            loading || saving
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-primary-300 text-primary-600 hover:bg-primary-50'
          }`}
        >
          Chỉnh sửa cấu hình
        </button>
      </div>

      <AutoGroupingCard settings={settings} loading={loading} saving={saving} onEdit={openModal} />

      {error && (
        <div className='mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4'>
          {error}
        </div>
      )}

      <AutoGroupingSettingsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async (payload) => {
          await saveSettings(payload);
          setShowModal(false);
        }}
        value={draft}
        onChange={setDraft}
        loading={saving}
      />
    </div>
  );
}
