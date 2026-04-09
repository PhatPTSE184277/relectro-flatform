'use client';

import React, { useState, useEffect } from 'react';
import RatioConfigModal from './RatioConfigModal';
import DetailConfigModal from './DetailConfigModal';

interface UpdateConfigModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (companies: any[]) => void;
    companies: any[];
    selectedCompany?: any | null; // Nếu có thì chỉnh sửa chi tiết, không thì phân bổ tỷ lệ
    mode?: 'ratio' | 'detail'; // 'ratio' = phân bổ tỷ lệ, 'detail' = chỉnh sửa chi tiết
}

const UpdateConfigModal: React.FC<UpdateConfigModalProps> = ({
    open,
    onClose,
    onConfirm,
    companies,
    selectedCompany = null,
    mode = 'ratio'
}) => {
    const [companiesData, setCompaniesData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'ratio' | 'detail'>(mode);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            setCompaniesData(companies.map(c => ({ ...c })));
            setActiveTab(selectedCompany ? 'detail' : 'ratio');
            setSelectedCompanyId(selectedCompany?.companyId || null);
        }
    }, [open, companies, selectedCompany]);

    const handleRatioChange = (companyId: number, newRatio: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? { ...c, ratioPercent: newRatio }
                    : c
            )
        );
    };

    const handleUpdateRadius = (companyId: number, smallPointId: number, radiusKm: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? {
                        ...c,
                        smallPoints: c.smallPoints.map((sp: any) =>
                            sp.smallPointId === smallPointId
                                ? { ...sp, radiusKm }
                                : sp
                        )
                    }
                    : c
            )
        );
    };

    const handleUpdateMaxDistance = (companyId: number, smallPointId: number, maxRoadDistanceKm: number) => {
        setCompaniesData(prev =>
            prev.map(c =>
                c.companyId === companyId
                    ? {
                        ...c,
                        smallPoints: c.smallPoints.map((sp: any) =>
                            sp.smallPointId === smallPointId
                                ? { ...sp, maxRoadDistanceKm }
                                : sp
                        )
                    }
                    : c
            )
        );
    };

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!canSubmit) return;
        try {
            setLoading(true);
            await Promise.resolve(onConfirm(companiesData));
        } catch (err) {
            console.error('Update config error', err);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleCompanyClick = (company: any) => {
        setSelectedCompanyId(company.companyId);
        setActiveTab('detail');
    };

    useEffect(() => {
        if (activeTab === 'ratio') {
            setSelectedCompanyId(null);
        }
    }, [activeTab]);

    const handleClose = () => {
        onClose();
    };

    const totalPercent = companiesData.reduce((sum, c) => sum + (c.ratioPercent || 0), 0);
    const isValidTotal = totalPercent === 100;
    
    // Validate: tất cả ratioPercent > 0
    const allRatiosValid = companiesData.every(c => (c.ratioPercent || 0) > 0);
    
    // Nút submit chỉ được bật khi tất cả > 0 và tổng = 100%
    const canSubmit = allRatiosValid && isValidTotal;
    
    // Luôn lấy company từ companiesData để đảm bảo cập nhật real-time
    const currentCompany = selectedCompanyId 
        ? companiesData.find(c => c.companyId === selectedCompanyId)
        : null;

    if (!open) return null;

    return (
        <>
            <RatioConfigModal
                open={activeTab === 'ratio'}
                onClose={handleClose}
                companies={companiesData}
                totalPercent={totalPercent}
                isValidTotal={isValidTotal}
                canSubmit={canSubmit}
                loading={loading}
                onRatioChange={handleRatioChange}
                onEditDetail={handleCompanyClick}
                onConfirm={handleConfirm}
            />

            <DetailConfigModal
                open={activeTab === 'detail' && !!currentCompany}
                onClose={handleClose}
                onBack={() => setActiveTab('ratio')}
                company={currentCompany}
                onUpdateRadius={handleUpdateRadius}
                onUpdateMaxDistance={handleUpdateMaxDistance}
            />
        </>
    );
};

export default UpdateConfigModal;
