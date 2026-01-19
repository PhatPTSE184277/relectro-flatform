'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCollectorContext } from '@/contexts/company/CollectorContext';
import CollectorList from '@/components/company/collector/CollectorList';
import CollectorDetail from '@/components/company/collector/modal/CollectorDetail';
import SearchBox from '@/components/ui/SearchBox';
import { Collector } from '@/types';
import { Users } from 'lucide-react';
import ImportCollectorModal from '@/components/company/collector/modal/ImportCollectorModal';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/ui/Pagination';

const CollectorPage: React.FC = () => {
    const { user } = useAuth();
    const { collectors, loading, fetchCollectors, importCollectors, page, limit, total, setPage } = useCollectorContext();
    const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);

    const companyId = user?.collectionCompanyId;

    useEffect(() => {
        if (companyId) {
            fetchCollectors(companyId, page, limit);
        }
    }, [fetchCollectors, companyId, page, limit]);

    const handleViewDetail = (collector: Collector) => {
        setSelectedCollector(collector);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedCollector(null);
    };

    const handleImportExcel = async (file: File) => {
        if (!companyId) {
            return;
        }
        try {
            await importCollectors(file);
            await fetchCollectors(companyId, page, limit);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const filteredCollectors = collectors.filter((collector) => {
        const searchLower = search.toLowerCase();
        return (
            collector.name?.toLowerCase().includes(searchLower) ||
            collector.email?.toLowerCase().includes(searchLower) ||
            collector.phone?.toLowerCase().includes(searchLower) ||
            collector.collectorId?.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(total / limit);

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Users className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Quản lý nhân viên thu gom
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    <button
                        type='button'
                        className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
                        onClick={() => setShowImportModal(true)}
                    >
                        <IoCloudUploadOutline size={20} />
                        Import từ Excel
                    </button>
                    <div className='flex-1 max-w-md'>
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder='Tìm kiếm nhân viên...'
                        />
                    </div>
                </div>
            </div>

            {/* Collector List */}
            <CollectorList
                collectors={filteredCollectors}
                loading={loading}
                onViewDetail={handleViewDetail}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Detail Modal */}
            {showDetailModal && (
                <CollectorDetail
                    collector={selectedCollector}
                    onClose={handleCloseModal}
                />
            )}

            {/* Import Excel Modal */}
            {showImportModal && (
                <ImportCollectorModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportExcel}
                />
            )}
        </div>
    );
};

export default CollectorPage;
