'use client';

import React, { useState, useEffect } from 'react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { X } from 'lucide-react';
import { getCollectionCompanies } from '@/services/admin/CollectionCompanyService';
import { getScpAssignmentDetail, getRecyclingCompanies } from '@/services/admin/AssignRecyclingService';
import AssignRecyclingPointList from './AssignRecyclingPointList';
import RecyclingCompanySelectModal from './RecyclingSelectModal';

interface SmallCollectionPoint {
    smallPointId: string;
    name: string;
    address: string;
    recyclingCompany: string | null;
}

interface AssignRecyclingModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: Array<{ recyclingCompanyId: string; smallCollectionPointIds: string[] }>) => void;
    companies: any[];
    smallPoints: SmallCollectionPoint[];
}

const AssignRecyclingModal: React.FC<AssignRecyclingModalProps> = ({
    open,
    onClose,
    onConfirm,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    companies: _companies,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    smallPoints: _smallPoints
}) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [companySmallPoints, setCompanySmallPoints] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPoints, setLoadingPoints] = useState(false);
    const [recyclingCompanies, setRecyclingCompanies] = useState<any[]>([]);
    const [showRecyclingModal, setShowRecyclingModal] = useState(false);
    const [selectedPointForAssignment, setSelectedPointForAssignment] = useState<string | null>(null);
    const [pointRecyclingAssignments, setPointRecyclingAssignments] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            // Gọi API lấy danh sách công ty thu gom
            getCollectionCompanies().then((data) => {
                // Chuẩn hóa: luôn có companyId là string duy nhất
                const normalized = data.map((c: any) => ({
                    ...c,
                    companyId: c.id?.toString() || c.companyId
                }));
                setCompanies(normalized);
                const firstCompany = normalized.length > 0 ? normalized[0].companyId : '';
                setSelectedCompanyId(firstCompany);
            });
            // Gọi API lấy danh sách công ty tái chế
            getRecyclingCompanies().then((data) => {
                setRecyclingCompanies(data);
            });
        }
    }, [open]);

    // Gọi API lấy danh sách điểm thu gom khi chọn công ty
    useEffect(() => {
        if (selectedCompanyId) {
            setLoadingPoints(true);
            getScpAssignmentDetail(selectedCompanyId)
                .then((data) => {
                    setCompanySmallPoints(data?.smallPoints || []);
                })
                .catch(() => {
                    setCompanySmallPoints([]);
                })
                .finally(() => {
                    setLoadingPoints(false);
                });
        } else {
            setCompanySmallPoints([]);
        }
    }, [selectedCompanyId]);

    const handleConfirm = async () => {
        if (!selectedCompanyId) {
            return;
        }
        // Kiểm tra có assignment nào không
        if (Object.keys(pointRecyclingAssignments).length === 0) {
            return;
        }
        setLoading(true);
        try {
            // Gom các points theo recyclingCompanyId
            const groupedByCompany: Record<string, string[]> = {};
            for (const [pointId, recyclingCompanyId] of Object.entries(pointRecyclingAssignments)) {
                if (!groupedByCompany[recyclingCompanyId]) {
                    groupedByCompany[recyclingCompanyId] = [];
                }
                groupedByCompany[recyclingCompanyId].push(pointId);
            }
            
            // Chuyển thành array format đúng
            const assignments: Array<{ recyclingCompanyId: string; smallCollectionPointIds: string[] }> = [];
            for (const [recyclingCompanyId, pointIds] of Object.entries(groupedByCompany)) {
                assignments.push({
                    recyclingCompanyId,
                    smallCollectionPointIds: pointIds
                });
            }
            
            // Gọi API với array format
            await onConfirm(assignments);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCompanyModal = (pointId: string) => {
        setSelectedPointForAssignment(pointId);
        setShowRecyclingModal(true);
    };

    const handleSelectRecyclingCompany = (recyclingCompanyId: string) => {
        if (selectedPointForAssignment) {
            // Lưu lại mapping giữa điểm và công ty tái chế
            setPointRecyclingAssignments(prev => ({
                ...prev,
                [selectedPointForAssignment]: recyclingCompanyId
            }));
            setSelectedPointForAssignment(null);
        }
    };

    const handleClose = () => {
        setSelectedCompanyId('');
        setShowRecyclingModal(false);
        setSelectedPointForAssignment(null);
        setPointRecyclingAssignments({});
        onClose();
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-visible z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 bg-linear-to-r from-primary-50 to-primary-100 rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Phân công điểm thu gom</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>
                {/* Body */}
                <div className='flex-1 overflow-visible p-6 space-y-6'>
                    {/* Company Selection */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Công ty thu gom <span className='text-red-500'>*</span>
                        </label>
                        <SearchableSelect
                            options={companies}
                            value={selectedCompanyId}
                            onChange={setSelectedCompanyId}
                            getLabel={(company) => company.companyName || company.name}
                            getValue={(company) => company.companyId}
                            placeholder='-- Chọn công ty thu gom --'
                        />
                    </div>
                    {/* Small Collection Points of selected company */}
                    {selectedCompanyId && (
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                Điểm thu gom nhỏ <span className='text-red-500'>*</span>
                            </label>
                            <AssignRecyclingPointList
                                points={companySmallPoints}
                                loading={loadingPoints}
                                onSelectCompany={handleOpenCompanyModal}
                                pointRecyclingAssignments={pointRecyclingAssignments}
                                recyclingCompanies={recyclingCompanies}
                                isAssignMode={true}
                            />
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white rounded-b-2xl'>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !selectedCompanyId || Object.keys(pointRecyclingAssignments).length === 0}
                        className='px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>

            {/* Recycling Company Select Modal */}
            <RecyclingCompanySelectModal
                open={showRecyclingModal}
                companies={recyclingCompanies}
                selectedCompanyId={selectedPointForAssignment ? pointRecyclingAssignments[selectedPointForAssignment] : undefined}
                onClose={() => {
                    setShowRecyclingModal(false);
                    setSelectedPointForAssignment(null);
                }}
                onSelect={handleSelectRecyclingCompany}
            />
        </div>
    );
}

export default AssignRecyclingModal;
