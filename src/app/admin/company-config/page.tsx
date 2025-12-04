'use client';

import React, { useState } from 'react';
import { useCompanyConfigContext } from '@/contexts/admin/CompanyConfigContext';
import { Settings } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import ConfigList from '@/components/admin/company-config/ConfigList';
import ConfigFilter from '@/components/admin/company-config/ConfigFilter';
import EditConfigModal from '@/components/admin/company-config/modal/EditConfigModal';
import UpdateQuotaModal from '@/components/admin/company-config/modal/UpdateQuotaModal';

const CompanyConfigPage: React.FC = () => {
    const {
        loading,
        companiesWithPoints,
        updateConfig,
        getCompanyConfigDetailById
    } = useCompanyConfigContext();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showQuotaModal, setShowQuotaModal] = useState(false);

    const companies = companiesWithPoints || [];

    const filteredCompanies = companies.filter((company) => {
        const matchSearch =
            company.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            company.companyId.toString().includes(search.toLowerCase());

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

    const handleEditCompany = async (company: any) => {
        setLoadingDetail(true);
        try {
            const detail = await getCompanyConfigDetailById(company.companyId);
            if (detail) {
                setSelectedTeam(detail);
            } else {
                setSelectedTeam(company);
            }
            setShowEditModal(true);
        } catch (err) {
            setSelectedTeam(company);
            setShowEditModal(true);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleUpdateConfig = async (updatedCompany: any) => {
        const updatedCompanies = companies.map((c) =>
            c.companyId === updatedCompany.companyId ? updatedCompany : c
        );
        await updateConfig(updatedCompanies);
        setShowEditModal(false);
        setSelectedTeam(null);
    };

    const handleUpdateQuota = async (updatedCompanies: any[]) => {
        await updateConfig(updatedCompanies);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Settings className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Cấu hình công ty
                    </h1>
                </div>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => setShowQuotaModal(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer border border-primary-200'
                    >
                        <Settings size={16} />
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
                onEdit={handleEditCompany}
            />

            {/* Edit Modal */}
            {showEditModal && (
                <EditConfigModal
                    key={selectedTeam?.companyId}
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedTeam(null);
                    }}
                    onConfirm={handleUpdateConfig}
                    company={selectedTeam}
                    loading={loadingDetail}
                />
            )}

            {/* Update Quota Modal */}
            <UpdateQuotaModal
                open={showQuotaModal}
                onClose={() => setShowQuotaModal(false)}
                onConfirm={handleUpdateQuota}
                companies={companies}
            />
        </div>
    );
};

export default CompanyConfigPage;
