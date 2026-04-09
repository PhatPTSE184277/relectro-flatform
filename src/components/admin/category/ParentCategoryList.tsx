'use client';

import React from 'react';
import { Folder, Eye } from 'lucide-react';
import type { AdminParentCategory } from '@/services/admin/CategoryService';
import ParentCategoryRowSkeleton from './ParentCategoryRowSkeleton';

interface ParentCategoryListProps {
    categories: AdminParentCategory[];
    loading?: boolean;
    selectedParentId?: string | null;
    onSelect: (cat: AdminParentCategory) => void;
}

const ParentCategoryList: React.FC<ParentCategoryListProps> = ({
    categories,
    loading = false,
    selectedParentId,
    onSelect
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
            <div className='flex items-center gap-2 p-4 border-b border-primary-100 bg-linear-to-r from-primary-50 to-primary-100'>
                <Folder size={18} className='text-primary-600' />
                <h2 className='font-bold text-gray-800'>Danh mục cha</h2>
            </div>

            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[56vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[48vh] xl:max-h-[56vh] overflow-y-auto w-full'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                            <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                                <tr>
                                                    <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                                    <th className='py-3 px-4 text-left'>Tên</th>
                                                    <th className='py-3 px-4 text-center w-[110px] whitespace-nowrap'>Hành động</th>
                                                </tr>
                                            </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <ParentCategoryRowSkeleton key={idx} />
                                        ))
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className='py-8 text-center text-gray-400'>
                                                Không có danh mục
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((cat, idx) => {
                                            const isLast = idx === categories.length - 1;
                                            const isSelected = String(selectedParentId || '') === String(cat.id);
                                            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                            return (
                                                <tr
                                                    key={cat.id}
                                                    className={`${!isLast ? 'border-b border-primary-100' : ''} ${isSelected ? 'bg-primary-100' : rowBg}`}
                                                >
                                                    <td className='py-3 px-4 text-center'>
                                                        <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900 truncate' title={cat.name}>
                                                        {cat.name || 'N/A'}
                                                    </td>
                                                    <td className='py-3 px-4 w-[10vw]'>
                                                        <div className='flex justify-center'>
                                                            <button
                                                                onClick={() => onSelect(cat)}
                                                                className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
                                                                title='Mở danh mục con'
                                                                aria-label='Mở danh mục con'
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentCategoryList;
