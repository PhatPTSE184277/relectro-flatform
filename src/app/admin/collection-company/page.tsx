'use client';

import React, { useState } from 'react';
import { IoSparklesOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { useCollectionCompanyContext } from '@/contexts/admin/CollectionCompanyContext';
import CompanyList from '@/components/admin/collection-company/CompanyList';
import CompanyDetail from '@/components/admin/collection-company/modal/CompanyDetail';
import SearchBox from '@/components/ui/SearchBox';
import { toast } from 'react-toastify';

const CollectionCompanyPage: React.FC = () => {
    const { companies, loading, importFromExcel } = useCollectionCompanyContext();
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');

    const handleViewDetail = (company: any) => {
        setSelectedCompany(company);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedCompany(null);
    };

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (!validTypes.includes(file.type)) {
            toast.error('Vui lòng chọn file Excel (.xls hoặc .xlsx)');
            e.target.value = '';
            return;
        }

        await importFromExcel(file);
        e.target.value = '';
    };

    const filteredCompanies = companies.filter((company) => {
        const searchLower = search.toLowerCase();
        return (
            company.name?.toLowerCase().includes(searchLower) ||
            company.companyEmail?.toLowerCase().includes(searchLower) ||
            company.phone?.toLowerCase().includes(searchLower) ||
            company.city?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <IoSparklesOutline className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý công ty thu gom
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <label className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'>
                        <IoCloudUploadOutline size={20} />
                        Import từ Excel
                        <input
                            type='file'
                            accept='.xls,.xlsx'
                            onChange={handleImportExcel}
                            className='hidden'
                        />
                    </label>
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm công ty...'
                        />
                    </div>
                </div>
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
        </div>
    );
};

export default CollectionCompanyPage;
