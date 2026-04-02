'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import SearchBox from '@/components/ui/SearchBox';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { getTodayString } from '@/utils/getDayString';
import { filterCollectionCompanies, filterSmallCollectionPoints } from '@/services/admin/TrackingService';
import { cancelCollectionOffDay, getAllCollectionOffDays, registerCollectionOffDay } from '@/services/admin/CollectionOffDayService';
import CollectionOffDayList, { type CollectionOffDayItem } from '@/components/admin/collection-off-day/CollectionOffDayList';
import CancelOffDayModal from '@/components/admin/collection-off-day/modal/CancelOffDayModal';
import RegisterOffDayModal from '@/components/admin/collection-off-day/modal/RegisterOffDayModal';

type FilterState = {
  page: number;
  limit: number;
  companyId?: string;
  smallCollectionPointId?: string;
  date?: string;
};

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

const toYmd = (raw?: string): string => {
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

const AdminCollectionOffDayPage: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [loadingOffDays, setLoadingOffDays] = useState(false);

  const [items, setItems] = useState<CollectionOffDayItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'error',
    message: ''
  });

  const [filter, setFilterState] = useState<FilterState>({
    page: 1,
    limit: 10,
    companyId: undefined,
    smallCollectionPointId: undefined,
    date: getTodayString()
  });

  const [cancelOpen, setCancelOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [selectedCancelItem, setSelectedCancelItem] = useState<CollectionOffDayItem | null>(null);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  const setFilter = useCallback((next: Partial<FilterState>) => {
    setFilterState((prev) => {
      const merged = { ...prev, ...next };
      const hasRealChange = Object.entries(next).some(([key, value]) => {
        return prev[key as keyof FilterState] !== value;
      });
      return hasRealChange ? merged : prev;
    });
  }, []);

  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true);
    try {
      const data = await filterCollectionCompanies({ page: 1, limit: 100 });
      const list = Array.isArray(data) ? data : (data?.data || []);
      setCompanies(Array.isArray(list) ? list : []);
    } catch {
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  const fetchPoints = useCallback(async (companyId?: string) => {
    if (!companyId) {
      setPoints([]);
      return;
    }
    setLoadingPoints(true);
    try {
      const data = await filterSmallCollectionPoints({ page: 1, limit: 200, companyId });
      const list = Array.isArray(data) ? data : (data?.data || []);
      setPoints(Array.isArray(list) ? list : []);
    } catch {
      setPoints([]);
    } finally {
      setLoadingPoints(false);
    }
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  // Auto-select first company when loaded
  useEffect(() => {
    if (companies.length === 0 || filter.companyId) return;
    const firstCompanyId = getCompanyId(companies[0]);
    if (firstCompanyId) {
      setFilter({ companyId: firstCompanyId, page: 1, smallCollectionPointId: undefined });
    }
  }, [companies, filter.companyId, setFilter]);

  // Load points when company changes
  useEffect(() => {
    void fetchPoints(filter.companyId);
  }, [fetchPoints, filter.companyId]);

  // Auto-select first point when points loaded
  useEffect(() => {
    if (!filter.companyId || loadingPoints || points.length === 0) return;

    const currentPointId = String(filter.smallCollectionPointId || '');
    const hasValid = points.some((p) => getPointId(p) === currentPointId);

    if (!hasValid) {
      const firstPointId = getPointId(points[0]);
      if (firstPointId) {
        setFilter({ smallCollectionPointId: firstPointId, page: 1 });
      }
    }
  }, [filter.companyId, filter.smallCollectionPointId, loadingPoints, points, setFilter]);

  const normalizedCompanies = useMemo(() => {
    return companies.map((c) => ({
      id: getCompanyId(c),
      name: getCompanyLabel(c),
      address: c?.address || c?.addressLine || c?.street || '',
      city: c?.city || c?.province || c?.district || ''
    }));
  }, [companies]);

  const normalizeOffDayItem = useCallback((raw: any, stt: number): CollectionOffDayItem => {
    const companyId = String(raw?.companyId || raw?.collectionCompanyId || raw?.id || filter.companyId || '');
    const pointId = String(
      raw?.smallCollectionPointId || raw?.smallCollectionPointsId || raw?.pointId || raw?.smallPointId || ''
    );
    const date = String(raw?.date || raw?.offDate || raw?.dayOff || raw?.offDay || '');
    const reason = String(raw?.reason || raw?.description || raw?.note || '');

    const companyName = String(
      raw?.companyName ||
      raw?.collectionCompanyName ||
      raw?.name ||
      normalizedCompanies.find((c: any) => String(c.id) === String(companyId))?.name ||
      ''
    );

    const matchedPoint = points.find((p) => getPointId(p) === String(pointId));
    const pointName = String(
      raw?.pointName ||
      raw?.smallCollectionPointName ||
      raw?.namePoint ||
      (matchedPoint ? getPointLabel(matchedPoint) : '')
    );

    return {
      key: String(raw?.id || raw?.offDayId || raw?.collectionOffDayId || `${companyId}-${pointId}-${toYmd(date)}-${stt}`),
      stt,
      companyId,
      companyName,
      pointId,
      pointName,
      date: date,
      reason
    };
  }, [filter.companyId, normalizedCompanies, points]);

  const fetchOffDays = useCallback(async (snapshot: FilterState) => {
    if (!snapshot.companyId || !snapshot.smallCollectionPointId) {
      setItems([]);
      setTotalPages(1);
      return;
    }

    setLoadingOffDays(true);

    const requestKey = `${snapshot.companyId}|${snapshot.smallCollectionPointId}|${snapshot.date || ''}|${snapshot.page}|${snapshot.limit}`;

    try {
      const payload = await getAllCollectionOffDays({
        companyId: snapshot.companyId,
        smallCollectionPointId: snapshot.smallCollectionPointId,
        date: snapshot.date ? toYmd(snapshot.date) : undefined,
        page: snapshot.page,
        limit: snapshot.limit
      });

      const list = Array.isArray(payload) ? payload : (payload?.data || []);
      const pages = Array.isArray(payload) ? 1 : (payload?.totalPages || 1);

      // Guard against stale response
      const currentKey = `${filter.companyId}|${filter.smallCollectionPointId}|${filter.date || ''}|${filter.page}|${filter.limit}`;
      if (requestKey !== currentKey) return;

      const baseIndex = (snapshot.page - 1) * snapshot.limit;
      const mapped = (Array.isArray(list) ? list : []).map((row: any, idx: number) =>
        normalizeOffDayItem(row, baseIndex + idx + 1)
      );

      setItems(mapped);
      setTotalPages(Number(pages) || 1);
    } catch {
      setItems([]);
      setTotalPages(1);
    } finally {
      const currentKey = `${filter.companyId}|${filter.smallCollectionPointId}|${filter.date || ''}|${filter.page}|${filter.limit}`;
      if (requestKey === currentKey) {
        setLoadingOffDays(false);
      }
    }
  }, [filter.companyId, filter.smallCollectionPointId, filter.date, filter.page, filter.limit, normalizeOffDayItem]);

  useEffect(() => {
    void fetchOffDays(filter);
  }, [fetchOffDays, filter]);

  const visibleItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((x) => {
      const hay = `${x.companyName} ${x.pointName} ${x.date} ${x.reason}`.toLowerCase();
      return hay.includes(keyword);
    });
  }, [items, searchKeyword]);

  const handleCompanyChange = useCallback((companyId: string) => {
    setFilter({ companyId, smallCollectionPointId: undefined, page: 1 });
  }, [setFilter]);

  const handlePointChange = useCallback((smallCollectionPointId: string) => {
    setFilter({ smallCollectionPointId, page: 1 });
  }, [setFilter]);

  const handlePageChange = useCallback((page: number) => {
    setFilter({ page });
  }, [setFilter]);

  const handleDateChange = useCallback((date: string) => {
    setFilter({ date, page: 1 });
  }, [setFilter]);

  const handleCancelClick = useCallback((item: CollectionOffDayItem) => {
    setSelectedCancelItem(item);
    setCancelOpen(true);
  }, []);

  const handleCloseCancel = useCallback(() => {
    if (canceling) return;
    setCancelOpen(false);
    setSelectedCancelItem(null);
  }, [canceling]);

  const handleConfirmCancel = useCallback(async () => {
    if (!selectedCancelItem) return;

    const companyId = selectedCancelItem.companyId || filter.companyId;
    const pointId = selectedCancelItem.pointId || filter.smallCollectionPointId;
    const date = toYmd(selectedCancelItem.date);

    if (!companyId || !pointId || !date) {
      setToast({ open: true, type: 'error', message: 'Thiếu thông tin để hủy lịch nghỉ' });
      return;
    }

    setCanceling(true);
    try {
      await cancelCollectionOffDay({ companyId, pointId, date });
      setToast({ open: true, type: 'success', message: 'Đã hủy lịch nghỉ thành công' });
      setCancelOpen(false);
      setSelectedCancelItem(null);
      await fetchOffDays({ ...filter, page: 1 });
      setFilter({ page: 1 });
    } catch (err: any) {
      setToast({
        open: true,
        type: 'error',
        message: err?.response?.data?.message || 'Không thể hủy lịch nghỉ'
      });
    } finally {
      setCanceling(false);
    }
  }, [fetchOffDays, filter, selectedCancelItem, setFilter]);


  const handleOpenRegister = useCallback(() => {
    setRegisterOpen(true);
  }, []);

  const handleCloseRegister = useCallback(() => {
    if (registering) return;
    setRegisterOpen(false);
  }, [registering]);

  const handleConfirmRegister = useCallback(async (data: { companyId: string; selectedPointIds: string[]; selectedDates: string[]; reason?: string }) => {
    if (!data.companyId) {
      setToast({ open: true, type: 'error', message: 'Vui lòng chọn công ty' });
      return;
    }

    if (!data.selectedPointIds?.length || !data.selectedDates?.length) {
      setToast({ open: true, type: 'error', message: 'Vui lòng chọn ít nhất 1 kho và 1 ngày' });
      return;
    }

    setRegistering(true);
    try {
      await registerCollectionOffDay({
        companyId: String(data.companyId),
        smallCollectionPointIds: data.selectedPointIds.map(String),
        offDates: data.selectedDates,
        reason: data.reason
      });

      setToast({ open: true, type: 'success', message: 'Đã đăng ký lịch nghỉ thành công' });
      setRegisterOpen(false);

      await fetchOffDays({ ...filter, page: 1 });
      setFilter({ page: 1 });
    } catch (err: any) {
      setToast({
        open: true,
        type: 'error',
        message: err?.response?.data?.message || 'Không thể đăng ký lịch nghỉ'
      });
    } finally {
      setRegistering(false);
    }
  }, [fetchOffDays, filter, setFilter]);

  const hasCompany = Boolean(filter.companyId);
  const hasPoint = Boolean(filter.smallCollectionPointId);

  return (
    <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col gap-2 mb-4 lg:flex-row lg:items-center lg:gap-6'>
        <div className='flex items-center gap-3 shrink-0'>
          <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
            <CalendarDays className='text-white' size={20} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Lịch nghỉ thu gom</h1>
        </div>

        <div className='flex-1 flex flex-wrap lg:flex-nowrap items-center gap-3 lg:justify-end'>
          <div className='w-full lg:w-lg lg:min-w-sm lg:max-w-lg lg:ml-auto flex items-center gap-3'>
            <div className='w-full'>
              <SearchBox
                value={searchKeyword}
                onChange={setSearchKeyword}
                placeholder='Tìm theo công ty / điểm / ngày...'
              />
            </div>
            <div className='min-w-fit'>
              <CustomDatePicker
                value={filter.date || ''}
                onChange={handleDateChange}
                placeholder='Chọn ngày...'
                dropdownAlign='right'
              />
            </div>
          </div>

          <button
            type='button'
            className='flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer whitespace-nowrap'
            onClick={handleOpenRegister}
            disabled={loadingCompanies}
            title='Đăng ký lịch nghỉ'
          >
            <Plus size={18} />
            Đăng ký lịch nghỉ
          </button>
        </div>
      </div>

      <div className='mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4'>
        <div className='flex gap-3 w-full sm:w-auto justify-end'>
          <div className='w-80'>
            <SearchableSelect
              options={normalizedCompanies}
              value={filter.companyId ?? ''}
              onChange={handleCompanyChange}
              getLabel={(c: any) => c.name}
              getValue={(c: any) => String(c.id)}
              placeholder={loadingCompanies ? 'Đang tải công ty...' : 'Chọn công ty...'}
              disabled={loadingCompanies}
            />
          </div>
          <div className='w-80'>
            <SearchableSelect
              options={points}
              value={filter.smallCollectionPointId ?? ''}
              onChange={handlePointChange}
              getLabel={getPointLabel}
              getValue={getPointId}
              placeholder={loadingPoints ? 'Đang tải điểm...' : 'Chọn điểm thu gom...'}
              disabled={!filter.companyId || loadingPoints}
            />
          </div>
        </div>
      </div>

      {!hasCompany ? (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
          Vui lòng chọn công ty để xem lịch nghỉ
        </div>
      ) : !hasPoint ? (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
          Vui lòng chọn điểm thu gom để xem lịch nghỉ
        </div>
      ) : (
        <div className='mb-6'>
          <CollectionOffDayList
            items={visibleItems}
            loading={loadingOffDays}
            onCancelClick={handleCancelClick}
          />
        </div>
      )}

      <div className='flex justify-center'>
        <Pagination page={filter.page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <CancelOffDayModal
        open={cancelOpen}
        loading={canceling}
        item={selectedCancelItem}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
      />

      <RegisterOffDayModal
        open={registerOpen}
        loading={registering}
        companies={normalizedCompanies}
        defaultCompanyId={filter.companyId ? String(filter.companyId) : undefined}
        onClose={handleCloseRegister}
        onConfirm={handleConfirmRegister}
      />

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </div>
  );
};

export default AdminCollectionOffDayPage;
