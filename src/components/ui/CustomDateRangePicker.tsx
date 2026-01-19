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
        <div className='flex items-center gap-2'>
            <div className='flex-1 min-w-[110px]'>
                <CustomDatePicker
                    value={fromDate}
                    onChange={onFromDateChange}
                    placeholder='Từ ngày'
                    showIcon={false}
                />
            </div>
            <span className='text-gray-300 text-lg px-1 select-none'>–</span>
            <div className='flex-1 min-w-[110px]'>
                <CustomDatePicker
                    value={toDate}
                    onChange={onToDateChange}
                    placeholder='Đến ngày'
                    showIcon={false}
                />
            </div>
        </div>
    );
};

export default CustomDateRangePicker;
