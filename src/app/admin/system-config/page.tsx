'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSystemConfigContext } from '@/contexts/admin/SystemConfigContext';
import { Edit, Settings } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import SearchableSelect from '@/components/ui/SearchableSelect';
import SystemConfigList from '@/components/admin/system-config/SystemConfigList';
import EditSystemConfigModal from '@/components/admin/system-config/modal/EditSystemConfigModal';
import SystemConfigFilter from '@/components/admin/system-config/SystemConfigFilter';
import { SystemConfig, AutoAssignSettings, WarehouseLoadThresholdConfig } from '@/services/admin/SystemConfigService';
import AutoAssignSettingsModal from '@/components/admin/system-config/modal/AutoAssignSettingsModal';
import LoadThresholdList from '@/components/admin/system-config/load-threshold/LoadThresholdList';
import EditLoadThresholdModal from '@/components/admin/system-config/load-threshold/modal/EditLoadThresholdModal';
import { filterCollectionCompanies, filterSmallCollectionPoints } from '@/services/admin/TrackingService';

const SystemConfigPage: React.FC = () => {
    const {
        configs,
        loading,
        updateConfig,
        fetchConfigs,
        autoAssignSettings,
        autoAssignLoading,
        fetchAutoAssignSettings,
        saveAutoAssignSettings,
        saveWarehouseLoadThreshold,
        error
    } = useSystemConfigContext();

    const [search, setSearch] = useState('');
    const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [groupName, setGroupName] = useState<string>('');
    const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
    const [selectedLoadThresholdConfig, setSelectedLoadThresholdConfig] = useState<WarehouseLoadThresholdConfig | null>(null);
    const [showLoadThresholdModal, setShowLoadThresholdModal] = useState(false);

    const [selectedScpName, setSelectedScpName] = useState<string>('');
    const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');
    const [selectedLoadCompanyId, setSelectedLoadCompanyId] = useState<string>('');
    const [selectedLoadWarehouseId, setSelectedLoadWarehouseId] = useState<string>('');
    const [loadCompanies, setLoadCompanies] = useState<any[]>([]);
    const [loadWarehouses, setLoadWarehouses] = useState<any[]>([]);
    const [loadingLoadCompanies, setLoadingLoadCompanies] = useState(false);
    const [loadingLoadWarehouses, setLoadingLoadWarehouses] = useState(false);

    const [autoAssignDraft, setAutoAssignDraft] = useState<AutoAssignSettings>({
        isEnabled: false,
        immediateThreshold: 0,
        scheduleTime: '00:00',
        scheduleMinQty: 0
    });

    const groupNames = [
        { value: 'WORKFLOW_CONFIG', label: 'Luồng xử lý' },
        { value: 'AUTO_ASSIGN_SETTINGS', label: 'Tự động phân xe' },
        { value: 'Excel', label: 'Mẫu Excel' },
        { value: 'PointConfig', label: 'Cấu hình điểm' },
        { value: 'CompanyConfig', label: 'Cấu hình công ty' },
        { value: 'LoadThreshold', label: 'Ngưỡng tải đơn vị thu gom' }
    ];

    const getCompanyId = useCallback((company: any): string => {
        return String(company?.id || company?.companyId || company?.collectionCompanyId || '');
    }, []);

    const getWarehouseId = useCallback((warehouse: any): string => {
        return String(
            warehouse?.collectionUnitId ||
            warehouse?.smallCollectionPointId ||
            warehouse?.smallCollectionPointsId ||
            warehouse?.pointId ||
            warehouse?.smallPointId ||
            warehouse?.id ||
            ''
        );
    }, []);

    const getWarehouseName = useCallback((warehouse: any): string => {
        return String(
            warehouse?.collectionUnitName ||
            warehouse?.name ||
            warehouse?.pointName ||
            warehouse?.smallCollectionPointName ||
            'N/A'
        );
    }, []);

    // Load auto-assign settings when the tab is selected.
    useEffect(() => {
        if (groupName === 'AUTO_ASSIGN_SETTINGS') {
            void fetchAutoAssignSettings();
        }
    }, [groupName, fetchAutoAssignSettings]);

    // Auto select first groupName if not selected
    useEffect(() => {
        if (!groupName && groupNames.length > 0) {
            setGroupName(groupNames[0].value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupNames.map(g => g.value).join(',')]);

    // Always re-fetch when entering page to ensure data is from latest API response.
    useEffect(() => {
        void fetchConfigs();
    }, [fetchConfigs]);

    useEffect(() => {
        const fetchLoadCompanies = async () => {
            setLoadingLoadCompanies(true);
            try {
                const data = await filterCollectionCompanies({ page: 1, limit: 100, status: 'Đang hoạt động' });
                const list = Array.isArray(data) ? data : (data?.data || []);
                setLoadCompanies(Array.isArray(list) ? list : []);
            } catch {
                setLoadCompanies([]);
            } finally {
                setLoadingLoadCompanies(false);
            }
        };

        void fetchLoadCompanies();
    }, []);

    useEffect(() => {
        if (groupName !== 'LoadThreshold') return;
        if (selectedLoadCompanyId) return;
        if (!loadCompanies.length) return;

        const firstCompanyId = getCompanyId(loadCompanies[0]);
        if (firstCompanyId) setSelectedLoadCompanyId(firstCompanyId);
    }, [groupName, selectedLoadCompanyId, loadCompanies, getCompanyId]);

    useEffect(() => {
        const fetchLoadWarehouses = async () => {
            if (!selectedLoadCompanyId) {
                setLoadWarehouses([]);
                setSelectedLoadWarehouseId('');
                return;
            }

            setLoadingLoadWarehouses(true);
            try {
                const data = await filterSmallCollectionPoints({ page: 1, limit: 200, companyId: selectedLoadCompanyId });
                const list = Array.isArray(data) ? data : (data?.data || []);
                const normalized = Array.isArray(list) ? list : [];
                setLoadWarehouses(normalized);

                const hasValid = normalized.some((w: any) => getWarehouseId(w) === selectedLoadWarehouseId);
                if (!hasValid) {
                    const firstWarehouseId = getWarehouseId(normalized[0]);
                    setSelectedLoadWarehouseId(firstWarehouseId || '');
                }
            } catch {
                setLoadWarehouses([]);
                setSelectedLoadWarehouseId('');
            } finally {
                setLoadingLoadWarehouses(false);
            }
        };

        if (groupName === 'LoadThreshold') {
            void fetchLoadWarehouses();
        }
    }, [groupName, selectedLoadCompanyId, selectedLoadWarehouseId, getWarehouseId]);

    // Reset extra filters when switching group and auto-select first option for point/company groups.
    useEffect(() => {
        setSelectedScpName('');
        setSelectedCompanyName('');
    }, [groupName]);

    const scpOptions = useMemo(() => {
        const names = Array.from(
            new Set(
                configs
                    .filter((c) => c.groupName === 'PointConfig' || c.groupName === 'LoadThreshold')
                    .map((c) => String(c.scpName || ''))
                    .filter((n) => n && n !== 'N/A')
            )
        ).sort((a, b) => a.localeCompare(b));

        return names.map((n) => ({ value: n, label: n }));
    }, [configs]);

    const companyOptions = useMemo(() => {
        const names = Array.from(
            new Set(
                configs
                    .filter((c) => c.groupName === 'CompanyConfig' || c.groupName === 'LoadThreshold')
                    .map((c) => String(c.companyName || ''))
                    .filter((n) => n && n !== 'N/A')
            )
        ).sort((a, b) => a.localeCompare(b));

        return names.map((n) => ({ value: n, label: n }));
    }, [configs]);

    // Auto-select first option when entering point/company groups (if available)
    useEffect(() => {
        if (groupName === 'PointConfig' && scpOptions.length > 0) {
            setSelectedScpName(scpOptions[0].value);
        }

        if (groupName === 'LoadThreshold' && scpOptions.length > 0) {
            setSelectedScpName(scpOptions[0].value);
        }

        if (groupName === 'CompanyConfig' && companyOptions.length > 0) {
            setSelectedCompanyName(companyOptions[0].value);
        }

        if (groupName === 'LoadThreshold' && companyOptions.length > 0) {
            setSelectedCompanyName(companyOptions[0].value);
        }
    }, [groupName, scpOptions, companyOptions]);

    // Filter hiển thị: lọc theo groupName + filter đơn vị thu gom/công ty + search
    const filteredConfigs = useMemo(() => {
        let arr = configs;
        if (groupName) arr = arr.filter(cfg => cfg.groupName === groupName);

        if (groupName === 'PointConfig' && selectedScpName) {
            arr = arr.filter((cfg) => String(cfg.scpName || '') === selectedScpName);
        }

        if (groupName === 'CompanyConfig' && selectedCompanyName) {
            arr = arr.filter((cfg) => String(cfg.companyName || '') === selectedCompanyName);
        }

        if (groupName === 'LoadThreshold') {
            const selectedCompany = loadCompanies.find((c: any) => getCompanyId(c) === selectedLoadCompanyId);
            const selectedWarehouse = loadWarehouses.find((w: any) => getWarehouseId(w) === selectedLoadWarehouseId);

            const selectedCompanyLabel = String(selectedCompany?.name || selectedCompany?.companyName || '').trim();
            const selectedWarehouseLabel = String(getWarehouseName(selectedWarehouse)).trim();

            if (selectedCompanyLabel) {
                arr = arr.filter((cfg) => String(cfg.companyName || '').trim() === selectedCompanyLabel);
            }

            if (selectedWarehouseLabel) {
                arr = arr.filter((cfg) => String(cfg.scpName || '').trim() === selectedWarehouseLabel);
            }
        }

        if (groupName === 'LoadThreshold') {
            return arr;
        }

        const searchLower = search.toLowerCase();
        return arr.filter((config) =>
            config.key?.toLowerCase().includes(searchLower) ||
            config.displayName?.toLowerCase().includes(searchLower) ||
            config.groupName?.toLowerCase().includes(searchLower)
        );
    }, [configs, groupName, search, selectedScpName, selectedCompanyName, loadCompanies, loadWarehouses, selectedLoadCompanyId, selectedLoadWarehouseId, getCompanyId, getWarehouseId, getWarehouseName]);

    const handleEditConfig = (config: SystemConfig) => {
        setSelectedConfig(config);
        setShowEditModal(true);
    };

    const handleUpdateConfig = async (id: string, value?: string | null, file?: File | null) => {
        await updateConfig(id, value, file);
        setShowEditModal(false);
        setSelectedConfig(null);
    };

    const handleSaveAutoAssign = async (payload: AutoAssignSettings) => {
        await saveAutoAssignSettings(payload);
    };

    const handleEditLoadThreshold = (config: WarehouseLoadThresholdConfig) => {
        const normalize = (value: any) => String(value || '').trim().toLowerCase();
        const matchedWarehouse = loadWarehouses.find((w: any) => normalize(getWarehouseName(w)) === normalize(config.scpName));
        const resolvedScpId = getWarehouseId(matchedWarehouse) || selectedLoadWarehouseId;

        setSelectedLoadThresholdConfig({
            ...config,
            smallCollectionPointId: resolvedScpId || config.smallCollectionPointId || config.scpId
        });
        setShowLoadThresholdModal(true);
    };

    const handleUpdateLoadThreshold = async (smallCollectionPointId: string, threshold: number) => {
        const ok = await saveWarehouseLoadThreshold(smallCollectionPointId, threshold);
        if (ok) {
            setShowLoadThresholdModal(false);
            setSelectedLoadThresholdConfig(null);
        }
    };

    const openAutoAssignModal = () => {
        const current = autoAssignSettings;
        setAutoAssignDraft({
            isEnabled: Boolean(current?.isEnabled ?? false),
            immediateThreshold: Number(current?.immediateThreshold ?? 0),
            scheduleTime: String(current?.scheduleTime ?? '00:00'),
            scheduleMinQty: Number(current?.scheduleMinQty ?? 0)
        });
        setShowAutoAssignModal(true);
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
                <div className='flex-1 flex items-center justify-end gap-3'>
                    {/* Standalone select box for PointConfig / CompanyConfig (no outer white card) */}
                    {groupName === 'PointConfig' && scpOptions.length > 0 && (
                        <div className='w-80'>
                            <SearchableSelect
                                options={scpOptions}
                                value={selectedScpName}
                                onChange={setSelectedScpName}
                                getLabel={(o: any) => o.label}
                                getValue={(o: any) => o.value}
                                placeholder='Chọn đơn vị thu gom...'
                            />
                        </div>
                    )}

                    {groupName === 'CompanyConfig' && companyOptions.length > 0 && (
                        <div className='w-80'>
                            <SearchableSelect
                                options={companyOptions}
                                value={selectedCompanyName}
                                onChange={setSelectedCompanyName}
                                getLabel={(o: any) => o.label}
                                getValue={(o: any) => o.value}
                                placeholder='Chọn công ty...'
                            />
                        </div>
                    )}

                    {groupName === 'LoadThreshold' ? (
                        <>
                            <div className='w-80'>
                                <SearchableSelect
                                    options={loadCompanies}
                                    value={selectedLoadCompanyId}
                                    onChange={(id) => {
                                        setSelectedLoadCompanyId(String(id));
                                        setSelectedLoadWarehouseId('');
                                    }}
                                    getLabel={(c: any) => c.name || c.companyName || 'N/A'}
                                    getValue={getCompanyId}
                                    placeholder={loadingLoadCompanies ? 'Đang tải công ty...' : 'Chọn công ty...'}
                                    disabled={loadingLoadCompanies}
                                />
                            </div>
                            <div className='w-80'>
                                <SearchableSelect
                                    options={loadWarehouses}
                                    value={selectedLoadWarehouseId}
                                    onChange={(id) => setSelectedLoadWarehouseId(String(id))}
                                    getLabel={getWarehouseName}
                                    getValue={getWarehouseId}
                                    placeholder={loadingLoadWarehouses ? 'Đang tải đơn vị thu gom...' : 'Chọn đơn vị thu gom...'}
                                    disabled={!selectedLoadCompanyId || loadingLoadWarehouses}
                                />
                            </div>
                        </>
                    ) : (
                        <div className='max-w-md flex-1'>
                            <SearchBox
                                value={search}
                                onChange={setSearch}
                                placeholder='Tìm kiếm cấu hình...'
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Filter groupName */}
            <SystemConfigFilter
                groupNames={groupNames}
                groupName={groupName}
                onFilterChange={setGroupName}
                scpOptions={scpOptions}
                selectedScpName={selectedScpName}
                onScpChange={setSelectedScpName}
                companyOptions={companyOptions}
                selectedCompanyName={selectedCompanyName}
                onCompanyChange={setSelectedCompanyName}
            />

            {groupName === 'AUTO_ASSIGN_SETTINGS' ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
                    <div className='flex items-center justify-between gap-2 px-6 py-4 border-b border-gray-100 bg-primary-50'>
                        <div>
                            <h2 className='text-lg font-bold text-gray-900'>Tự động phân xe</h2>
                            <p className='text-sm text-gray-500'>Danh sách cấu hình auto-assign.</p>
                        </div>
                        <div>
                            <button
                                onClick={openAutoAssignModal}
                                disabled={autoAssignLoading}
                                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                                    !autoAssignLoading
                                        ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <Edit size={16} />
                                Chỉnh sửa
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className='px-6 pt-4 text-sm text-red-600'>
                            {error}
                        </div>
                    )}

                    <div className='overflow-x-auto'>
                        <div className='max-h-105 overflow-y-auto'>
                            <table className='min-w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-72'>Tên cấu hình</th>
                                        <th className='py-3 px-4 text-center'>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {autoAssignLoading && !autoAssignSettings ? (
                                        Array.from({ length: 4 }).map((_, idx) => (
                                            <tr key={idx} className='border-b border-gray-100 hover:bg-primary-50/40'>
                                                <td className='py-3 px-4'>
                                                    <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
                                                </td>
                                                <td className='py-3 px-4 text-center'>
                                                    <div className='inline-block h-4 bg-gray-200 rounded w-32 animate-pulse' />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        [
                                            {
                                                label: 'Kích hoạt',
                                                value: autoAssignSettings?.isEnabled ? 'Bật' : 'Tắt'
                                            },
                                            {
                                                label: 'Immediate Threshold',
                                                value: String(autoAssignSettings?.immediateThreshold ?? '-')
                                            },
                                            {
                                                label: 'Schedule Time',
                                                value: String(autoAssignSettings?.scheduleTime ?? '-')
                                            },
                                            {
                                                label: 'Schedule Min Qty',
                                                value: String(autoAssignSettings?.scheduleMinQty ?? '-')
                                            }
                                        ].map((row, idx, arr) => (
                                            <tr
                                                key={row.label}
                                                className={`${idx !== arr.length - 1 ? 'border-b border-primary-100' : ''} ${
                                                    idx % 2 === 0 ? 'bg-white' : 'bg-primary-50'
                                                }`}
                                            >
                                                <td className='py-3 px-4 text-gray-700'>{row.label}</td>
                                                <td className='py-3 px-4 text-center font-medium text-gray-900'>{row.value}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <AutoAssignSettingsModal
                        open={showAutoAssignModal}
                        onClose={() => setShowAutoAssignModal(false)}
                        onConfirm={handleSaveAutoAssign}
                        value={autoAssignDraft}
                        onChange={setAutoAssignDraft}
                        loading={autoAssignLoading}
                    />
                </div>
            ) : groupName === 'LoadThreshold' ? (
                <>
                    <LoadThresholdList
                        configs={filteredConfigs as WarehouseLoadThresholdConfig[]}
                        loading={loading}
                        onEdit={handleEditLoadThreshold}
                    />

                    <EditLoadThresholdModal
                        key={selectedLoadThresholdConfig?.systemConfigId || 'load-threshold-modal'}
                        open={showLoadThresholdModal}
                        config={selectedLoadThresholdConfig}
                        loading={loading}
                        onClose={() => {
                            setShowLoadThresholdModal(false);
                            setSelectedLoadThresholdConfig(null);
                        }}
                        onConfirm={handleUpdateLoadThreshold}
                    />
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );

};

export default SystemConfigPage;
