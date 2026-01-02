'use client';

import React, { useState } from 'react';
import { useSystemConfigContext } from '@/contexts/admin/SystemConfigContext';
import { Settings } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import SystemConfigList from '@/components/admin/system-config/SystemConfigList';
import EditSystemConfigModal from '@/components/admin/system-config/modal/EditSystemConfigModal';
import { SystemConfig } from '@/services/admin/SystemConfigService';
import { toast } from 'react-toastify';

const SystemConfigPage: React.FC = () => {
    const { configs, loading, updateConfig } = useSystemConfigContext();

    const [search, setSearch] = useState('');
    const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const filteredConfigs = configs.filter((config) => {
        const searchLower = search.toLowerCase();
        return (
            config.key?.toLowerCase().includes(searchLower) ||
            config.displayName?.toLowerCase().includes(searchLower) ||
            config.groupName?.toLowerCase().includes(searchLower)
        );
    });

    const handleEditConfig = (config: SystemConfig) => {
        setSelectedConfig(config);
        setShowEditModal(true);
    };

    const handleUpdateConfig = async (id: string, value?: string | null, file?: File | null) => {
        const result = await updateConfig(id, value, file);
        if (result) {
            toast.success('Cập nhật cấu hình thành công');
        } else {
            toast.error('Lỗi khi cập nhật cấu hình');
        }
        setShowEditModal(false);
        setSelectedConfig(null);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header + Search */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <Settings className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Cấu hình hệ thống
                    </h1>
                </div>
                <div className='flex-1 max-w-md'>
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder='Tìm kiếm cấu hình...'
                    />
                </div>
            </div>

            {/* Config List */}
            <SystemConfigList
                configs={filteredConfigs}
                loading={loading}
                onEdit={handleEditConfig}
            />

            {/* Edit Modal */}
            {showEditModal && (
                <EditSystemConfigModal
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedConfig(null);
                    }}
                    onConfirm={handleUpdateConfig}
                    config={selectedConfig}
                />
            )}
        </div>
    );
};

export default SystemConfigPage;
