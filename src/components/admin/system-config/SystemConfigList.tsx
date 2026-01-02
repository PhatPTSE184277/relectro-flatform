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
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-center w-12'>STT</th>
                            <th className='py-3 px-4 text-left'>Tên hiển thị</th>
                            <th className='py-3 px-4 text-right'>Giá trị</th>
                            <th className='py-3 px-4 text-center'>Hành động</th>
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
                                <td colSpan={6} className='text-center py-8 text-gray-400'>
                                    Không có cấu hình nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SystemConfigList;
