'use client';

import React, { useState, useEffect } from 'react';
import { Recycle, Plus } from 'lucide-react';
import AssignRecyclingList from '@/components/admin/assign-recycling/AssignRecyclingList';
import AssignRecyclingModal from '@/components/admin/assign-recycling/modal/AssignRecyclingModal';
import UpdateRecyclingModal from '@/components/admin/assign-recycling/modal/UpdateRecyclingModal';
import SearchBox from '@/components/ui/SearchBox';
import { useAssignRecyclingContext } from '@/contexts/admin/AssignRecyclingContext';

const AssignRecyclingPage: React.FC = () => {
    const {
        recyclingCompanies,
        getCollectionCompanies,
        smallCollectionPoints,
        loading,
        fetchRecyclingCompanies,
        fetchSmallCollectionPoints,
        assignSmallPoints,
        updateSmallPointAssignment,
        getScpAssignmentDetail,
    } = useAssignRecyclingContext();

    const [search, setSearch] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [companySmallPoints, setCompanySmallPoints] = useState<any[]>([]);
    const [collectionCompanies, setCollectionCompanies] = useState<any[]>([]);

    useEffect(() => {
        getCollectionCompanies().then(setCollectionCompanies);
        fetchRecyclingCompanies();
        fetchSmallCollectionPoints();
    }, [getCollectionCompanies, fetchRecyclingCompanies, fetchSmallCollectionPoints]);

    const filteredCompanies = collectionCompanies.filter((company) => {
        const companyName = company.companyName || company.name || '';
        const matchSearch = companyName.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleAssignPoints = async (data: Array<{ recyclingCompanyId: string; smallCollectionPointIds: string[] }>) => {
        await assignSmallPoints(data);
        await fetchRecyclingCompanies();
        await fetchSmallCollectionPoints();
        setShowAssignModal(false);
    };

    const handleViewDetail = async (companyId: string) => {
        const company = collectionCompanies.find(c => (c.companyId || c.id) === companyId);
        if (company) {
            setSelectedCompany(company);
            const data = await getScpAssignmentDetail(companyId);
            setCompanySmallPoints(data?.smallPoints || []);
            setShowUpdateModal(true);
        }
    };

    const handleUpdateAssignment = async (scpId: string, newRecyclingCompanyId: string) => {
        await updateSmallPointAssignment(scpId, { newRecyclingCompanyId });
        await fetchRecyclingCompanies();
        await fetchSmallCollectionPoints();
        // Refresh detail modal
        if (selectedCompany) {
            const data = await getScpAssignmentDetail(selectedCompany.companyId || selectedCompany.id);
            setCompanySmallPoints(data?.smallPoints || []);
        }
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header + Search */}
            <div className='mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Recycle className='text-white' size={20} />
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900'>Phân công tái chế</h1>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center flex-1 justify-end'>
                          <button
                            onClick={() => setShowAssignModal(true)}
                            className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition cursor-pointer font-medium'
                        >
                            <Plus size={18} />
                            Phân công điểm thu gom
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
            </div>

            {/* Company List */}
            <AssignRecyclingList
                companies={filteredCompanies}
                loading={loading}
                onViewTasks={() => {}}
                onViewDetail={handleViewDetail}
            />

            {/* Assign Modal */}
            {showAssignModal && (
                <AssignRecyclingModal
                    open={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    onConfirm={handleAssignPoints}
                    companies={recyclingCompanies}
                    smallPoints={smallCollectionPoints}
                />
            )}

            {/* Update Recycling Modal */}
            {showUpdateModal && selectedCompany && (
                <UpdateRecyclingModal
                    open={showUpdateModal}
                    onClose={() => {
                        setShowUpdateModal(false);
                        setSelectedCompany(null);
                    }}
                    companyName={selectedCompany.name || selectedCompany.companyName || ''}
                    smallPoints={companySmallPoints}
                    recyclingCompanies={recyclingCompanies}
                    onUpdateAssignment={handleUpdateAssignment}
                />
            )}
            {/* Tasks Modal removed as requested */}
        </div>
    );
};

export default AssignRecyclingPage;
