import React, { useRef, useEffect } from 'react';
import CategoryShow from './CategoryShow';
import CategoryTableSkeleton from './CategoryTableSkeleton';
import { CompanyCategoryDetail } from '@/services/recycle/CategoryService';

interface CategoryListProps {
    categories: CompanyCategoryDetail[];
    loading: boolean;
    onViewDetail?: (category: CompanyCategoryDetail) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    loading,
    onViewDetail
}) => {
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [categories]);

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='max-h-90 overflow-y-auto' ref={tableRef}>
                        <table className='min-w-full text-sm text-gray-800 table-fixed'>
                            <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                <tr>
                                    <th className='py-3 px-4 text-center w-[5vw] min-w-[5vw]'>STT</th>
                                    <th className='py-3 px-4 text-left w-[40vw] min-w-[20vw]'>Tên danh mục</th>
                                    <th className='py-3 px-4 text-center w-[12vw] min-w-[8vw]'>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <CategoryTableSkeleton key={idx} />
                                    ))
                                ) : categories.length > 0 ? (
                                    categories.map((category, idx) => (
                                        <CategoryShow
                                            key={category.categoryId}
                                            category={category}
                                            stt={idx + 1}
                                            isLast={idx === categories.length - 1}
                                            onViewDetail={onViewDetail ? () => onViewDetail(category) : undefined}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className='text-center py-8 text-gray-400'>
                                            Chưa có danh mục nào được đăng ký.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
