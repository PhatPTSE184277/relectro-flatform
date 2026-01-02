'use client';

import React, { useState, useEffect } from 'react';
import { X, Percent, MapPin } from 'lucide-react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';

interface UpdateConfigModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (companies: any[]) => void;
    companies: any[];
    selectedCompany?: any | null; // Nếu có thì chỉnh sửa chi tiết, không thì phân bổ tỷ lệ
    mode?: 'ratio' | 'detail'; // 'ratio' = phân bổ tỷ lệ, 'detail' = chỉnh sửa chi tiết
}

const UpdateConfigModal: React.FC<UpdateConfigModalProps> = ({
    open,
    onClose,
    onConfirm,
    companies,
    selectedCompany = null,
    mode = 'ratio'
}) => {
    const [companiesData, setCompaniesData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'ratio' | 'detail'>(mode);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            setCompaniesData(companies.map(c => ({ ...c })));
            setActiveTab(selectedCompany ? 'detail' : 'ratio');
            setSelectedCompanyId(selectedCompany?.companyId || null);
        }
    }, [open, companies, selectedCompany]);

    const handleRatioChange = (companyId: number, newRatio: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? { ...c, ratioPercent: newRatio }
                    : c
            )
        );
    };

    const handleUpdateRadius = (companyId: number, smallPointId: number, radiusKm: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? {
                        ...c,
                        smallPoints: c.smallPoints.map((sp: any) =>
                            sp.smallPointId === smallPointId
                                ? { ...sp, radiusKm }
                                : sp
                        )
                    }
                    : c
            )
        );
    };

    const handleUpdateMaxDistance = (companyId: number, smallPointId: number, maxRoadDistanceKm: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? {
                        ...c,
                        smallPoints: c.smallPoints.map((sp: any) =>
                            sp.smallPointId === smallPointId
                                ? { ...sp, maxRoadDistanceKm }
                                : sp
                        )
                    }
                    : c
            )
        );
    };

    const handleConfirm = () => {
        onConfirm(companiesData);
        onClose();
    };

    const handleCompanyClick = (company: any) => {
        setSelectedCompanyId(company.companyId);
        setActiveTab('detail');
    };

    useEffect(() => {
        if (activeTab === 'ratio') {
            setSelectedCompanyId(null);
        }
    }, [activeTab]);

    const handleClose = () => {
        onClose();
    };

    const totalPercent = companiesData.reduce((sum, c) => sum + (c.ratioPercent || 0), 0);
    const isValidTotal = totalPercent === 100;
    
    // Validate: tất cả ratioPercent > 0
    const allRatiosValid = companiesData.every(c => (c.ratioPercent || 0) > 0);
    
    // Nút submit chỉ được bật khi tất cả > 0 và tổng = 100%
    const canSubmit = allRatiosValid && isValidTotal;
    
    // Luôn lấy company từ companiesData để đảm bảo cập nhật real-time
    const currentCompany = selectedCompanyId 
        ? companiesData.find(c => c.companyId === selectedCompanyId)
        : null;

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            {activeTab === 'ratio' ? (
                                <>
                                    <Percent size={24} className='text-primary-600' />
                                    Cập nhật cấu hình công ty
                                </>
                            ) : (
                                <>
                                    <MapPin size={24} className='text-primary-600' />
                                    Chỉnh sửa cấu hình
                                </>
                            )}
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            {activeTab === 'ratio' 
                                ? 'Điều chỉnh tỷ lệ phần trăm cho từng công ty'
                                : 'Điều chỉnh bán kính và khoảng cách tối đa'
                            }
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Tabs */}
                <div className='flex border-b border-gray-200 bg-gray-50 px-6'>
                    <button
                        onClick={() => setActiveTab('ratio')}
                        className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                            activeTab === 'ratio'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Phân bổ tỷ lệ
                    </button>
                    {selectedCompany && (
                        <button
                            onClick={() => setActiveTab('detail')}
                            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                                activeTab === 'detail'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Chỉnh sửa chi tiết
                        </button>
                    )}
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6 bg-gray-50'>
                    {activeTab === 'ratio' ? (
                        // Tab phân bổ tỷ lệ
                        <>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                        <Percent size={18} className='text-primary-600' />
                                    </span>
                                    Phân bổ tỷ lệ công ty
                                </h3>
                                <span className='text-base text-gray-500 font-medium'>
                                    Tổng số công ty: {companiesData.length}
                                </span>
                            </div>
                            <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm text-gray-800'>
                                        <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                            <tr>
                                                <th className='py-3 px-4 text-left'>STT</th>
                                                <th className='py-3 px-4 text-left'>Tên công ty</th>
                                                <th className='py-3 px-4 text-left'>Tỷ lệ (%)</th>
                                                <th className='py-3 px-4 text-center w-16'>Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companiesData.map((company, idx) => {
                                                const isLast = idx === companiesData.length - 1;
                                                return (
                                                    <tr
                                                        key={company.companyId}
                                                        className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-100 transition-colors`}
                                                    >
                                                        <td className='py-3 px-4 font-medium'>
                                                            <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold'>
                                                                {idx + 1}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4 font-medium text-gray-900'>
                                                            {company.companyName || `Company ${company.companyId}`}
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <CustomNumberInput
                                                                value={company.ratioPercent || 0}
                                                                min={0}
                                                                max={100}
                                                                onChange={(val) => handleRatioChange(company.companyId, val)}
                                                                className={`w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-primary-600 font-semibold bg-white ${
                                                                    company.ratioPercent <= 0 ? 'border-red-400' : 'border-primary-200'
                                                                }`}
                                                            />
                                                        </td>
                                                        <td className='py-3 px-4 text-center'>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCompanyClick(company)}
                                                                    className="text-primary-600 hover:text-primary-800 flex items-center justify-center transition cursor-pointer"
                                                                    title="Chỉnh sửa chi tiết"
                                                                >
                                                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                                        <path d="M12 20h9" />
                                                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                                                    </svg>
                                                                </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
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
                        </>
                    ) : (
                        // Tab chỉnh sửa chi tiết
                        currentCompany && (
                            <>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                                            <MapPin size={18} className='text-primary-600' />
                                        </span>
                                        Cấu hình điểm thu gom
                                    </h3>
                                    <span className='text-base text-gray-500 font-medium'>
                                        {currentCompany.companyName || 'N/A'}
                                    </span>
                                </div>
                                <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-sm text-gray-800'>
                                            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                                                <tr>
                                                    <th className='py-3 px-4 text-left'>STT</th>
                                                    <th className='py-3 px-4 text-left'>Tên điểm</th>
                                                    <th className='py-3 px-4 text-left'>Bán kính (km)</th>
                                                    <th className='py-3 px-4 text-left'>Khoảng cách tối đa (km)</th>
                                                    <th className='py-3 px-4 text-left'>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentCompany.smallPoints?.map((sp: any, idx: number) => {
                                                    const isLast = idx === currentCompany.smallPoints.length - 1;
                                                    return (
                                                        <tr
                                                            key={sp.smallPointId}
                                                            className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50 transition-colors`}
                                                        >
                                                            <td className='py-3 px-4 font-medium'>
                                                                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold'>
                                                                    {idx + 1}
                                                                </span>
                                                            </td>
                                                            <td className='py-3 px-4 font-medium text-gray-900'>
                                                                {sp.name || `Point ${sp.smallPointId}`}
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <CustomNumberInput
                                                                    value={sp.radiusKm || 0}
                                                                    min={0}
                                                                    max={100}
                                                                    step={0.1}
                                                                    onChange={(val) => handleUpdateRadius(currentCompany.companyId, sp.smallPointId, val)}
                                                                    className='w-20 px-2 py-1 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-primary-600 font-semibold'
                                                                />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <CustomNumberInput
                                                                    value={sp.maxRoadDistanceKm || 0}
                                                                    min={0}
                                                                    max={100}
                                                                    step={0.1}
                                                                    onChange={(val) => handleUpdateMaxDistance(currentCompany.companyId, sp.smallPointId, val)}
                                                                    className='w-20 px-2 py-1 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-primary-600 font-semibold'
                                                                />
                                                            </td>
                                                            <td className='py-3 px-4'>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    sp.active 
                                                                        ? 'bg-green-100 text-green-700' 
                                                                        : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                    {sp.active ? 'Hoạt động' : 'Không hoạt động'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>

                {/* Footer - chỉ hiện ở tab Phân bổ tỷ lệ */}
                {activeTab === 'ratio' && (
                    <div className='flex justify-end gap-3 p-6 border-t bg-white'>
                        <button
                            onClick={handleConfirm}
                            disabled={!canSubmit}
                            className={`px-6 py-2.5 text-white rounded-lg font-medium transition ${
                                canSubmit
                                    ? 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            Cập nhật
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateConfigModal;
