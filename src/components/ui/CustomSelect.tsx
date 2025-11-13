import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface CustomSelectProps<T> {
    options: T[];
    value?: string;
    onChange: (value: string) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => string;
    placeholder?: string;
    showIcon?: boolean;
    disabled?: boolean;
}

const CustomSelect = <T,>({
    options,
    value,
    onChange,
    getLabel,
    getValue,
    placeholder = 'Chọn...',
    showIcon = true,
    disabled = false
}: CustomSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => getValue(opt) === value);

    return (
        <div className="relative" ref={selectRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`h-12 cursor-pointer flex items-center justify-between transition-all duration-300 bg-white border border-blue-200 rounded-xl px-4 shadow-sm ${isOpen ? 'ring-2 ring-blue-400 border-blue-400' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? getLabel(selectedOption) : placeholder}
                </span>
                {showIcon && (
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <IoChevronDown size={20} className="text-blue-400" />
                    </div>
                )}
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-blue-100 rounded-xl overflow-hidden z-50 animate-slide-up shadow-2xl w-full max-h-64 overflow-y-auto">
                    {options.length === 0 ? (
                        <div className="p-4 text-gray-400 text-center">Không có lựa chọn</div>
                    ) : (
                        options.map(opt => (
                            <button
                                key={getValue(opt)}
                                onClick={() => {
                                    onChange(getValue(opt));
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                                    value === getValue(opt)
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white'
                                        : 'text-gray-700 hover:bg-blue-50'
                                }`}
                            >
                                {getLabel(opt)}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;