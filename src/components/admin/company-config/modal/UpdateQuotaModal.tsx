'use client';

import React, { useState, useEffect } from 'react';
import { Percent } from 'lucide-react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';

interface UpdateQuotaModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (companies: any[]) => void;
    companies: any[];
}

const UpdateQuotaModal: React.FC<UpdateQuotaModalProps> = ({
    open,
    onClose,
    onConfirm,
    companies
}) => {
    const [companiesData, setCompaniesData] = useState<any[]>([]);

    useEffect(() => {
        if (open && companies) {
            setCompaniesData(companies.map(c => ({ ...c })));
        }
    }, [open, companies]);

    const handleRatioChange = (companyId: number, newRatio: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? { ...c, ratioPercent: newRatio }
                    : c
            )
        );
    };

    const handleConfirm = () => {
        onConfirm(companiesData);
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    const totalPercent = companiesData.reduce((sum, c) => sum + (c.ratioPercent || 0), 0);
    const isValidTotal = totalPercent === 100;

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            <Percent size={24} className='text-primary-600' />
                            Phân bổ tỷ lệ công ty
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Điều chỉnh tỷ lệ phần trăm cho từng công ty
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='space-y-4'>
                        {companiesData.map((company, idx) => (
                            <div
                                key={company.companyId}
                                className='border rounded-lg p-4 bg-primary-50/30 border-primary-200 flex flex-col gap-2'
                            >
                                <div className='flex items-center gap-3 mb-3'>
                                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold'>{idx + 1}</span>
                                    <label className='font-medium text-gray-900 text-base'>{company.companyName || `Công ty ${company.companyId}`}</label>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={company.ratioPercent || 0}
                                        onChange={(e) => handleRatioChange(company.companyId, Number(e.target.value))}
                                        className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500'
                                    />
                                    <div className='flex items-center gap-2 px-4 py-1.5 border border-primary-200 rounded-xl bg-white text-primary-600 font-semibold'>
                                        <CustomNumberInput
                                            value={company.ratioPercent || 0}
                                            min={0}
                                            max={100}
                                            onChange={(val) => handleRatioChange(company.companyId, val)}
                                            className='w-16 px-2 py-1 text-center border-none outline-none bg-transparent text-primary-600 font-semibold'
                                        />
                                        <span className='text-lg font-semibold text-primary-600'>%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tổng % */}
                    <div className={`mt-6 p-4 rounded-lg border-2 ${
                        isValidTotal 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-red-50 border-red-300'
                    }`}>
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold text-gray-900'>Tổng tỷ lệ:</span>
                            <span className={`text-xl font-bold ${
                                isValidTotal ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {totalPercent}%
                            </span>
                        </div>
                        {!isValidTotal && (
                            <p className='text-xs text-red-600 mt-2'>
                                Tổng tỷ lệ phải bằng 100%
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 p-6 border-t bg-gray-50'>
                    <button
                        onClick={handleConfirm}
                        disabled={!isValidTotal}
                        className={`px-6 py-2.5 text-white rounded-lg font-medium transition ${
                            isValidTotal
                                ? 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuotaModal;
