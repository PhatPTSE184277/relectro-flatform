import React from 'react';
import SystemConfigShow from './SystemConfigShow';
import SystemConfigTableSkeleton from './SystemConfigTableSkeleton';
import { SystemConfig } from '@/services/admin/SystemConfigService';

interface SystemConfigListProps {
    configs: SystemConfig[];
    loading: boolean;
    onEdit: (config: SystemConfig) => void;
    onViewFile?: (config: SystemConfig) => void;
}

const SystemConfigList: React.FC<SystemConfigListProps> = ({
    configs,
    loading,
    onEdit,
    onViewFile
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
            <div className='overflow-x-auto'>
                    <div className='max-h-105 overflow-y-auto'>
                    <table className='min-w-full text-sm text-gray-800 table-fixed'>
                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                            <tr>
                                <th className='py-3 px-4 text-center w-16'>STT</th>
                                <th className='py-3 px-4 text-left w-56'>Tên hiển thị</th>
                                <th className='py-3 px-4 text-right w-56'>Giá trị</th>
                                <th className='py-3 px-4 text-center w-36'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <SystemConfigTableSkeleton key={idx} />
                                ))
                            ) : configs.length > 0 ? (
                                configs.map((config, idx) => (
                                    <SystemConfigShow
                                        key={config.systemConfigId}
                                        config={config}
                                        onEdit={onEdit}
                                        onViewFile={onViewFile}
                                        isLast={idx === configs.length - 1}
                                        index={idx}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='text-center py-8 text-gray-400'>
                                        Không có cấu hình nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemConfigList;
