import React from 'react';

interface CustomNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  value,
  onChange,
  placeholder = '',
  min = 0,
  max,
  className = '',
}) => {
  // Chỉ cho nhập số, loại bỏ ký tự không phải số và số 0 đầu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    // Cho phép nhập số 0, 1, 2, 3... không ép min khi nhập
    let num = raw === '' ? 0 : Number(raw);
    onChange(num);
  };

  // Clamp giá trị khi blur
  const handleBlur = () => {
    let clamped = value;
    if (min !== undefined && value < min) clamped = min;
    if (max !== undefined && value > max) clamped = max;
    if (clamped !== value) onChange(clamped);
  };

  return (
    <input
      type='text'
      inputMode='numeric'
      pattern='[0-9]*'
      value={value === 0 ? '' : String(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`placeholder-gray-400 placeholder:font-medium ${className}`}
    />
  );
};

export default CustomNumberInput;
