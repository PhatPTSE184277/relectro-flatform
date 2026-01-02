import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface CompactDatePickerProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
}

function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

const CompactDatePicker: React.FC<CompactDatePickerProps> = ({
    value,
    onChange,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(value || '');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            const parsed = parseLocalDate(value);
            setSelectedDate(value);
            setCurrentMonth(parsed);
        } else {
            setSelectedDate('');
            setCurrentMonth(new Date());
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        setSelectedDate(dateString);
        onChange(dateString);
        setIsOpen(false);
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

    const isSelected = (date: Date) => {
        return selectedDate === `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
    };

    return (
        <div className="relative" ref={datePickerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`h-10 cursor-pointer flex items-center justify-between transition-all duration-300 bg-white border border-primary-200 rounded-lg px-3 shadow-sm ${isOpen ? 'ring-2 ring-primary-400 border-primary-400' : ''}`}
            >
                <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedDate || placeholder || 'Chọn ngày'}
                </span>
                <IoChevronDown size={18} className="text-primary-600" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-primary-100 rounded-lg overflow-hidden z-50 animate-slide-up shadow-lg w-56">
                    <div className="p-2">
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompactDatePicker;