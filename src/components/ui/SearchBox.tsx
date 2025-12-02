import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number; // ms
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = "Tìm kiếm bài đăng...",
  debounce = 500,
}) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, debounce);
    return () => clearTimeout(timer);
  }, [input, onChange, debounce]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-primary-200 focus-within:ring-2 focus-within:ring-primary-400 px-3 py-2 shadow-sm transition-all">
      <Search className="text-primary-400" size={18} />
      <input
        type="text"
        className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBox;