'use client';

import React, { useState } from 'react';
import { Factory, Download } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCompanyContext } from '@/contexts/admin/CompanyContext';
import CompanyList from '@/components/admin/company/CompanyList';
import CompanyDetail from '@/components/admin/company/modal/CompanyDetail';
import ImportExcelModal from '@/components/admin/company/modal/ImportComapnyModal';
import Pagination from '@/components/ui/Pagination';
import CompanyFilter from '@/components/admin/company/CompanyFilter';
import { useAuth } from '@/hooks/useAuth';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

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
        status,
        setStatus
    } = useCompanyContext();

    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'error',
        message: ''
    });


    // Khi vào trang, mặc định filter là 'Đang hoạt động'
    React.useEffect(() => {
        setStatus('Đang hoạt động');
        setPage(1);
        fetchCompanies(1, undefined, 'Công ty tái chế', 'Đang hoạt động');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const loadTemplate = async () => {
            try {
                const configs = await getActiveSystemConfigs('Excel');
                setTemplateUrl(pickExcelTemplateUrl(configs, ['cong ty', 'company']));
            } catch {
                setTemplateUrl(null);
            }
        };

        void loadTemplate();
    }, []);

    // Xử lý chuyển trang
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchCompanies(newPage, undefined, type, status);
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
            if (!res) {
                setToast({
                    open: true,
                    type: 'error',
                    message: 'Thêm dữ liệu thất bại'
                });
                return false;
            }

            setToast({
                open: true,
                type: 'success',
                message: 'Thêm dữ liệu hoàn tất'
            });
            return true;
        } catch {
            setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
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
                    {user?.role !== 'Collector' && (
                        <>
                            <a
                                href={templateUrl || '#'}
                                download
                                onClick={(e) => {
                                    if (!templateUrl) e.preventDefault();
                                }}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border transition font-medium shadow-sm ${
                                    templateUrl
                                        ? 'border-primary-300 text-primary-600 hover:bg-primary-50'
                                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <Download size={20} />
                                Tải file mẫu
                            </a>
                            <button
                                type='button'
                                className='flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
                                onClick={() => setShowImportModal(true)}
                            >
                                <IoCloudUploadOutline size={20} />
                                Nhập từ Excel
                            </button>
                        </>
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
                    companyType={type}
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
