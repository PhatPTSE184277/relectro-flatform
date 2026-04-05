'use client';

import React, { useState, useEffect } from 'react';
import { Warehouse, TrendingUp } from 'lucide-react';
import { formatWeightKg } from '@/utils/formatNumber';
import { useCapacityContext } from '@/contexts/admin/CapacityContext';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CapacityList from '@/components/admin/capacity/CapacityList';

const CapacityPage: React.FC = () => {
    const { companies, capacity, loadingCapacity, fetchCapacity } = useCapacityContext();
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // Auto-select first company
    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            const firstId = companies[0].id || companies[0].companyId || String(companies[0].collectionCompanyId);
            setTimeout(() => setSelectedCompanyId(firstId), 0);
        }
    }, [companies, selectedCompanyId]);

    // Fetch capacity when company changes
    useEffect(() => {
        if (selectedCompanyId) {
            fetchCapacity(selectedCompanyId);
        }
    }, [selectedCompanyId, fetchCapacity]);

    const handleCompanySelect = (companyId: string) => {
        setSelectedCompanyId(companyId);
    };

    const stats = capacity ? [
        { title: 'Sức chứa tối đa', value: capacity.companyMaxCapacity },
        { title: 'Đang chứa', value: capacity.companyCurrentCapacity }
    ] : [];


    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header + Company Select */}
            <div className='flex flex-col gap-4 mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                            <Warehouse className='text-white' size={20} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900'>Năng lực đơn vị thu gom</h1>
                    </div>
                    <div className='flex gap-4 items-center justify-end'>
                        <div className='w-72'>
                            <SearchableSelect
                                options={companies}
                                value={selectedCompanyId ?? ''}
                                onChange={handleCompanySelect}
                                getLabel={(c: any) => c.name || c.companyName || 'N/A'}
                                getValue={(c: any) => c.id || c.companyId || String(c.collectionCompanyId)}
                                placeholder='Chọn công ty...'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {!selectedCompanyId ? (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400'>
                    Vui lòng chọn công ty để xem năng lực đơn vị thu gom
                </div>
            ) : (
                <>
                    {/* Company Capacity Summary */}
                    {capacity && !loadingCapacity && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                            {stats.map((s, idx) => {
                                const isPrimary = idx % 2 === 1;
                                const safeValue = isNaN(Number(s.value)) ? 0 : Number(s.value);
                                return (
                                    <div
                                        key={s.title}
                                        className={
                                            isPrimary
                                                ? 'bg-primary-600 p-6 rounded-xl flex flex-col justify-center'
                                                : 'bg-white border border-primary-100 p-6 rounded-xl flex flex-col justify-center'
                                        }
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <h3 className={isPrimary ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-primary-700'}>{s.title}</h3>
                                            <TrendingUp size={18} className={isPrimary ? 'text-white opacity-80' : 'text-primary-400 opacity-80'} />
                                                <span className={isPrimary ? 'text-3xl font-bold ml-4 text-white' : 'text-3xl font-bold ml-4 text-primary-600'}>
                                                    {formatWeightKg(safeValue)} <span className={isPrimary ? 'text-sm font-normal text-white' : 'text-sm font-normal text-gray-500'}>kg</span>
                                                </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Warehouse List */}
                    <CapacityList
                        warehouses={capacity?.warehouses ?? []}
                        loading={loadingCapacity}
                    />
                </>
            )}
        </div>
    );
};

export default CapacityPage;
