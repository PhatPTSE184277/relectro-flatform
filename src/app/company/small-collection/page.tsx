'use client';

import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MapPin } from 'lucide-react';
import { useSmallCollectionContext } from '@/contexts/company/SmallCollectionContext';
import SmallCollectionList from '@/components/company/small-collection/SmallCollectionList';
import SmallCollectionMap from '@/components/company/small-collection/SmallCollectionMap';
import SmallCollectionDetail from '@/components/company/small-collection/modal/SmallCollectionDetail';
import SearchBox from '@/components/ui/SearchBox';
import ImportExcelModal from '@/components/admin/collection-company/modal/ImportComapnyModal';
import SmallCollectionFilter from '@/components/company/small-collection/SmallCollectionFilter';
import { toast } from 'react-toastify';
import { SmallCollectionPoint } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const SmallCollectionPage: React.FC = () => {
    const { user } = useAuth();
    const {
        smallCollections,
        loading,
        importSmallCollection
    } = useSmallCollectionContext();

    const [selectedSmallCollection, setSelectedSmallCollection] =
        useState<SmallCollectionPoint | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState('active');

    const companyId = user?.collectionCompanyId;

    const handleViewDetail = (point: SmallCollectionPoint) => {
        setSelectedSmallCollection(point);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedSmallCollection(null);
    };

    const handleImportExcel = async (file: File) => {
        if (!companyId) {
            toast.error('Không tìm thấy thông tin công ty');
            return;
        }
        try {
            await importSmallCollection(file);
            toast.success('Import thành công');
        } catch (error) {
            toast.error('Import thất bại');
        }
    };

    const filteredCollections = smallCollections.filter((point) => {
        const searchLower = search.toLowerCase();
        const matchSearch =
            point.name?.toLowerCase().includes(searchLower) ||
            point.address?.toLowerCase().includes(searchLower);
        if (filterStatus === 'active') {
            return matchSearch && point.status === 'Active';
        }
        if (filterStatus === 'inactive') {
            return matchSearch && point.status !== 'Active';
        }
        return matchSearch;
    });

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <MapPin className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Điểm thu gom nhỏ
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
                            placeholder='Tìm kiếm điểm thu gom...'
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='mb-6'>
                <SmallCollectionFilter status={filterStatus} onFilterChange={setFilterStatus} />
            </div>

            {/* Main Content: List + Map */}
            <div className='flex-1 flex overflow-hidden min-h-[600px]'>
                {/* List - Left Side */}
                <div className='w-1/2 overflow-y-auto p-6 border-r border-gray-200'>
                    <SmallCollectionList
                        collections={filteredCollections}
                        loading={loading}
                        onViewDetail={handleViewDetail}
                        selectedId={selectedId}
                        onSelectPoint={setSelectedId}
                    />
                </div>

                {/* Map - Right Side */}
                <div className='w-1/2 relative'>
                    <SmallCollectionMap
                        collections={filteredCollections}
                        selectedId={selectedId}
                        onSelectPoint={setSelectedId}
                        onViewDetail={handleViewDetail}
                    />
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && (
                <SmallCollectionDetail
                    point={selectedSmallCollection}
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

export default SmallCollectionPage;
