'use client';

import React, { useEffect, useState } from 'react';
import { Settings2, Building2, KeyRound, MapPin } from 'lucide-react';
import { useSettingGroupContext } from '@/contexts/company/SettingGroupContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import EditSettingModal from '@/components/company/setting-group/modal/EditSettingModal';
import SettingGroupList from '@/components/company/setting-group/SettingGroupList';
import SearchBox from '@/components/ui/SearchBox';
import SummaryCard from '@/components/ui/SummaryCard';

const SettingGroupPage: React.FC = () => {
    const { companySetting, loading, fetchCompanySetting, createOrUpdatePointSetting } = useSettingGroupContext();
    const user = useSelector((state: RootState) => state.auth.user);
    const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (user?.collectionCompanyId) {
            fetchCompanySetting(String(user.collectionCompanyId));
        }
    }, [user?.collectionCompanyId, fetchCompanySetting]);

    const handleEdit = (point: any) => {
        setSelectedPoint(point);
        setShowModal(true);
    };

    const handleSave = async (pointId: string, serviceTime: number, travelTime: number) => {
        if (serviceTime <= 0 || travelTime <= 0) {
            toast.error('Thời gian phải lớn hơn 0');
            return;
        }

        await createOrUpdatePointSetting({
            pointId,
            serviceTimeMinutes: serviceTime,
            avgTravelTimeMinutes: travelTime
        });

        toast.success('Cập nhật cấu hình thành công');
        setShowModal(false);
        setSelectedPoint(null);
        
        // Refresh data
        if (user?.collectionCompanyId) {
            fetchCompanySetting(String(user.collectionCompanyId));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPoint(null);
    };

    const filteredPoints = companySetting?.points?.filter((point: any) => {
        const searchLower = search.toLowerCase();
        return (
            point.smallPointName?.toLowerCase().includes(searchLower) ||
            point.smallPointId?.toLowerCase().includes(searchLower)
        );
    }) || [];

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:gap-6'>
                <div className='flex items-center gap-3 shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Settings2 className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Cấu hình gom nhóm
                    </h1>
                </div>
                <div className='flex-1 max-w-md w-full sm:ml-auto'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm điểm thu gom...'
                    />
                </div>
            </div>

            {/* Company Info with SummaryCard */}
            {companySetting && (
                <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                        Thông tin công ty
                    </h2>
                    <SummaryCard
                        items={[
                            {
                                icon: <Building2 size={16} className='text-primary-400' />,
                                label: 'Tên công ty',
                                value: companySetting.companyName || 'N/A',
                            },
                            {
                                icon: <KeyRound size={16} className='text-primary-400' />,
                                label: 'Mã công ty',
                                value: companySetting.companyId || 'N/A',
                            },
                            {
                                icon: <MapPin size={16} className='text-primary-400' />,
                                label: 'Số điểm thu gom',
                                value: `${companySetting.points?.length || 0} điểm`,
                            },
                        ]}
                        columns={3}
                    />
                </div>
            )}

            {/* Points List */}
            <SettingGroupList
                points={filteredPoints}
                loading={loading}
                onEdit={handleEdit}
            />

            {/* Edit Modal */}
            {showModal && selectedPoint && (
                <EditSettingModal
                    open={showModal}
                    point={selectedPoint}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default SettingGroupPage;
