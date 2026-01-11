'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSystemConfigContext } from '@/contexts/admin/SystemConfigContext';
import { Settings } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import SystemConfigList from '@/components/admin/system-config/SystemConfigList';
import EditSystemConfigModal from '@/components/admin/system-config/modal/EditSystemConfigModal';
import SystemConfigFilter from '@/components/admin/system-config/SystemConfigFilter';
import { SystemConfig } from '@/services/admin/SystemConfigService';

const SystemConfigPage: React.FC = () => {
    const { configs, loading, updateConfig } = useSystemConfigContext();

    const [search, setSearch] = useState('');
    const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [groupName, setGroupName] = useState<string>('');

        const groupNames = [
            { value: 'WORKFLOW_CONFIG', label: 'Luồng xử lý' },
            { value: 'Excel', label: 'Mẫu Excel' },
            { value: 'PointConfig', label: 'Cấu hình điểm' },
            { value: 'CompanyConfig', label: 'Cấu hình công ty' }
        ];

    // Auto select first groupName if not selected
    useEffect(() => {
        if (!groupName && groupNames.length > 0) {
            setGroupName(groupNames[0].value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupNames.map(g => g.value).join(',')]);

    // Filter hiển thị: lọc theo groupName và search
    const filteredConfigs = useMemo(() => {
        let arr = configs;
        if (groupName) arr = arr.filter(cfg => cfg.groupName === groupName);
        const searchLower = search.toLowerCase();
        return arr.filter((config) =>
            config.key?.toLowerCase().includes(searchLower) ||
            config.displayName?.toLowerCase().includes(searchLower) ||
            config.groupName?.toLowerCase().includes(searchLower)
        );
    }, [configs, groupName, search]);

    const handleEditConfig = (config: SystemConfig) => {
        setSelectedConfig(config);
        setShowEditModal(true);
    };

    const handleUpdateConfig = async (id: string, value?: string | null, file?: File | null) => {
        await updateConfig(id, value, file);
        setShowEditModal(false);
        setSelectedConfig(null);
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header + Search */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
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

            {/* Filter groupName */}
            <SystemConfigFilter
                groupNames={groupNames}
                groupName={groupName}
                onFilterChange={setGroupName}
            />

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
