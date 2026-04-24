import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { createPortal } from 'react-dom';

interface CustomSelectProps<T> {
    options: T[];
    value?: string;
    onChange: (value: string) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => string;
    placeholder?: string;
    showIcon?: boolean;
    disabled?: boolean;
    className?: string; // Thêm dòng này
}

const CustomSelect = <T,>({
    options,
    value,
    onChange,
    getLabel,
    getValue,
    placeholder = 'Chọn...',
    showIcon = true,
    disabled = false,
    className = '', // Thêm dòng này
}: CustomSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

    const updateMenuPosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideSelect = !!selectRef.current?.contains(target);
            const isInsideMenu = !!menuRef.current?.contains(target);
            if (!isInsideSelect && !isInsideMenu) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        updateMenuPosition();

        const handleRelayout = () => updateMenuPosition();
        window.addEventListener('resize', handleRelayout);
        window.addEventListener('scroll', handleRelayout, true);

        return () => {
            window.removeEventListener('resize', handleRelayout);
            window.removeEventListener('scroll', handleRelayout, true);
        };
    }, [isOpen]);

    const selectedOption = options.find((opt) => getValue(opt) === value);

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            <div
                ref={triggerRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`h-12 cursor-pointer flex items-center justify-between transition-all duration-300 bg-white border border-primary-200 rounded-xl px-4 shadow-sm ${
                    isOpen ? 'ring-2 ring-primary-400 border-primary-400' : ''
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                <span
                    title={selectedOption ? getLabel(selectedOption) : undefined}
                    className={(selectedOption ? 'text-gray-900' : 'text-gray-400') + ' text-center w-full truncate'}
                >
                    {selectedOption ? getLabel(selectedOption) : placeholder}
                </span>
                {showIcon && (
                    <div
                        className={`transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    >
                        <IoChevronDown size={20} className='text-primary-400' />
                    </div>
                )}
            </div>

            {isOpen && !disabled && createPortal(
                <div
                    ref={menuRef}
                    className='fixed bg-white border border-primary-100 rounded-xl overflow-hidden z-120 animate-slide-up shadow-2xl max-h-64 overflow-y-auto'
                    style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}
                >
                    {options.length === 0 ? (
                        <div className='p-4 text-gray-400 text-center'>
                            Không có lựa chọn
                        </div>
                    ) : (
                        options.map((opt) => (
                            <button
                                key={getValue(opt)}
                                onClick={() => {
                                    onChange(getValue(opt));
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                                    value === getValue(opt)
                                        ? 'bg-linear-to-r from-primary-500 to-primary-400 text-white'
                                        : 'text-gray-700 hover:bg-primary-50'
                                }`}
                            >
                                {getLabel(opt)}
                            </button>
                        ))
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default CustomSelect;
