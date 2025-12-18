import React from 'react';

interface CustomNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  value,
  onChange,
  placeholder = '',
  min = 0,
  max,
  step,
  className = '',
}) => {
  // Chỉ cho nhập số (bao gồm số thập phân nếu có step)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (step && step < 1) {
      // Cho phép nhập số thập phân
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      const num = raw === '' ? 0 : parseFloat(raw) || 0;
      onChange(num);
    } else {
      // Chỉ cho nhập số nguyên
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const num = raw === '' ? 0 : Number(raw);
      onChange(num);
    }
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
      value={String(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`placeholder-gray-400 placeholder:font-medium text-right ${className}`}
    />
  );
};

export default CustomNumberInput;
