import React from 'react';
import { Calendar } from 'lucide-react';
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
        <div className='flex items-center gap-3 bg-white rounded-xl shadow-md border border-blue-100 p-4'>
            <Calendar className='text-blue-500' size={20} />
            
            <div className='flex items-center gap-3 flex-1'>
                <div className='flex-1'>
                    <label className='text-xs text-gray-500 font-medium mb-1 block'>
                        Từ ngày
                    </label>
                    <CustomDatePicker
                        value={fromDate}
                        onChange={onFromDateChange}
                        placeholder='Chọn từ ngày'
                        showIcon={false}
                    />
                </div>

                <div className='text-gray-400 mt-5'>→</div>

                <div className='flex-1'>
                    <label className='text-xs text-gray-500 font-medium mb-1 block'>
                        Đến ngày
                    </label>
                    <CustomDatePicker
                        value={toDate}
                        onChange={onToDateChange}
                        placeholder='Chọn đến ngày'
                        showIcon={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomDateRangePicker;
