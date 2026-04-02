'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, X } from 'lucide-react';
import { filterSmallCollectionPoints } from '@/services/admin/TrackingService';
import {
  RegisterOffDayStepCompanyPoints,
  RegisterOffDayStepDatesReason
} from '@/components/admin/collection-off-day/modal/RegisterOffDayModalSteps';

type CompanyOption = any;
type PointItem = any;

interface Props {
  open: boolean;
  loading?: boolean;
  companies: CompanyOption[];
  defaultCompanyId?: string;
  onClose: () => void;
  onConfirm: (payload: {
    companyId: string;
    selectedPointIds: string[];
    selectedDates: string[];
    reason?: string;
  }) => void;
}

const getCompanyId = (company: any): string => {
  return String(company?.id || company?.companyId || company?.collectionCompanyId || '');
};

const getCompanyLabel = (company: any): string => {
  return String(company?.name || company?.companyName || 'N/A');
};

const getPointId = (point: any): string => {
  return String(
    point?.smallCollectionPointId ||
      point?.smallCollectionPointsId ||
      point?.pointId ||
      point?.smallPointId ||
      point?.id ||
      ''
  );
};

const getPointLabel = (point: any): string => {
  return String(point?.name || point?.pointName || point?.smallCollectionPointName || 'N/A');
};

const getPointAddress = (point: any): string => {
  return String(
    point?.address || point?.addressLine || point?.street || point?.city || point?.province || point?.district || ''
  );
};

const normalizeYmd = (raw?: string): string => {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  const dt = new Date(trimmed);
  if (Number.isNaN(dt.getTime())) return trimmed;
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const RegisterOffDayModal: React.FC<Props> = ({
  open,
  loading = false,
  companies,
  defaultCompanyId,
  onClose,
  onConfirm
}) => {
  const [step, setStep] = useState(1); // 1: company/points, 2: dates/reason
  const [companyId, setCompanyId] = useState<string>('');
  const [points, setPoints] = useState<PointItem[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [pickedDate, setPickedDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const selectAllRef = useRef<HTMLInputElement>(null);
  const autoSelectAllNextPointsLoadRef = useRef(false);

  const pointIds = useMemo(() => points.map((p) => getPointId(p)).filter(Boolean), [points]);

  const allSelected = pointIds.length > 0 && selectedPointIds.length === pointIds.length;
  const someSelected = selectedPointIds.length > 0 && selectedPointIds.length < pointIds.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  useEffect(() => {
    if (!open) return;

    setStep(1);

    // Always initialize modal's company selection to the first company in the list
    // (do NOT sync with outside/default selection so modal is independent).
    const initialCompanyId = String(getCompanyId(companies?.[0]) || '');
    setCompanyId(initialCompanyId);

    setPoints([]);
    setLoadingPoints(false);
    setSelectedPointIds([]);
    setSelectedDates([]);
    setPickedDate('');
    setReason('');

    if (initialCompanyId) autoSelectAllNextPointsLoadRef.current = true;
  }, [open, companies]);

  // Reset internal state when modal is closed (open becomes false)
  useEffect(() => {
    if (open) return;

    setStep(1);
    setCompanyId('');
    setPoints([]);
    setLoadingPoints(false);
    setSelectedPointIds([]);
    setSelectedDates([]);
    setPickedDate('');
    setReason('');
  }, [open]);

  // Fetch points whenever company changes
  useEffect(() => {
    let ignore = false;

    const fetchPoints = async () => {
      if (!open || !companyId) {
        setPoints([]);
        return;
      }

      setLoadingPoints(true);
      try {
        const data = await filterSmallCollectionPoints({ page: 1, limit: 200, companyId });
        const list = Array.isArray(data) ? data : (data?.data || []);

        if (ignore) return;

        const normalizedList = Array.isArray(list) ? list : [];
        setPoints(normalizedList);

        const allIds = normalizedList.map((p: any) => getPointId(p)).filter(Boolean);

        if (autoSelectAllNextPointsLoadRef.current) {
          autoSelectAllNextPointsLoadRef.current = false;
          setSelectedPointIds(allIds);
          return;
        }

        // Otherwise, keep existing selection but drop invalid ids
        const validIds = new Set(allIds.map(String));
        setSelectedPointIds((prev) => prev.filter((id) => validIds.has(String(id))));
      } catch {
        if (!ignore) setPoints([]);
      } finally {
        if (!ignore) setLoadingPoints(false);
      }
    };

    void fetchPoints();
    return () => {
      ignore = true;
    };
  }, [open, companyId]);

  const handleCompanyChange = useCallback((nextCompanyId: string) => {
    autoSelectAllNextPointsLoadRef.current = true;
    setCompanyId(String(nextCompanyId));
    setPoints([]);
    setSelectedPointIds([]);
  }, []);

  const handleToggleSelect = useCallback((pointId: string) => {
    setSelectedPointIds((prev) => (prev.includes(pointId) ? prev.filter((id) => id !== pointId) : [...prev, pointId]));
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedPointIds((prev) => {
      const isAll = pointIds.length > 0 && prev.length === pointIds.length;
      return isAll ? [] : [...pointIds];
    });
  }, [pointIds]);

  const handleAddDate = useCallback((raw: string) => {
    const ymd = normalizeYmd(raw);
    if (!ymd) return;
    setSelectedDates((prev) => (prev.includes(ymd) ? prev : [...prev, ymd].sort()));
  }, []);

  const handleRemoveDate = useCallback((ymd: string) => {
    setSelectedDates((prev) => prev.filter((d) => d !== ymd));
  }, []);

  const handlePickedDateChange = useCallback(
    (date: string) => {
      setPickedDate(date);
      handleAddDate(date);
    },
    [handleAddDate]
  );

  const canContinue = Boolean(companyId) && selectedPointIds.length > 0;
  const canSubmit = canContinue && selectedDates.length > 0;

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      {/* Only close via X button */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'></div>

      <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh] min-h-[90vh]'>
        <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
          <div className='flex items-center gap-3'>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className='text-gray-600 hover:text-primary-600 transition cursor-pointer'
                disabled={loading}
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <span className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
              <CalendarDays className='text-white' size={20} />
            </span>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>{step === 1 ? 'Chọn công ty & kho' : 'Chọn ngày & lý do'}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed'
            disabled={loading}
            aria-label='Đóng'
          >
            <X size={28} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50'>
          {step === 1 ? (
            <RegisterOffDayStepCompanyPoints
              companies={companies}
              companyId={companyId}
              selectedPointIds={selectedPointIds}
              points={points}
              loadingPoints={loadingPoints}
              selectAllRef={selectAllRef}
              allSelected={allSelected}
              onChangeCompanyId={handleCompanyChange}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelect={handleToggleSelect}
              getCompanyLabel={getCompanyLabel}
              getCompanyId={getCompanyId}
              getPointId={getPointId}
              getPointLabel={getPointLabel}
              getPointAddress={getPointAddress}
            />
          ) : (
            <RegisterOffDayStepDatesReason
              pickedDate={pickedDate}
              selectedDates={selectedDates}
              reason={reason}
              canSubmit={canSubmit}
              onPickedDateChange={handlePickedDateChange}
              onRemoveDate={handleRemoveDate}
              onReasonChange={setReason}
            />
          )}
        </div>

        <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
          <div className='flex gap-3'>
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!canContinue || loading}
                className={`px-6 py-2.5 rounded-xl transition font-medium cursor-pointer ${
                  !canContinue || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                Tiếp tục
              </button>
            ) : (
              <button
                onClick={() =>
                  onConfirm({
                    companyId,
                    selectedPointIds,
                    selectedDates,
                    reason: reason.trim() ? reason.trim() : undefined
                  })
                }
                disabled={!canSubmit || loading}
                className={`px-6 py-2.5 rounded-xl transition font-medium cursor-pointer ${
                  !canSubmit || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterOffDayModal;
