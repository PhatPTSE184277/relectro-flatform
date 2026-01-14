import React, { useState, useRef, useEffect } from 'react';
import { IoChevronBack, IoChevronForward, IoChevronDown } from 'react-icons/io5';

interface CustomDatePickerProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    showIcon?: boolean;
    disabled?: boolean;
}

function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

const monthNames = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
];
const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    placeholder,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(value || '');
    const [currentMonth, setCurrentMonth] = useState<Date>(() => value ? parseLocalDate(value) : new Date());
    const [mode, setMode] = useState<'day' | 'month' | 'year'>('day');
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Năm hiển thị trong mode "year"
    const currentYear = currentMonth.getFullYear();
    const yearStart = Math.floor(currentYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => yearStart + i);

    useEffect(() => {
        if (value && value !== selectedDate) {
            const parsed = parseLocalDate(value);
            setSelectedDate(value);
            setCurrentMonth(parsed);
        } else if (!value && selectedDate) {
            setSelectedDate('');
            setCurrentMonth(new Date());
        }
    }, [value, selectedDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setMode('day');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const date = parseLocalDate(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    const handleDateSelect = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        setSelectedDate(dateString);
        onChange(dateString);
        setIsOpen(false);
        setMode('day');
    };

    const handleMonthSelect = (monthIdx: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(monthIdx);
            return newDate;
        });
        setMode('day');
    };

    const handleYearSelect = (year: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(year);
            return newDate;
        });
        setMode('month');
    };

    const navigateMonth = (direction: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const navigateYear = (direction: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(prev.getFullYear() + direction * 12);
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getFullYear() === today.getFullYear()
            && date.getMonth() === today.getMonth()
            && date.getDate() === today.getDate();
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        const selected = parseLocalDate(selectedDate);
        return date.getFullYear() === selected.getFullYear()
            && date.getMonth() === selected.getMonth()
            && date.getDate() === selected.getDate();
    };

    return (
        <div className="relative" ref={datePickerRef}>
            <div
                onClick={() => { if (!disabled) { setIsOpen(!isOpen); setMode('day'); } }}
                className={`h-12 flex items-center justify-between transition-all duration-300 bg-white border border-primary-200 rounded-xl px-4 shadow-sm ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${isOpen ? 'ring-2 ring-primary-400 border-primary-400' : ''}`}
            >
                <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedDate ? formatDisplayDate(selectedDate) : (placeholder || 'Chọn ngày')}
                </span>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <IoChevronDown size={20} className="text-primary-600" />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-xl overflow-hidden z-50 animate-slide-up shadow-2xl w-80">
                    {/* Header: chọn tháng/năm */}
                    <div className="p-3 border-b border-primary-100 bg-primary-50">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    if (mode === 'year') navigateYear(-1);
                                    else if (mode === 'month') setCurrentMonth(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
                                    else navigateMonth(-1);
                                }}
                                className="w-6 h-6 rounded-lg bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                            >
                                <IoChevronBack size={14} className="text-primary-600" />
                            </button>

                            <div className="text-center flex gap-2 items-center justify-center">
                                {mode === 'day' && (
                                    <button
                                        className="text-gray-900 font-semibold text-sm px-2 py-1 rounded hover:bg-primary-100"
                                        onClick={() => setMode('month')}
                                    >
                                        {monthNames[currentMonth.getMonth()]}
                                    </button>
                                )}
                                {mode !== 'year' && (
                                    <button
                                        className="text-primary-600 font-semibold text-sm px-2 py-1 rounded hover:bg-primary-100"
                                        onClick={() => setMode('year')}
                                    >
                                        {currentMonth.getFullYear()}
                                    </button>
                                )}
                                {mode === 'year' && (
                                    <span className="text-primary-600 font-semibold text-sm">
                                        {years[0]} - {years[years.length - 1]}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    if (mode === 'year') navigateYear(1);
                                    else if (mode === 'month') setCurrentMonth(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
                                    else navigateMonth(1);
                                }}
                                className="w-6 h-6 rounded-lg bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                            >
                                <IoChevronForward size={14} className="text-primary-600" />
                            </button>
                        </div>
                    </div>

                    {/* Body: chọn ngày/tháng/năm */}
                    <div className="p-3 bg-white">
                        {mode === 'day' && (
                            <>
                                <div className="grid grid-cols-7 gap-1 mb-1">
                                    {dayNames.map(day => (
                                        <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {getDaysInMonth(currentMonth).map((date, index) => (
                                        <div key={index} className="aspect-square">
                                            {date ? (
                                                <button
                                                    onClick={() => handleDateSelect(date)}
                                                    className={`w-full h-full rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                                                        isSelected(date)
                                                            ? 'bg-linear-to-r from-primary-600 to-primary-400 text-white shadow-lg scale-105'
                                                            : isToday(date)
                                                            ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                                                            : 'text-gray-700 hover:bg-primary-50'
                                                    }`}
                                                >
                                                    {date.getDate()}
                                                </button>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {mode === 'month' && (
                            <div className="grid grid-cols-4 gap-2">
                                {monthNames.map((name, idx) => (
                                    <button
                                        key={name}
                                        onClick={() => handleMonthSelect(idx)}
                                        className={`py-3 rounded-lg text-sm font-semibold transition-colors ${
                                            currentMonth.getMonth() === idx
                                                ? 'bg-primary-600 text-white shadow'
                                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                        {mode === 'year' && (
                            <div className="grid grid-cols-4 gap-2">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => handleYearSelect(year)}
                                        className={`py-3 rounded-lg text-sm font-semibold transition-colors ${
                                            currentMonth.getFullYear() === year
                                                ? 'bg-primary-600 text-white shadow'
                                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-primary-100 bg-primary-50">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    const year = today.getFullYear();
                                    const month = String(today.getMonth() + 1).padStart(2, '0');
                                    const day = String(today.getDate()).padStart(2, '0');
                                    const todayStr = `${year}-${month}-${day}`;
                                    setSelectedDate(todayStr);
                                    setCurrentMonth(today);
                                    onChange(todayStr);
                                    setIsOpen(false);
                                    setMode('day');
                                }}
                                className="flex-1 px-2 py-1.5 bg-primary-100 hover:bg-primary-200 rounded-lg text-xs text-primary-700 hover:text-primary-900 transition-colors"
                            >
                                Hôm nay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;