'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CustomTimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
    dropdownAlign?: 'left' | 'right';
}

const pad2 = (n: number) => String(n).padStart(2, '0');

const parseTime = (time?: string): { hour: number; minute: number } | null => {
    if (!time) return null;
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
    if (!match) return null;
    return { hour: Number(match[1]), minute: Number(match[2]) };
};

const formatTime = (hour: number, minute: number) => `${pad2(hour)}:${pad2(minute)}`;

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
    value,
    onChange,
    placeholder = 'Chọn giờ',
    disabled = false,
    dropdownAlign = 'left'
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const parsed = useMemo(() => parseTime(value), [value]);
    const currentHour = parsed?.hour ?? 0;
    const currentMinute = parsed?.minute ?? 0;
    const [isOpen, setIsOpen] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const [dropdownHeight, setDropdownHeight] = useState<number>(0);
    const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedInsideAnchor = !!wrapperRef.current?.contains(target);
            const clickedInsideDropdown = !!dropdownRef.current?.contains(target);

            if (!clickedInsideAnchor && !clickedInsideDropdown) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const updateRect = () => {
            const rect = wrapperRef.current?.getBoundingClientRect() ?? null;
            setAnchorRect(rect);
        };

        updateRect();

        const handleScrollOrResize = () => updateRect();
        window.addEventListener('resize', handleScrollOrResize);
        document.addEventListener('scroll', handleScrollOrResize, true);

        return () => {
            window.removeEventListener('resize', handleScrollOrResize);
            document.removeEventListener('scroll', handleScrollOrResize, true);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (!anchorRect) return;

        const raf = window.requestAnimationFrame(() => {
            const height = dropdownRef.current?.getBoundingClientRect().height ?? 0;
            setDropdownHeight(height);

            if (height <= 0) return;

            const gap = 8;
            const shouldPlaceTop = anchorRect.bottom + gap + height > window.innerHeight;
            setPlacement(shouldPlaceTop ? 'top' : 'bottom');
        });

        return () => window.cancelAnimationFrame(raf);
    }, [isOpen, anchorRect]);

    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
    const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

    const displayValue = parsed ? formatTime(parsed.hour, parsed.minute) : '';

    const commit = (nextHour: number, nextMinute: number) => {
        onChange(formatTime(nextHour, nextMinute));
    };

    const canUseDOM = typeof document !== 'undefined';

    const dropdownGap = 8;
    const dropdownWidth = useMemo(() => {
        const baseWidth = anchorRect?.width ?? 0;
        if (!baseWidth) return undefined;
        return Math.min(baseWidth, 420);
    }, [anchorRect?.width]);

    const dropdownLeft = useMemo(() => {
        if (!anchorRect) return undefined;
        if (!dropdownWidth) return undefined;

        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : Number.POSITIVE_INFINITY;
        const maxLeft = Math.max(0, viewportWidth - dropdownWidth);

        if (dropdownAlign === 'right') {
            const computed = anchorRect.right - dropdownWidth;
            return Math.min(Math.max(0, computed), maxLeft);
        }
        return Math.min(Math.max(0, anchorRect.left), maxLeft);
    }, [anchorRect, dropdownAlign, dropdownWidth]);

    const dropdownTop = useMemo(() => {
        if (!anchorRect) return undefined;

        if (placement === 'top') {
            const height = dropdownHeight || 0;
            return Math.max(0, anchorRect.top - dropdownGap - height);
        }
        return anchorRect.bottom + dropdownGap;
    }, [anchorRect, dropdownHeight, placement]);

    const dropdownNode =
        isOpen &&
        !disabled &&
        anchorRect &&
        dropdownLeft !== undefined &&
        dropdownTop !== undefined
        && canUseDOM
            ? createPortal(
                  <div
                      ref={dropdownRef}
                      className='fixed bg-white border border-primary-100 rounded-xl overflow-hidden z-[60] animate-slide-up shadow-2xl'
                      style={{
                          top: dropdownTop,
                          left: dropdownLeft,
                          width: dropdownWidth ?? anchorRect.width,
                          maxWidth: 420
                      }}
                  >
                      <div className='p-3 border-b border-primary-100 bg-gray-50 flex items-center justify-between'>
                          <div className='text-sm font-semibold text-gray-700'>Chọn giờ</div>
                          <div className='text-sm font-semibold text-primary-700 tabular-nums'>
                              {formatTime(currentHour, currentMinute)}
                          </div>
                      </div>

                      <div className='grid grid-cols-2 gap-2 p-3'>
                          <div className='border border-primary-100 rounded-lg overflow-hidden'>
                              <div className='px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-primary-100'>
                                  Giờ
                              </div>
                              <div className='max-h-56 overflow-y-auto'>
                                  {hours.map((h) => (
                                      <button
                                          key={h}
                                          type='button'
                                          onClick={() => {
                                              commit(h, currentMinute);
                                          }}
                                          className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                                              h === currentHour
                                                  ? 'bg-linear-to-r from-primary-500 to-primary-400 text-white'
                                                  : 'text-gray-700 hover:bg-primary-50'
                                          }`}
                                      >
                                          {pad2(h)}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className='border border-primary-100 rounded-lg overflow-hidden'>
                              <div className='px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-primary-100'>
                                  Phút
                              </div>
                              <div className='max-h-56 overflow-y-auto'>
                                  {minutes.map((m) => (
                                      <button
                                          key={m}
                                          type='button'
                                          onClick={() => {
                                              commit(currentHour, m);
                                          }}
                                          className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                                              m === currentMinute
                                                  ? 'bg-linear-to-r from-primary-500 to-primary-400 text-white'
                                                  : 'text-gray-700 hover:bg-primary-50'
                                          }`}
                                      >
                                          {pad2(m)}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className='flex justify-end p-3 border-t border-primary-100 bg-white'>
                          <button
                              type='button'
                              onClick={() => setIsOpen(false)}
                              className='px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition cursor-pointer'
                          >
                              Xong
                          </button>
                      </div>
                  </div>,
                  document.body
              )
            : null;

    return (
        <div className='relative' ref={wrapperRef}>
            <button
                type='button'
                disabled={disabled}
                onClick={() => {
                    if (disabled) return;
                    setIsOpen((prev) => {
                        const next = !prev;
                        if (next) {
                            const rect = wrapperRef.current?.getBoundingClientRect() ?? null;
                            setAnchorRect(rect);
                        }
                        return next;
                    });
                }}
                className={`w-full h-12 cursor-pointer flex items-center justify-between transition-all duration-300 bg-white border border-primary-200 rounded-xl px-4 shadow-sm ${
                    isOpen ? 'ring-2 ring-primary-400 border-primary-400' : ''
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                <span className={(displayValue ? 'text-gray-900' : 'text-gray-400') + ' text-center w-full truncate'}>
                    {displayValue || placeholder}
                </span>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
                        <path
                            d='M6 8l4 4 4-4'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='text-primary-400'
                        />
                    </svg>
                </div>
            </button>

            {dropdownNode}
        </div>
    );
};

export default CustomTimePicker;
