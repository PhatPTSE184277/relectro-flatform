'use client';

import React, { useState } from 'react';
import { Factory } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCompanyContext } from '@/contexts/admin/CompanyContext';
import CompanyList from '@/components/admin/company/CompanyList';
import CompanyDetail from '@/components/admin/company/modal/CompanyDetail';
import ImportExcelModal from '@/components/admin/company/modal/ImportComapnyModal';
import Pagination from '@/components/ui/Pagination';
import CompanyFilter from '@/components/admin/company/CompanyFilter';
import { useAuth } from '@/hooks/useAuth';
import Toast from '@/components/ui/Toast';

const CompanyPage: React.FC = () => {
    const { user } = useAuth();
    const {
        companies,
        loading,
        importFromExcel,
        page,
        totalPages,
        setPage,
        fetchCompanies,
        fetchCompanyById,
        type,
        setType,
        status,
        setStatus
    } = useCompanyContext();

    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; type: 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });


    // Khi vào trang, mặc định filter là 'Đang hoạt động'
    React.useEffect(() => {
        setType('Công ty thu gom');
        setStatus('Đang hoạt động');
        setPage(1);
        fetchCompanies(1, undefined, 'Công ty thu gom', 'Đang hoạt động');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Xử lý chuyển trang
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchCompanies(newPage, undefined, type, status);
    };

    // Xử lý filter type
    const handleTypeChange = (newType: string) => {
        setType(newType);
        setPage(1);
        fetchCompanies(1, undefined, newType, status);
    };

    // Xử lý filter status
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setPage(1);
        fetchCompanies(1, undefined, type, newStatus);
    };

    const handleViewDetail = async (company: any) => {
        try {
            const res = await fetchCompanyById(company.id);
            setSelectedCompany(res || company);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setSelectedCompany(company);
        }
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedCompany(null);
    };

    const handleImportExcel = async (file: File): Promise<boolean> => {
        try {
            const res = await importFromExcel(file);
            const isSuccess = Boolean(res?.success);
            const messages = Array.isArray(res?.messages)
                ? res.messages.filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
                : [];

            if (!isSuccess || messages.length > 0) {
                setToast({
                    open: true,
                    type: 'error',
                    message:
                        messages.length > 0
                            ? messages.join('\n')
                            : (res?.message || 'Import thất bại. Vui lòng kiểm tra lại file Excel.')
                });
                return false;
            }

            return true;
        } catch (error) {
            const errMessage =
                typeof error === 'object' && error !== null && 'response' in error
                    ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Import thất bại. Vui lòng thử lại.')
                    : 'Import thất bại. Vui lòng thử lại.';
            setToast({ open: true, type: 'error', message: errMessage });
            return false;
        }
    };



    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Factory className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        {user?.role === 'Collector' ? 'Thông tin công ty' : 'Quản lý công ty'}
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <div className='flex items-center gap-2 mr-4'>
                        <span className='text-xs text-gray-500 font-semibold mr-2 hidden sm:inline'>Loại:</span>
                        <button
                            onClick={() => handleTypeChange('Công ty thu gom')}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
                                type === 'Công ty thu gom'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Công ty thu gom
                        </button>
                        <button
                            onClick={() => handleTypeChange('Công ty tái chế')}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
                                type === 'Công ty tái chế'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Công ty tái chế
                        </button>
                    </div>

                    {user?.role !== 'Collector' && (
                        <button
                            type='button'
                            className='flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
                            onClick={() => setShowImportModal(true)}
                        >
                            <IoCloudUploadOutline size={20} />
                            Import từ Excel
                        </button>
                    )}
                    {/* Bỏ ô tìm kiếm */}
                </div>
            </div>

            {/* Filter trạng thái */}
            <CompanyFilter
                status={status}
                onStatusChange={handleStatusChange}
            />


            {/* Danh sách công ty */}
            <CompanyList
                companies={companies}
                loading={loading}
                onViewDetail={handleViewDetail}
            />

            {/* Phân trang */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedCompany && (
                <CompanyDetail
                    company={selectedCompany}
                    onClose={handleCloseModal}
                />
            )}

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportExcelModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}

            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
};

export default CompanyPage;
