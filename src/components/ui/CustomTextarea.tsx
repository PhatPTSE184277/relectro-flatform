import React, { useRef, useEffect } from 'react';

interface CustomTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    disabled?: boolean;
    className?: string;
    /** legacy prop name */
    showCharCount?: boolean;
    /** preferred prop name used across codebase */
    showCounter?: boolean;
    autoFocus?: boolean;
    required?: boolean;
    label?: React.ReactNode;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
    value,
    onChange,
    placeholder = '',
    rows = 4,
    maxLength,
    disabled = false,
    className = '',
    showCharCount = false,
    showCounter = false,
    autoFocus = false,
    required = false,
    label,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) {
            return;
        }
        onChange(newValue);
    };

    const currentLength = value.length;
    const showCounterVisible = (showCounter || showCharCount) && !!maxLength;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {label}
                </label>
            )}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                required={required}
                className={`w-full px-4 py-3 bg-white border border-primary-200 rounded-xl shadow-sm transition-all duration-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 placeholder:text-gray-400 placeholder:font-medium text-gray-900 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${showCounterVisible ? 'pb-8' : ''}`}
            />
            {showCounterVisible && (
                <div
                    className={`absolute bottom-3 right-4 text-xs font-medium ${
                        currentLength >= (maxLength ?? 0)
                            ? 'text-red-500'
                            : 'text-gray-400'
                    }`}
                >
                    {currentLength}/{maxLength}
                </div>
            )}
        </div>
    );
};

export default CustomTextarea;
