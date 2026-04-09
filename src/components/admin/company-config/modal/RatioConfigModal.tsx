import React from 'react';
import { X, Loader2 } from 'lucide-react';
import CompanyRatioList from './CompanyRatioList';

interface RatioConfigModalProps {
    open: boolean;
    onClose: () => void;
    companies: any[];
    totalPercent: number;
    isValidTotal: boolean;
    canSubmit: boolean;
    loading: boolean;
    onRatioChange: (companyId: number, newRatio: number) => void;
    onEditDetail: (company: any) => void;
    onConfirm: () => void;
}

const RatioConfigModal: React.FC<RatioConfigModalProps> = ({
    open,
    onClose,
    companies,
    totalPercent,
    isValidTotal,
    canSubmit,
    loading,
    onRatioChange,
    onEditDetail,
    onConfirm
}) => {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div className='flex items-center gap-6'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                                Cập nhật cấu hình công ty
                            </h2>
                            <p className='text-sm text-gray-600 mt-1'>
                                Điều chỉnh tỷ lệ phần trăm cho từng công ty
                            </p>
                        </div>

                        <div className={`p-2 rounded-md border w-max ${
                            isValidTotal ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                        }`}>
                            <div className='flex items-center gap-3'>
                                <span className='font-semibold text-gray-900'>Tổng tỷ lệ:</span>
                                <span className={`text-sm font-bold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
                                    {totalPercent}%
                                </span>
                            </div>
                            {!isValidTotal && (
                                <p className='text-xs text-red-600 mt-1'>Tổng tỷ lệ phải bằng 100%</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 min-h-0 overflow-hidden p-6 bg-gray-50'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                            Phân bổ tỷ lệ công ty
                        </h3>
                        <span className='text-base text-gray-500 font-medium'>
                            Tổng số công ty: {companies.length}
                        </span>
                    </div>

                    <CompanyRatioList
                        companies={companies}
                        onRatioChange={onRatioChange}
                        onEditDetail={onEditDetail}
                    />
                </div>

                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <button
                        onClick={onConfirm}
                        disabled={!canSubmit || loading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white shadow-md transition ${
                            canSubmit && !loading
                                ? 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                                : 'bg-primary-300 cursor-not-allowed'
                        }`}
                    >
                        {loading ? (
                            <Loader2 className='animate-spin' size={18} />
                        ) : (
                            'Cập nhật'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatioConfigModal;
