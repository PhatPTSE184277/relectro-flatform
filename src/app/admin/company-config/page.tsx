'use client';

import React, { useState } from 'react';
import { useCompanyConfigContext } from '@/contexts/admin/CompanyConfigContext';
import { Wrench } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import ConfigList from '@/components/admin/company-config/ConfigList';
import ConfigFilter from '@/components/admin/company-config/ConfigFilter';
import UpdateConfigModal from '@/components/admin/company-config/modal/UpdateConfigModal';
import CompanyDetailModal from '@/components/admin/company-config/modal/CompanyDetailModal';

const CompanyConfigPage: React.FC = () => {
    const {
        loading,
        companiesWithPoints,
        updateConfig,
    } = useCompanyConfigContext();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [modalMode, setModalMode] = useState<'ratio' | 'detail'>('ratio');

    const companies = companiesWithPoints || [];

    const filteredCompanies = companies.filter((company) => {
        const matchSearch =
            company.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            company.companyId.includes(search.toLowerCase());

        if (filterStatus === 'active') {
            return (
                matchSearch && company.smallPoints.some((sp: any) => sp.active)
            );
        }
        if (filterStatus === 'inactive') {
            return (
                matchSearch &&
                company.smallPoints.every((sp: any) => !sp.active)
            );
        }
        return matchSearch;
    });

    const handleOpenRatioModal = () => {
        setSelectedCompany(null);
        setModalMode('ratio');
        setShowConfigModal(true);
    };

    const handleViewDetail = (company: any) => {
        setSelectedCompany(company);
        setShowDetailModal(true);
    };

    const handleUpdateConfig = async (updatedCompanies: any[]) => {
        await updateConfig(updatedCompanies);
        setShowConfigModal(false);
        setSelectedCompany(null);
    };

    return (
        <>
            <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header + Search */}
                <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Wrench className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>
                            Cấu hình công ty
                        </h1>
                    </div>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handleOpenRatioModal}
                            className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer border border-primary-200'
                        >
                            <Wrench size={16} />
                            Phân bổ tỷ lệ
                        </button>
                        <div className='flex-1 max-w-md'>
                            <SearchBox
                                value={search}
                                onChange={setSearch}
                                placeholder='Tìm kiếm theo tên công ty...'
                            />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <ConfigFilter
                    status={filterStatus}
                    onFilterChange={setFilterStatus}
                />

                {/* Config List */}
                <ConfigList
                    companies={filteredCompanies}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                />

                {/* Update Config Modal */}
                <UpdateConfigModal
                    open={showConfigModal}
                    onClose={() => {
                        setShowConfigModal(false);
                        setSelectedCompany(null);
                    }}
                    onConfirm={handleUpdateConfig}
                    companies={companies}
                    selectedCompany={selectedCompany}
                    mode={modalMode}
                />

                {/* Company Detail Modal */}
                <CompanyDetailModal
                    open={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedCompany(null);
                    }}
                    company={selectedCompany}
                />
            </div>
        </>
    );
};

export default CompanyConfigPage;
