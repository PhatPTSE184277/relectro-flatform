'use client';

import React, { useState } from 'react';
import { Factory } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCollectionCompanyContext } from '@/contexts/admin/CollectionCompanyContext';
import CompanyList from '@/components/admin/collection-company/CompanyList';
import CompanyDetail from '@/components/admin/collection-company/modal/CompanyDetail';
import ImportExcelModal from '@/components/admin/collection-company/modal/ImportComapnyModal';
import Pagination from '@/components/ui/Pagination';
import CompanyFilter from '@/components/admin/collection-company/CompanyFilter';
import { useAuth } from '@/hooks/useAuth';

const CollectionCompanyPage: React.FC = () => {
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
        status,
        setStatus
    } = useCollectionCompanyContext();

    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);


    // Khi vào trang, mặc định filter là 'Đang hoạt động'
    React.useEffect(() => {
        setStatus('DANG_HOAT_DONG');
        setPage(1);
        fetchCompanies(1, undefined, 'DANG_HOAT_DONG');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Xử lý chuyển trang
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchCompanies(newPage, undefined, status);
    };

    // Xử lý filter status
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setPage(1);
        fetchCompanies(1, undefined, newStatus);
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

    const handleImportExcel = async (file: File) => {
        await importFromExcel(file);
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
                        {user?.role === 'Collector' ? 'Thông tin công ty' : 'Quản lý công ty thu gom'}
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
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
            <CompanyFilter status={status} onFilterChange={handleStatusChange} />


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
        </div>
    );
};

export default CollectionCompanyPage;
