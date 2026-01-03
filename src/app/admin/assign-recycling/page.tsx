'use client';

import React, { useState, useEffect } from 'react';
import { Recycle, Plus } from 'lucide-react';
import AssignedRecyclingList from '@/components/admin/assign-recycling/AssignedRecyclingList';
import AssignRecyclingModal from '@/components/admin/assign-recycling/modal/AssignRecyclingModal';
import TasksModal from '@/components/admin/assign-recycling/modal/TasksModal';
import SearchBox from '@/components/ui/SearchBox';
import { useAssignRecyclingContext } from '@/contexts/admin/AssignRecyclingContext';

const AssignRecyclingPage: React.FC = () => {
    const {
        recyclingCompanies,
        smallCollectionPoints,
        loading,
        fetchRecyclingCompanies,
        fetchSmallCollectionPoints,
        assignSmallPoints,
        fetchRecyclingTasks
    } = useAssignRecyclingContext();

    const [search, setSearch] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState<any>(null);
    const [selectedCompanyName, setSelectedCompanyName] = useState('');

    useEffect(() => {
        fetchRecyclingCompanies();
        fetchSmallCollectionPoints();
    }, [fetchRecyclingCompanies, fetchSmallCollectionPoints]);

    const filteredCompanies = recyclingCompanies.filter((company) => {
        const matchSearch = company.companyName?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const handleAssignPoints = async (data: { recyclingCompanyId: string; smallCollectionPointIds: string[] }) => {
        await assignSmallPoints(data);
        await fetchRecyclingCompanies();
        await fetchSmallCollectionPoints();
        setShowAssignModal(false);
    };

    const handleViewTasks = async (companyId: string) => {
        const company = recyclingCompanies.find(c => c.companyId === companyId);
        if (company) {
            setSelectedCompanyName(company.companyName);
            const tasks = await fetchRecyclingTasks(companyId);
            setSelectedTasks(tasks);
            setShowTasksModal(true);
        }
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
                    <div className='max-w-md w-full sm:ml-auto'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm theo tên công ty...'
                        />
                    </div>
                </div>
                <div className='mt-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                    <div className='flex flex-1 justify-end w-full sm:w-auto mt-2 sm:mt-0'>
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition cursor-pointer font-medium'
                        >
                            <Plus size={18} />
                            Phân công điểm thu gom
                        </button>
                    </div>
                </div>
            </div>

            {/* Company List */}
            <AssignedRecyclingList
                companies={filteredCompanies}
                loading={loading}
                onViewTasks={handleViewTasks}
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

            {/* Tasks Modal */}
            {showTasksModal && (
                <TasksModal
                    open={showTasksModal}
                    onClose={() => {
                        setShowTasksModal(false);
                        setSelectedTasks(null);
                        setSelectedCompanyName('');
                    }}
                    tasks={selectedTasks}
                    companyName={selectedCompanyName}
                />
            )}
        </div>
    );
};

export default AssignRecyclingPage;
