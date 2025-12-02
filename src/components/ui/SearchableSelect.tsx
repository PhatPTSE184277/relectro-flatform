import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps<T> {
	options: T[];
	value?: string;
	onChange: (value: string) => void;
	getLabel: (option: T) => string;
	getValue: (option: T) => string;
	placeholder?: string;
	disabled?: boolean;
}

const SearchableSelect = <T,>({
	options,
	value,
	onChange,
	getLabel,
	getValue,
	placeholder = 'Chọn...',
	disabled = false
}: SearchableSelectProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
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

	const selectedOption = options.find((opt) => getValue(opt) === value);
	const filteredOptions = options.filter(opt =>
		getLabel(opt).toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className='relative' ref={selectRef}>
			<div
				onClick={() => !disabled && setIsOpen(!isOpen)}
				   className={`h-12 cursor-pointer flex items-center justify-between transition-all duration-300 bg-white border border-primary-200 rounded-xl px-4 shadow-sm ${
					   isOpen ? 'ring-2 ring-primary-400 border-primary-400' : ''
				   } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
			>
				<span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
					{selectedOption ? getLabel(selectedOption) : placeholder}
				</span>
				   <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
					   <svg width={20} height={20} viewBox='0 0 20 20' fill='none'><path d='M6 8l4 4 4-4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='text-primary-400'/></svg>
				   </div>
			</div>

			{isOpen && !disabled && (
				   <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-xl overflow-hidden z-50 animate-slide-up shadow-2xl w-full max-h-64 overflow-y-auto'>
					   <div className='p-2 border-b border-primary-100 bg-gray-50'>
						   <input
							   type='text'
							   value={search}
							   onChange={e => setSearch(e.target.value)}
							   className='w-full px-3 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-900 placeholder-gray-400'
							   placeholder='Tìm kiếm...'
							   autoFocus
						   />
					   </div>
					{filteredOptions.length === 0 ? (
						<div className='p-4 text-gray-400 text-center'>Không có lựa chọn</div>
					) : (
						filteredOptions.map((opt) => (
							<button
								key={getValue(opt)}
								onClick={() => {
									onChange(getValue(opt));
									setIsOpen(false);
									setSearch('');
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
				</div>
			)}
		</div>
	);
};

export default SearchableSelect;
