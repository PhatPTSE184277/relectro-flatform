'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AssignRecyclingPointList from './AssignRecyclingPointList';
import RecyclingCompanySelectModal from './RecyclingSelectModal';
import { useAssignRecyclingContext } from '@/contexts/admin/AssignRecyclingContext';

interface SmallCollectionPoint {
    smallPointId: string;
    name: string;
    address: string;
    recyclingCompany: string | null;
}

interface UpdateRecyclingModalProps {
    open: boolean;
    onClose: () => void;
    companyId: string;
    companyName: string;
    onUpdateAssignment: (scpId: string, newRecyclingCompanyId: string) => void;
}

const UpdateRecyclingModal: React.FC<UpdateRecyclingModalProps> = ({
    open,
    onClose,
    companyId,
    companyName,
    onUpdateAssignment
}) => {
    const [showRecyclingModal, setShowRecyclingModal] = useState(false);
    const [selectedPointForUpdate, setSelectedPointForUpdate] = useState<string | null>(null);
    const [pointRecyclingAssignments, setPointRecyclingAssignments] = useState<Record<string, string>>({});
    const [smallPoints, setSmallPoints] = useState<SmallCollectionPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const { fetchRecyclingCompanies, recyclingCompanies, getScpAssignmentDetail } = useAssignRecyclingContext();

    // Fetch small points when modal opens
    useEffect(() => {
        if (open && companyId) {
            setLoading(true);
            getScpAssignmentDetail(companyId)
                .then((data) => {
                    setSmallPoints(data?.smallPoints || []);
                })
                .catch(() => {
                    setSmallPoints([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, companyId, getScpAssignmentDetail]);

    const handleOpenCompanyModal = async (pointId: string) => {
        await fetchRecyclingCompanies();
        setSelectedPointForUpdate(pointId);
        setShowRecyclingModal(true);
    };

    const handleSelectRecyclingCompany = async (recyclingCompanyId: string) => {
        if (selectedPointForUpdate) {
            // Lưu lại mapping giữa điểm và công ty tái chế
            setPointRecyclingAssignments(prev => ({
                ...prev,
                [selectedPointForUpdate]: recyclingCompanyId
            }));
            // Gọi API update luôn
            await onUpdateAssignment(selectedPointForUpdate, recyclingCompanyId);
            // Refresh data after update
            const data = await getScpAssignmentDetail(companyId);
            setSmallPoints(data?.smallPoints || []);
            setSelectedPointForUpdate(null);
        }
    };

    const handleClose = () => {
        setShowRecyclingModal(false);
        setSelectedPointForUpdate(null);
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
                        <h2 className='text-2xl font-bold text-gray-900'>Cập nhật phân công tái chế</h2>
                        <p className='text-sm text-gray-600 mt-1'>{companyName}</p>
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
                    {/* Small Collection Points */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Điểm thu gom nhỏ
                        </label>
                        <AssignRecyclingPointList
                            points={smallPoints}
                            loading={loading}
                            onSelectCompany={handleOpenCompanyModal}
                            pointRecyclingAssignments={pointRecyclingAssignments}
                            recyclingCompanies={recyclingCompanies}
                        />
                    </div>
                </div>
                {/* Footer */}
                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white rounded-b-2xl'>
                   
                </div>
            </div>

            {/* Recycling Company Select Modal */}
            <RecyclingCompanySelectModal
                open={showRecyclingModal}
                companies={recyclingCompanies}
                selectedCompanyId={
                    selectedPointForUpdate 
                        ? (() => {
                            const point = smallPoints.find(p => p.smallPointId === selectedPointForUpdate);
                            if (point && point.recyclingCompany) {
                                if (typeof point.recyclingCompany === 'object' && point.recyclingCompany !== null && 'companyId' in point.recyclingCompany) {
                                    return (point.recyclingCompany as { companyId?: string }).companyId;
                                }
                                if (typeof point.recyclingCompany === 'string') {
                                    return point.recyclingCompany;
                                }
                            }
                            return undefined;
                        })()
                        : undefined
                }
                onClose={() => {
                    setShowRecyclingModal(false);
                    setSelectedPointForUpdate(null);
                }}
                onSelect={handleSelectRecyclingCompany}
            />
        </div>
    );
}

export default UpdateRecyclingModal;
