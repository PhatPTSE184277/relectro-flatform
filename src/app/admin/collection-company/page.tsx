'use client';

import React, { useState } from 'react';
import { Factory } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCollectionCompanyContext } from '@/contexts/admin/CollectionCompanyContext';
import CompanyList from '@/components/admin/collection-company/CompanyList';
import CompanyFilter from '@/components/admin/collection-company/CompanyFilter';
import CompanyDetail from '@/components/admin/collection-company/modal/CompanyDetail';
import SearchBox from '@/components/ui/SearchBox';
import ImportExcelModal from '@/components/admin/collection-company/modal/ImportComapnyModal';
import { useAuth } from '@/hooks/useAuth';

const CollectionCompanyPage: React.FC = () => {
    const { user } = useAuth();
    const { companies, loading, importFromExcel } = useCollectionCompanyContext();
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'active' | 'inactive'>('active');
    const [showImportModal, setShowImportModal] = useState(false);

    const handleViewDetail = (company: any) => {
        setSelectedCompany(company);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedCompany(null);
    };

    const handleImportExcel = async (file: File) => {
        await importFromExcel(file);
    };

    const filteredCompanies = companies.filter((company) => {
        const searchLower = search.toLowerCase();
        const matchSearch =
            company.name?.toLowerCase().includes(searchLower) ||
            company.companyEmail?.toLowerCase().includes(searchLower) ||
            company.phone?.toLowerCase().includes(searchLower) ||
            company.city?.toLowerCase().includes(searchLower);

        if (filterStatus === 'active') {
            return matchSearch && company.status?.toLowerCase() === 'active';
        }
        if (filterStatus === 'inactive') {
            return matchSearch && company.status?.toLowerCase() === 'inactive';
        }
        return false;
    });

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
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm công ty...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className='mt-6 mb-4'>
                <CompanyFilter
                    status={filterStatus}
                    onFilterChange={setFilterStatus}
                />
            </div>

            {/* Company List */}
            <CompanyList
                companies={filteredCompanies}
                loading={loading}
                onViewDetail={handleViewDetail}
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
