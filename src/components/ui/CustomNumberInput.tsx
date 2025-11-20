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
    const val = raw.replace(/^0+/, '');
    let num = val === '' ? 0 : Number(val);
    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;
    onChange(num);
  };

  return (
    <input
      type='text'
      inputMode='numeric'
      pattern='[0-9]*'
      value={value === 0 ? '' : String(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={`placeholder-gray-400 placeholder:font-medium ${className}`}
    />
  );
};

export default CustomNumberInput;
