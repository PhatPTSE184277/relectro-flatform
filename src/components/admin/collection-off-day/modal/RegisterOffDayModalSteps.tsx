'use client';

import React from 'react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { formatDate } from '@/utils/FormatDate';

type CompanyOption = any;
type PointItem = any;

export function RegisterOffDayStepCompanyPoints(props: {
  companies: CompanyOption[];
  companyId: string;
  selectedPointIds: string[];
  points: PointItem[];
  loadingPoints: boolean;
  selectAllRef: React.RefObject<HTMLInputElement | null>;
  allSelected: boolean;
  onChangeCompanyId: (companyId: string) => void | Promise<void>;
  onToggleSelectAll: () => void;
  onToggleSelect: (pointId: string) => void;
  getCompanyLabel: (company: any) => string;
  getCompanyId: (company: any) => string;
  getPointId: (point: any) => string;
  getPointLabel: (point: any) => string;
  getPointAddress: (point: any) => string;
}) {
  const {
    companies,
    companyId,
    selectedPointIds,
    points,
    loadingPoints,
    selectAllRef,
    allSelected,
    onChangeCompanyId,
    onToggleSelectAll,
    onToggleSelect,
    getCompanyLabel,
    getCompanyId,
    getPointId,
    getPointLabel,
    getPointAddress
  } = props;

  return (
    <div className='space-y-4'>
      <div className='flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between'>
        <div className='w-full lg:w-96'>
          <SearchableSelect
            options={companies}
            value={companyId}
            onChange={(v) => onChangeCompanyId(String(v))}
            getLabel={getCompanyLabel}
            getValue={getCompanyId}
            placeholder='Chọn công ty...'
          />
        </div>
        <div className='text-sm text-gray-600'>
          Đã chọn <span className='font-semibold'>{selectedPointIds.length}</span> kho
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            <div className='overflow-hidden'>
              <div className='max-h-[58vh] overflow-y-auto'>
                <table className='w-full text-sm text-gray-800 table-fixed'>
                  <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                    <tr>
                      <th className='py-3 px-4 text-center w-16'>
                        <input
                          ref={selectAllRef}
                          type='checkbox'
                          checked={allSelected}
                          onChange={onToggleSelectAll}
                          className='w-4 h-4 cursor-pointer accent-primary-600'
                          disabled={loadingPoints || points.length === 0}
                        />
                      </th>
                      <th className='py-3 px-4 text-center w-20'>STT</th>
                      <th className='py-3 px-4 text-left w-106'>Kho / Điểm thu gom</th>
                      <th className='py-3 px-4 text-left '>Địa chỉ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingPoints ? (
                      Array.from({ length: 8 }).map((_, idx) => (
                        <tr key={idx} className='border-b border-primary-100'>
                          <td className='py-3 px-4 text-center'>
                            <div className='w-4 h-4 bg-gray-200 rounded mx-auto animate-pulse' />
                          </td>
                          <td className='py-3 px-4 text-center'>
                            <span className='w-7 h-7 rounded-full bg-gray-200 opacity-30 flex items-center justify-center mx-auto animate-pulse' />
                          </td>
                          <td className='py-3 px-4'>
                            <div className='h-4 bg-gray-200 rounded w-72 animate-pulse' />
                          </td>
                          <td className='py-3 px-4'>
                            <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
                          </td>
                        </tr>
                      ))
                    ) : points.length === 0 ? (
                      <tr>
                        <td colSpan={4} className='py-10 text-center text-gray-400'>
                          {companyId ? 'Không có kho để chọn' : 'Vui lòng chọn công ty'}
                        </td>
                      </tr>
                    ) : (
                      points.map((p, idx) => {
                        const id = getPointId(p);
                        const checked = selectedPointIds.includes(String(id));
                        const isLast = idx === points.length - 1;
                        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                        return (
                          <tr key={id || idx} className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
                            <td className='py-3 px-4 text-center'>
                              <input
                                type='checkbox'
                                checked={checked}
                                onChange={() => onToggleSelect(String(id))}
                                className='w-4 h-4 cursor-pointer accent-primary-600'
                              />
                            </td>
                            <td className='py-3 px-4 text-center'>
                              <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                {idx + 1}
                              </span>
                            </td>
                            <td className='py-3 px-4 font-medium text-gray-900 truncate' title={getPointLabel(p)}>
                              {getPointLabel(p)}
                            </td>
                            <td className='py-3 px-4 text-gray-600 truncate' title={getPointAddress(p)}>
                              {getPointAddress(p)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterOffDayStepDatesReason(props: {
  pickedDate: string;
  selectedDates: string[];
  reason: string;
  canSubmit: boolean;
  onPickedDateChange: (date: string) => void;
  onRemoveDate: (ymd: string) => void;
  onReasonChange: (value: string) => void;
}) {
  const {
    pickedDate,
    selectedDates,
    reason,
    canSubmit,
    onPickedDateChange,
    onRemoveDate,
    onReasonChange
  } = props;

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='font-semibold text-gray-900'>Đăng ký lịch nghỉ</h3>
            <div className='text-sm text-gray-500 mt-1'>Chọn 1 hoặc nhiều ngày nghỉ</div>
          </div>

          <div className='flex items-center justify-end gap-2'>
            <div className='min-w-0'>
              <CustomDatePicker
                value={pickedDate}
                onChange={onPickedDateChange}
                placeholder='Chọn ngày...'
                dropdownAlign='right'
                dropdownPortal
                dropdownZIndex={1000}
              />
            </div>

            {/* add button removed per design */}
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-gray-700'>Ngày đã chọn</div>
            <div className='text-xs text-gray-500'>{selectedDates.length} ngày</div>
          </div>

          <div className='mt-3 flex flex-wrap gap-2'>
            {selectedDates.length === 0 ? (
              <div className='text-sm text-gray-400'>Chưa chọn ngày</div>
            ) : (
              selectedDates.map((d) => (
                <div
                  key={d}
                  className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-primary-600 text-white'
                  title={d}
                >
                  <span>{formatDate(d) || d}</span>
                  <button
                    type='button'
                    onClick={() => onRemoveDate(d)}
                    aria-label={`Xóa ${d}`}
                    className='ml-2 text-white hover:text-red-200'
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-4'>
        <h3 className='font-semibold text-gray-900 mb-3'>Lý do (tuỳ chọn)</h3>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder='Nhập lý do...'
          className='w-full min-h-40 rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-primary-200'
        />
      </div>

      {!canSubmit && (
        <div className='text-sm text-gray-500'>
          Vui lòng chọn ít nhất <span className='font-semibold'>1 ngày</span>
        </div>
      )}
    </div>
  );
}
