import React from 'react';
import CustomDatePicker from './CustomDatePicker';

interface CustomDateRangePickerProps {
    fromDate?: string;
    toDate?: string;
    onFromDateChange: (date: string) => void;
    onToDateChange: (date: string) => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange
}) => {
    return (
        <div
            className='
                flex items-center gap-2 bg-white rounded-xl border border-primary-100 px-3 py-2 min-h-11
                transition-all duration-200
                focus-within:ring-2 focus-within:ring-primary-300
                hover:shadow-md
                w-full
            '
        >
            <div className='flex items-center gap-2 flex-1'>
                <div className='flex-1 min-w-[110px]'>
                    <label className='text-xs text-gray-500 font-medium mb-1 block leading-none'>Từ ngày</label>
                    <CustomDatePicker
                        value={fromDate}
                        onChange={onFromDateChange}
                        placeholder='Từ ngày'
                        showIcon={false}
                    />
                </div>
                <span className='text-gray-300 text-lg px-1 select-none'>–</span>
                <div className='flex-1 min-w-[110px]'>
                    <label className='text-xs text-gray-500 font-medium mb-1 block leading-none'>Đến ngày</label>
                    <CustomDatePicker
                        value={toDate}
                        onChange={onToDateChange}
                        placeholder='Đến ngày'
                        showIcon={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomDateRangePicker;
